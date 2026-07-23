from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import os
import sys

# Ensure local imports inside backend folder work correctly
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from pipeline import run_inventory_pipeline_with_csv

app = FastAPI(title="Inventory Operations Control Center API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production scope
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Flowchain AI Backend is active and running"}

@app.post("/api/analyze-csv")
async def analyze_csv(
    file: UploadFile = File(...),
    product: str = Form(None),
    warehouse: str = Form(None)
):
    # 1. Validate file extension
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a CSV file.")
    
    try:
        # 2. Read file content bytes
        contents = await file.read()
        
        # 3. Parse CSV data into a Pandas DataFrame
        df = pd.read_csv(io.BytesIO(contents))
        
        # Validate column requirements
        required_cols = {'product', 'warehouse', 'stock', 'safety_stock'}
        df_cols_lower = set(df.columns.str.lower())
        if not required_cols.issubset(df_cols_lower):
            missing = required_cols - df_cols_lower
            raise HTTPException(
                status_code=400, 
                detail=f"CSV file is missing required columns: {', '.join(missing)}"
            )

        # 4. Filter the dataframe based on user scope filters (if provided)
        # Match case-insensitively
        filtered_df = df
        if product:
            prod_col = next(c for c in df.columns if c.lower() == 'product')
            filtered_df = filtered_df[filtered_df[prod_col].str.lower() == product.strip().lower()]
        
        if warehouse:
            wh_col = next(c for c in df.columns if c.lower() == 'warehouse')
            filtered_df = filtered_df[filtered_df[wh_col].str.lower() == warehouse.strip().lower()]
            
        if filtered_df.empty:
            raise HTTPException(
                status_code=400,
                detail=f"No matching inventory records found for Product: '{product or 'Any'}' at Warehouse: '{warehouse or 'Any'}'."
            )

        # 5. Convert filtered DataFrame to a Markdown table for the LLM agents
        csv_markdown = filtered_df.to_markdown(index=False)

        # 6. Execute the Multi-Agent Decision Pipeline
        print(f"\nRunning analysis for Product: '{product or 'Any'}' and Warehouse: '{warehouse or 'Any'}'...")
        state = run_inventory_pipeline_with_csv(csv_markdown)
        
        # 7. Return final response structure matching React expect blocks
        return {
            "status": "success",
            "structured_context": state.get("structured_context", ""),
            "critique": state.get("critique", ""),
            "recommendation": state.get("recommendation", "")
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error running pipeline: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pipeline Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
