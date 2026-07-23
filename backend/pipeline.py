from agents import build_reader_agent, build_search_agent, writer_chain, critic_chain
import sys

# Ensure Windows terminal doesn't crash on printing unicode characters from LLMs
sys.stdout.reconfigure(encoding='utf-8')

def run_inventory_pipeline(product: str, warehouse: str) -> dict:
    state = {}

    # Step 1: Search Agent
    print("\n" + "="*50)
    print(f"STEP 1: Search Agent - Gathering internal & external data for {product} at {warehouse}...")
    print("="*50)

    search_agent = build_search_agent()
    search_result = search_agent.invoke({
        "messages": [("user", f"Retrieve the internal inventory metrics and search the web for external conditions (weather, events, holidays, traffic, supply disruptions) for {product} at {warehouse}.")]
    })
    state["search_results"] = search_result["messages"][-1].content
    print("\n--- GATHERED RAW DATA ---")
    print(state["search_results"])

    # Step 2: Reader Agent
    print("\n" + "="*50)
    print("STEP 2: Reader Agent - Processing raw information into structured context...")
    print("="*50)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user", 
            f"Based on the following raw gathered data, extract all relevant metrics and facts "
            f"and compile them into a structured business context table.\n\n"
            f"Raw Data:\n{state['search_results']}"
        )]
    })
    state["structured_context"] = reader_result["messages"][-1].content
    print("\n--- STRUCTURED BUSINESS CONTEXT ---")
    print(state["structured_context"])

    # Step 3: Writer-Critic Loop
    print("\n" + "="*50)
    print("STEP 3: Decision Engine & Quality Validation (Writer-Critic Loop)...")
    print("="*50)

    feedback_history = []
    max_iterations = 3
    final_recommendation = ""
    final_critique = ""
    
    for iteration in range(1, max_iterations + 1):
        print(f"\n>>> Running Writer-Critic Iteration {iteration} of {max_iterations}...")
        
        # Prepare feedback for revision, if any
        if feedback_history:
            feedback_section = (
                "Here is the feedback from the previous iteration critique. "
                "You MUST revise your recommendation to fully address every point raised:\n"
                + "\n".join(feedback_history)
            )
        else:
            feedback_section = ""
            
        # 3a. Writer Chain generates recommendation
        recommendation = writer_chain.invoke({
            "product": product,
            "warehouse": warehouse,
            "context": state["structured_context"],
            "feedback_section": feedback_section
        })
        
        # 3b. Critic Chain evaluates recommendation
        critique = critic_chain.invoke({
            "context": state["structured_context"],
            "recommendation": recommendation
        })
        
        # Parse score & approval
        score = 80  # Default fallback
        approved = False
        for line in critique.split("\n"):
            line_strip = line.strip()
            if line_strip.lower().startswith("score:"):
                try:
                    score_str = line_strip.split(":")[1].strip().split("/")[0].strip()
                    score = int(score_str)
                except Exception:
                    pass
            elif line_strip.lower().startswith("approved:"):
                approved = "yes" in line_strip.lower()
                
        print(f"\n--- Critic Evaluation (Iteration {iteration}) ---")
        print(f"Score: {score}/100")
        print(f"Approved: {'Yes' if approved else 'No'}")
        print(critique)
        
        final_recommendation = recommendation
        final_critique = critique
        
        if approved or score >= 80:
            print("\n[✔] Recommendation approved by Senior Operations Critic!")
            break
        else:
            print(f"\n[✘] Recommendation rejected. Feeding critique back to Writer for rewrite...")
            feedback_history.append(f"--- Iteration {iteration} Critique (Score: {score}/100) ---\n{critique}\n")
            
    state["recommendation"] = final_recommendation
    state["critique"] = final_critique
    
    print("\n" + "="*50)
    print("FINAL OPERATIONAL RECOMMENDATION")
    print("="*50)
    print(state["recommendation"])
    
    return state

def run_inventory_pipeline_with_csv(csv_markdown: str) -> dict:
    state = {}

    # Step 1: Search Agent
    print("\n" + "="*50)
    print("STEP 1: Search Agent - Gathering external conditions for CSV snapshot...")
    print("="*50)

    search_agent = build_search_agent()
    prompt_msg = (
        f"Here is the internal inventory snapshot in Markdown format:\n\n"
        f"{csv_markdown}\n\n"
        f"Task:\n"
        f"1. Read the products and warehouses/locations in the snapshot.\n"
        f"2. Search the web for external conditions (weather, events, holidays, traffic, supply disruptions) "
        f"specifically for those products and locations. Use your search tool.\n"
        f"3. Return the raw metrics from the snapshot along with all raw search results collected. "
        f"Do not summarize or analyze."
    )
    
    search_result = search_agent.invoke({
        "messages": [("user", prompt_msg)]
    })
    state["search_results"] = search_result["messages"][-1].content
    print("\n--- GATHERED RAW DATA ---")
    print(state["search_results"])

    # Step 2: Reader Agent
    print("\n" + "="*50)
    print("STEP 2: Reader Agent - Processing raw information into structured context...")
    print("="*50)

    reader_agent = build_reader_agent()
    reader_result = reader_agent.invoke({
        "messages": [("user", 
            f"Based on the following raw gathered data, extract all relevant metrics and facts "
            f"and compile them into a structured business context table.\n\n"
            f"Raw Data:\n{state['search_results']}"
        )]
    })
    state["structured_context"] = reader_result["messages"][-1].content
    print("\n--- STRUCTURED BUSINESS CONTEXT ---")
    print(state["structured_context"])

    # Step 3: Writer-Critic Loop
    print("\n" + "="*50)
    print("STEP 3: Decision Engine & Quality Validation (Writer-Critic Loop)...")
    print("="*50)

    feedback_history = []
    max_iterations = 3
    final_recommendation = ""
    final_critique = ""
    
    for iteration in range(1, max_iterations + 1):
        print(f"\n>>> Running Writer-Critic Iteration {iteration} of {max_iterations}...")
        
        # Prepare feedback for revision, if any
        if feedback_history:
            feedback_section = (
                "Here is the feedback from the previous iteration critique. "
                "You MUST revise your recommendation to fully address every point raised:\n"
                + "\n".join(feedback_history)
            )
        else:
            feedback_section = ""
            
        # 3a. Writer Chain generates recommendation
        recommendation = writer_chain.invoke({
            "product": "CSV Snapshot Items",
            "warehouse": "Snapshot Locations",
            "context": state["structured_context"],
            "feedback_section": feedback_section
        })
        
        # 3b. Critic Chain evaluates recommendation
        critique = critic_chain.invoke({
            "context": state["structured_context"],
            "recommendation": recommendation
        })
        
        # Parse score & approval
        score = 80  # Default fallback
        approved = False
        for line in critique.split("\n"):
            line_strip = line.strip()
            if line_strip.lower().startswith("score:"):
                try:
                    score_str = line_strip.split(":")[1].strip().split("/")[0].strip()
                    score = int(score_str)
                except Exception:
                    pass
            elif line_strip.lower().startswith("approved:"):
                approved = "yes" in line_strip.lower()
                
        print(f"\n--- Critic Evaluation (Iteration {iteration}) ---")
        print(f"Score: {score}/100")
        print(f"Approved: {'Yes' if approved else 'No'}")
        print(critique)
        
        final_recommendation = recommendation
        final_critique = critique
        
        if approved or score >= 80:
            print("\n[✔] Recommendation approved by Senior Operations Critic!")
            break
        else:
            print(f"\n[✘] Recommendation rejected. Feeding critique back to Writer for rewrite...")
            feedback_history.append(f"--- Iteration {iteration} Critique (Score: {score}/100) ---\n{critique}\n")
            
    state["recommendation"] = final_recommendation
    state["critique"] = final_critique
    
    print("\n" + "="*50)
    print("FINAL OPERATIONAL RECOMMENDATION")
    print("="*50)
    print(state["recommendation"])
    
    return state

if __name__ == "__main__":
    print("Inventory Operations Analyst System")
    product = input("\nEnter product name (e.g., Milk, Bread, Sanitizer): ").strip()
    warehouse = input("Enter warehouse name (e.g., Chennai Central, Bangalore Hub, Hyderabad Sector 1): ").strip()
    
    # Defaults if user hits enter
    if not product:
        product = "Milk"
    if not warehouse:
        warehouse = "Chennai Central"
        
    run_inventory_pipeline(product, warehouse)
