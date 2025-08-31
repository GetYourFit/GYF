import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import OutfitCatalog from './components/OutfitCatalog';
import FloatingClothes from './components/FloatingClothes';
import CameraCapture from './components/CameraCapture';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [userPreferences, setUserPreferences] = useState(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleStartCamera = () => {
    setShowCamera(true);
  };

  const handleCameraAnalysisComplete = (analysis, preferences, prompt) => {
    setUserPreferences(preferences);
    setUserPrompt(prompt);
    setShowCamera(false);
    // Navigation will be handled by the component that triggers this
  };

  const handleBackHome = () => {
    setUserPreferences(null);
    setUserPrompt('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <FloatingClothes />
        
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Header onLogoClick={handleBackHome} />
          
          <Routes>
            <Route 
              path="/" 
              element={
                <Hero 
                  onStartCamera={handleStartCamera}
                />
              } 
            />
            <Route 
              path="/catalog" 
              element={
                // userPreferences ? (
                  <OutfitCatalog 
                    preferences={userPreferences}
                    prompt={userPrompt}
                    onBack={handleBackHome}
                  />
                // ) : (
                //   <Navigate to="/" replace />
                // )
              } 
            />
          </Routes>

          <CameraCapture
            isOpen={showCamera}
            onClose={() => setShowCamera(false)}
            onAnalysisComplete={handleCameraAnalysisComplete}
          />
        </motion.div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;