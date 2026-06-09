import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PredictionForm from './pages/PredictionForm';
import PredictionHistory from './pages/PredictionHistory';
import PredictionDetail from './pages/PredictionDetail';
import BarrelList from './pages/BarrelList';
import AddBarrel from './pages/AddBarrel';
import EditBarrel from './pages/EditBarrel';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/predict" replace />} />
        <Route path="/predict" element={<PredictionForm />} />
        <Route path="/history" element={<PredictionHistory />} />
        <Route path="/history/:id" element={<PredictionDetail />} />
        <Route path="/barrels" element={<BarrelList />} />
        <Route path="/barrels/add" element={<AddBarrel />} />
        <Route path="/barrels/:id/edit" element={<EditBarrel />} />
      </Routes>
    </BrowserRouter>
  );
}
