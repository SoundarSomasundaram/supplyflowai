import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Warehouse, ArrowLeft, Upload, FileSpreadsheet, X, 
  Package, MapPin, Play, AlertCircle, CheckCircle2, 
  RefreshCw, Layers, ShieldCheck, ClipboardList
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function Workspace() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Form state
  const [file, setFile] = useState(null);
  const [product, setProduct] = useState('');
  const [warehouse, setWarehouse] = useState('');
  
  // UI feedback state
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Only CSV files are supported.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Only CSV files are supported.");
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Run multi-agent analysis
  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an inventory CSV file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    if (product) formData.append('product', product.trim());
    if (warehouse) formData.append('warehouse', warehouse.trim());

    const cleanBaseUrl = API_BASE_URL.replace(/\/+$/, '');
    try {
      const response = await axios.post(`${cleanBaseUrl}/api/analyze-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success' || response.data.recommendation) {
        setResult(response.data);
      } else {
        throw new Error("Invalid response schema received from the decision engine.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || "Could not connect to the inventory backend. Verify that the FastAPI server is running on port 8000.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderConciseCards = (text) => {
    if (!text) return null;
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return (
      <div className="space-y-3">
        {lines.map((line, idx) => {
          const colonIdx = line.indexOf(':');
          if (colonIdx > 0) {
            const label = line.substring(0, colonIdx).trim();
            const val = line.substring(colonIdx + 1).trim();
            const cleanLabel = label.replace(/^[-*#\s\d+\.]+\s*/, '');
            return (
              <div 
                key={idx} 
                className="p-3 bg-[#1c1d1f] rounded border border-white/5 flex flex-col gap-1 transition-all hover:border-white/10"
              >
                <span className="font-bold text-[10px] text-[#f3db05] uppercase tracking-wider">
                  {cleanLabel}
                </span>
                <span className="text-xs text-gray-200 leading-normal">
                  {val}
                </span>
              </div>
            );
          }
          const cleanLine = line.replace(/^[-*#\s\d+\.]+\s*/, '');
          if (!cleanLine) return null;
          return (
            <div 
              key={idx} 
              className="p-3 bg-[#1c1d1f] rounded border border-white/5 text-xs text-gray-200 leading-relaxed transition-all hover:border-white/10"
            >
              {cleanLine}
            </div>
          );
        })}
      </div>
    );
  };

  const renderRecommendation = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    let sectionCount = 0;
    
    return (
      <div className="space-y-4 font-sans text-xs leading-relaxed text-white">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          
          if (trimmed.startsWith('##')) {
            sectionCount += 1;
            const title = trimmed.replace(/^##\s*/, '');
            return (
              <h4 key={idx} className="text-sm font-bold text-[#f3db05] mt-6 first:mt-0 mb-2 border-b border-white/5 pb-1 uppercase tracking-wider font-sans">
                {sectionCount}. {title}
              </h4>
            );
          }
          
          if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
            const cleanItem = trimmed.replace(/^[-*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2 py-0.5">
                <span className="text-[#f3db05]">•</span>
                <span className="text-gray-200">{cleanItem}</span>
              </div>
            );
          }
          
          return (
            <p key={idx} className="text-gray-300 pl-1 py-0.5">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#222222] text-white flex flex-col font-sans select-none">
      {/* Header */}
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
          <span className="badge-day1 text-[10px] py-0.5 px-2">Console</span>
        </div>
        <nav className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-ghost-day1 text-xs py-1.5 px-3 rounded-full flex items-center gap-1.5"
          >
            View Sample Data
          </button>
        </nav>
      </header>

      {/* Main Form Area */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-8 md:px-16 py-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 font-sans">Supply Chain & Inventory Board</h2>
        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          Upload an inventory snapshot in CSV format to trigger the decision engine. You can optionally filter the evaluation scope by product and target warehouse.
        </p>

        <form onSubmit={handleRunAnalysis} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Column 1 & 2: CSV Upload Zone */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-sans">
                1. Supply Chain Database (.csv) *
              </label>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border border-dashed rounded-[0.25em] p-8 text-center cursor-pointer transition-all duration-150 ${
                  isDragOver 
                    ? 'border-[#f3db05] bg-white/5' 
                    : file 
                      ? 'border-[#f3db05]/40 bg-white/5' 
                      : 'border-white/10 hover:border-[#f3db05] bg-[#2d2d2d]'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className={`w-12 h-12 rounded-[0.25em] border border-white/10 flex items-center justify-center ${file ? 'bg-[#f3db05] text-black shadow-soft' : 'bg-[#222222] text-gray-400'}`}>
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  
                  {file ? (
                    <div className="w-full max-w-md">
                      <div className="flex items-center justify-between bg-[#1c1d1f] border border-white/10 px-3 py-2 rounded-[0.25em]">
                        <span className="text-xs font-semibold truncate text-white pr-2">
                          {file.name}
                        </span>
                        <button 
                          onClick={clearFile}
                          className="text-gray-400 hover:text-white p-0.5 rounded hover:bg-white/10 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#f3db05] font-bold mt-2">File loaded successfully. Ready to analyze.</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm font-bold text-[#f3db05] hover:underline">Click to browse</span>
                        <span className="text-sm text-gray-400"> or drag and drop your database CSV file here</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Requires columns: product, warehouse, stock, safety_stock</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3: Scope Filters */}
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                2. Scope Options (Optional)
              </label>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  Specific Product
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Milk"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="input-day1 w-full text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  Target Warehouse
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Chennai Central"
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="input-day1 w-full text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary-day1 flex items-center gap-2 text-sm py-2.5 px-6 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  Analyzing Snapshot...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-black" />
                  Run Supply Chain Analysis
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-8 border border-red-500 bg-[#2d2d2d] text-red-400 p-4 rounded-[0.25em] flex gap-3 items-start shadow-soft"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm font-sans">Analysis Execution Failed</h4>
                <p className="text-xs mt-1 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Spinner / Agent Stage Feedback */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 text-center py-8"
            >
              <div className="w-12 h-12 border-2 border-[#f3db05]/20 border-t-[#f3db05] rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="font-bold text-lg mb-2 font-sans">Engaging Supply Chain Agents</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                The Search Agent is querying database metrics and weather feeds; the Reader Agent is formatting inputs; and the Writer-Critic loop is refining recommendations. This may take 5–15 seconds.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Render */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8 animate-fade"
            >
              <div className="border-b border-white/10 pb-4 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2 font-sans">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                  Analysis Output
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold font-mono">PROCESSED OK</span>
              </div>

              {/* Recommendation Card */}
              <div className="card-day1 border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 font-sans">
                    <ShieldCheck className="w-5 h-5" />
                    <h4>Supply Chain Advisor Recommendation</h4>
                  </div>
                  <div className="mt-2">
                    {renderRecommendation(result.recommendation)}
                  </div>
                </div>
              </div>

              {/* Collapsible Details */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Structured Context Table */}
                <div className="card-day1 border-white/10 bg-[#2d2d2d]">
                  <div className="flex items-center gap-2 font-bold mb-4 border-b border-white/5 pb-2 font-sans">
                    <ClipboardList className="w-4 h-4 text-[#f3db05]" />
                    <h5 className="text-sm">Structured Business Facts</h5>
                  </div>
                  {renderConciseCards(result.structured_context)}
                </div>

                {/* Critic Evaluation Sheet */}
                <div className="card-day1 border-white/10 bg-[#2d2d2d]">
                  <div className="flex items-center gap-2 font-bold mb-4 border-b border-white/5 pb-2 font-sans">
                    <Layers className="w-4 h-4 text-[#f3db05]" />
                    <h5 className="text-sm">Operations Critic Audit</h5>
                  </div>
                  {renderConciseCards(result.critique)}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
