import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import './styles/App.css';
import './styles/ParticleEffects.css';

function App() {
  const [userName] = useState('aditya');

  return (
    <div className="app">
      {/* Particle Background Effects */}
      <div className="particle-container">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
      </div>
      
      {/* Grid Overlay */}
      <div className="grid-overlay"></div>
      
      {/* Ambient Glow Effects */}
      <div className="ambient-glow ambient-glow-1"></div>
      <div className="ambient-glow ambient-glow-2"></div>
      <div className="ambient-glow ambient-glow-3"></div>
      
      <ChatInterface userName={userName} />
    </div>
  );
}

export default App;
