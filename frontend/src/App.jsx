import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace" element={<Workspace />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
