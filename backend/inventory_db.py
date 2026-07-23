# Simulated Internal Inventory Database

INVENTORY_DATABASE = {
    ("Milk", "Chennai Central"): {
        "product": "Milk",
        "warehouse": "Chennai Central",
        "stock": 45,
        "safety_stock": 30,
        "capacity": 200,
        "avg_daily_sales": 60,
        "nearby_warehouses": [
            {"name": "Chennai North", "stock": 180, "distance_km": 5},
            {"name": "Chennai South", "stock": 20, "distance_km": 15}
        ]
    },
    ("Bread", "Bangalore Hub"): {
        "product": "Bread",
        "warehouse": "Bangalore Hub",
        "stock": 150,
        "safety_stock": 50,
        "capacity": 300,
        "avg_daily_sales": 40,
        "nearby_warehouses": [
            {"name": "Bangalore South", "stock": 10, "distance_km": 8}
        ]
    },
    ("Sanitizer", "Hyderabad Sector 1"): {
        "product": "Sanitizer",
        "warehouse": "Hyderabad Sector 1",
        "stock": 25,
        "safety_stock": 80,
        "capacity": 500,
        "avg_daily_sales": 50,
        "nearby_warehouses": [
            {"name": "Hyderabad Sector 2", "stock": 300, "distance_km": 6}
        ]
    },
    ("Face Masks", "Mumbai Terminal 2"): {
        "product": "Face Masks",
        "warehouse": "Mumbai Terminal 2",
        "stock": 420,
        "safety_stock": 100,
        "capacity": 1000,
        "avg_daily_sales": 150,
        "nearby_warehouses": [
            {"name": "Mumbai Port", "stock": 50, "distance_km": 12}
        ]
    },
    ("Bottled Water", "Delhi North"): {
        "product": "Bottled Water",
        "warehouse": "Delhi North",
        "stock": 80,
        "safety_stock": 120,
        "capacity": 600,
        "avg_daily_sales": 90,
        "nearby_warehouses": [
            {"name": "Delhi South", "stock": 300, "distance_km": 18}
        ]
    },
    ("Cooking Oil", "Cochin Port"): {
        "product": "Cooking Oil",
        "warehouse": "Cochin Port",
        "stock": 310,
        "safety_stock": 150,
        "capacity": 800,
        "avg_daily_sales": 75,
        "nearby_warehouses": [
            {"name": "Cochin Link", "stock": 20, "distance_km": 4}
        ]
    },
    ("Rice Bags", "Kolkata Depot"): {
        "product": "Rice Bags",
        "warehouse": "Kolkata Depot",
        "stock": 90,
        "safety_stock": 200,
        "capacity": 1500,
        "avg_daily_sales": 110,
        "nearby_warehouses": [
            {"name": "Kolkata Port", "stock": 400, "distance_km": 10}
        ]
    },
    ("Wheat Flour", "Ahmedabad Hub"): {
        "product": "Wheat Flour",
        "warehouse": "Ahmedabad Hub",
        "stock": 180,
        "safety_stock": 100,
        "capacity": 500,
        "avg_daily_sales": 45,
        "nearby_warehouses": [
            {"name": "Ahmedabad South", "stock": 30, "distance_km": 7}
        ]
    },
    ("Baby Formula", "Pune Link"): {
        "product": "Baby Formula",
        "warehouse": "Pune Link",
        "stock": 15,
        "safety_stock": 40,
        "capacity": 150,
        "avg_daily_sales": 20,
        "nearby_warehouses": [
            {"name": "Pune Auxiliary", "stock": 90, "distance_km": 9}
        ]
    },
    ("Hand Soap", "Gurgaon Sector 4"): {
        "product": "Hand Soap",
        "warehouse": "Gurgaon Sector 4",
        "stock": 240,
        "safety_stock": 90,
        "capacity": 400,
        "avg_daily_sales": 55,
        "nearby_warehouses": [
            {"name": "Gurgaon Auxiliary", "stock": 10, "distance_km": 5}
        ]
    }
}

def get_inventory_record(product: str, warehouse: str) -> dict:
    """Helper to query the inventory record case-insensitively."""
    # Try exact match first
    key = (product, warehouse)
    if key in INVENTORY_DATABASE:
        return INVENTORY_DATABASE[key]
    
    # Case-insensitive match
    for (p, w), record in INVENTORY_DATABASE.items():
        if p.lower() == product.lower() and w.lower() == warehouse.lower():
            return record
            
    # Default fall-back if not found
    return {
        "product": product,
        "warehouse": warehouse,
        "stock": 50,
        "safety_stock": 40,
        "capacity": 250,
        "avg_daily_sales": 30,
        "nearby_warehouses": [
            {"name": f"{warehouse} Auxiliary", "stock": 100, "distance_km": 10}
        ]
    }
