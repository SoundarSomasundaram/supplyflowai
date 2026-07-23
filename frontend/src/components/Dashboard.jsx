import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Warehouse, ArrowLeft, Download, Plus, FileText } from 'lucide-react';

const SAMPLE_INVENTORY = [
  { product: "Milk", warehouse: "Chennai Central", stock: 45, safety_stock: 30, capacity: 200, avg_daily_sales: 60 },
  { product: "Bread", warehouse: "Bangalore Hub", stock: 150, safety_stock: 50, capacity: 300, avg_daily_sales: 40 },
  { product: "Sanitizer", warehouse: "Hyderabad Sector 1", stock: 25, safety_stock: 80, capacity: 500, avg_daily_sales: 50 },
  { product: "Face Masks", warehouse: "Mumbai Terminal 2", stock: 420, safety_stock: 100, capacity: 1000, avg_daily_sales: 150 },
  { product: "Bottled Water", warehouse: "Delhi North", stock: 80, safety_stock: 120, capacity: 600, avg_daily_sales: 90 },
  { product: "Cooking Oil", warehouse: "Cochin Port", stock: 310, safety_stock: 150, capacity: 800, avg_daily_sales: 75 },
  { product: "Rice Bags", warehouse: "Kolkata Depot", stock: 90, safety_stock: 200, capacity: 1500, avg_daily_sales: 110 },
  { product: "Wheat Flour", warehouse: "Ahmedabad Hub", stock: 180, safety_stock: 100, capacity: 500, avg_daily_sales: 45 },
  { product: "Baby Formula", warehouse: "Pune Link", stock: 15, safety_stock: 40, capacity: 150, avg_daily_sales: 20 },
  { product: "Hand Soap", warehouse: "Gurgaon Sector 4", stock: 240, safety_stock: 90, capacity: 400, avg_daily_sales: 55 }
];

export default function Dashboard() {
  const navigate = useNavigate();

  // Helper to trigger download of sample data as a CSV file
  const downloadCSV = () => {
    const headers = ["product", "warehouse", "stock", "safety_stock", "capacity", "avg_daily_sales"];
    const rows = SAMPLE_INVENTORY.map(row => 
      [row.product, row.warehouse, row.stock, row.safety_stock, row.capacity, row.avg_daily_sales].join(",")
    );
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#222222] text-white flex flex-col font-sans select-none">
      {/* Navigation Header */}
      <header className="px-8 py-6 flex justify-between items-center w-full relative z-10 max-w-[1200px] mx-auto border-b border-white/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-[#f3db05] transition-colors p-1.5 rounded hover:bg-white/5 cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Warehouse className="text-[#f3db05] w-5 h-5" />
            <span className="font-bold tracking-tight font-sans">Flowchain AI</span>
          </div>
          <span className="badge-day1 text-[10px] py-0.5 px-2">Sample DB</span>
        </div>
        <nav className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/workspace')}
            className="btn-primary-day1 text-xs py-2 px-4 rounded-full flex items-center gap-1"
          >
            Workspace
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-8 md:px-16 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2 font-sans">Sample Inventory Database</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              These are the active stock records simulating target warehouses. You can download this table as a CSV template to test the multi-agent decision engine.
            </p>
          </div>
          <button 
            onClick={downloadCSV}
            className="btn-ghost-day1 text-xs py-2.5 px-4 rounded-full flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#f3db05]" />
            Download CSV Template
          </button>
        </div>

        {/* Data Table */}
        <div className="card-day1 overflow-hidden border border-white/10 p-0">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 text-xs font-bold text-gray-400 tracking-wider">
            <FileText className="w-4 h-4 text-[#f3db05]" />
            <span>INVENTORY_DATABASE SNAPSHOT</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table-day1">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Warehouse Location</th>
                  <th>Current Stock</th>
                  <th>Safety Stock</th>
                  <th>Total Capacity</th>
                  <th>Avg Daily Sales</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_INVENTORY.map((row, index) => (
                  <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-bold text-[#f3db05]">{row.product}</td>
                    <td>{row.warehouse}</td>
                    <td className="font-mono">{row.stock} units</td>
                    <td className="font-mono text-gray-400">{row.safety_stock} units</td>
                    <td className="font-mono text-gray-400">{row.capacity} units</td>
                    <td className="font-mono">{row.avg_daily_sales} / day</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Information Callout */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="p-4 border border-white/5 rounded-lg bg-white/[0.01]">
            <h4 className="font-bold text-xs text-white mb-2 font-sans tracking-wide uppercase">// Milk Chennai Central</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Current stock (45) is near safety stock limits (30). Triggering analysis will search Chennai weather forecasts to audit demand spikes.
            </p>
          </div>
          <div className="p-4 border border-white/5 rounded-lg bg-white/[0.01]">
            <h4 className="font-bold text-xs text-white mb-2 font-sans tracking-wide uppercase">// Bread Bangalore Hub</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Currently holds surplus stock (150) well above safety buffer (50). Decision engine reserves this hub for potential peer-to-peer transfers.
            </p>
          </div>
          <div className="p-4 border border-white/5 rounded-lg bg-white/[0.01]">
            <h4 className="font-bold text-xs text-white mb-2 font-sans tracking-wide uppercase">// Sanitizer Hyd Sector 1</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Stock (25) is critically below safety stock (80). Run analysis to initiate peer transfer proposals from Auxiliary hubs.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
