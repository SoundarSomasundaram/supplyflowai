from langchain.tools import tool
import requests
from bs4 import BeautifulSoup
from tavily import TavilyClient
import os
from dotenv import load_dotenv
from inventory_db import get_inventory_record

load_dotenv()

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def get_internal_inventory(product: str, warehouse: str) -> str:
    """Retrieve internal inventory metrics for a product at a specific warehouse.
    Returns stock level, safety stock, capacity, avg daily sales, and nearby warehouses.
    """
    record = get_inventory_record(product, warehouse)
    
    # Format the data cleanly for the agents
    out = [
        f"INTERNAL INVENTORY REPORT for {record['product']} at {record['warehouse']}:",
        f"Current Stock: {record['stock']}",
        f"Safety Stock Level: {record['safety_stock']}",
        f"Warehouse Capacity: {record['capacity']}",
        f"Average Daily Sales: {record['avg_daily_sales']}",
        "Nearby Warehouses with same product:"
    ]
    for w in record["nearby_warehouses"]:
        out.append(f"  - Warehouse: {w['name']}, Stock: {w['stock']} units, Distance: {w['distance_km']} km")
        
    return "\n".join(out)

@tool
def search_external_conditions(product: str, location: str) -> str:
    """Search the web for real-world conditions that might impact inventory demand or supply.
    This includes weather forecasts, public holidays, local festivals, traffic disruptions, 
    and logistics/supplier news in the target location/region.
    """
    query = (
        f"{location} weather forecast, public holidays, local festivals, "
        f"traffic disruptions, logistics news affecting {product} supply chain"
    )
    results = tavily.search(query=query, max_results=5)

    out = []
    for r in results['results']:
        out.append(
            f"Title: {r['title']}\nURL: {r['url']}\nContent: {r['content']}\n"
        )
    return "\n----\n".join(out)

@tool
def scrape_url(url: str) -> str:
    """Scrape and return clean text content from a given URL for deeper reading."""
    try:
        resp = requests.get(url, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()
        return soup.get_text(separator=" ", strip=True)[:3000]
    except Exception as e:
        return f"Could not scrape URL: {str(e)}"
