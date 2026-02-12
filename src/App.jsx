import React, { useState, useEffect } from 'react';
import './styles.css';

// --- Mock Data for Store ---
const storeItems = [
  { id: 1, title: 'Advanced ECG Interpretation Guide', price: 49.99, description: 'Master 12-lead analysis.' },
  { id: 2, title: 'Pharmacology Flashcards (Physical)', price: 85.00, description: 'Essential drug protocols.' },
  { id: 3, title: 'Tactical Trauma Shears', price: 120.00, description: 'Heavy-duty clinical tools.' },
];

function App() {
  // Banking/XP State - Persists in LocalStorage
  const [xp, setXp] = useState(() => {
    const savedXp = localStorage.getItem('paramedicXp');
    return savedXp ? parseInt(savedXp, 10) : 100; // Start with 100 XP bonus
  });

  // Navigation State
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    localStorage.setItem('paramedicXp', xp.toString());
  }, [xp]);

  const handleAwardXp = (amount) => {
    setXp(prev => prev + amount);
  };

  // --- Views ---
  const renderContent = () => {
    switch (currentView) {
      case 'vitals':
        return <VitalsGame onComplete={handleAwardXp} />;
      case 'store':
        return <Storefront items={storeItems} xp={xp} />;
      case 'home':
      default:
        return <HomeDashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-brand-container">
          {/* SVG Logo based on user selection (Teal Shield/Cross) */}
          <svg className="brand-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5 C 20 5, 5 25, 5 50 C 5 75, 20 95, 50 95 C 80 95, 95 75, 95 50 C 95 25, 80 5, 50 5 Z M 50 15 C 70 15, 85 30, 85 50 C 85 70, 70 85, 50 85 C 30 85, 15 70, 15 50 C 15 30, 30 15, 50 15 Z" fill="none" stroke="currentColor" strokeWidth="8"/>
            <path d="M50 25 V 75 M 25 50 H 75" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="40" r="8" fill="currentColor"/>
            <path d="M35 70 Q 50 55 65 70" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"/>
          </svg>
          <div className="brand-text">PARAMEDIC<span className="tagline-dash">-</span>STUDENTS</div>
        </div>
        <div className="nav-menu">
          <button className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>HOME</button>
          <button className={`nav-link ${currentView === 'vitals' ? 'active' : ''}`} onClick={() => setCurrentView('vitals')}>VITALS SIM</button>
          <button className={`nav-link ${currentView === 'store' ? 'active' : ''}`} onClick={() => setCurrentView('store')}>SHOP</button>
        </div>
        <div className="xp-display">
          XP: {xp}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

// --- Sub-Components (Internal for single-file deployment) ---

function HomeDashboard({ setCurrentView }) {
  return (
    <div className="module-grid">
      <div className="panel vitals-monitor">
        <h1>Welcome, Student.</h1>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Your shift begins now. Access clinical simulations to earn XP or visit the store for equipment.</p>
        <button className="btn-teal" onClick={() => setCurrentView('vitals')}>START CLINICAL SHIFT</button>
      </div>
    </div>
  );
}

function VitalsGame({ onComplete }) {
  const [status, setStatus] = useState('Ready to analyze.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setStatus('Analyzing rhythm...');
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      const success = Math.random() > 0.3; // 70% success rate for demo
      if (success) {
        setStatus('Rhythm Identified: Sinus Tachycardia. Correct treatment applied. +50 XP');
        onComplete(50);
      } else {
        setStatus('Analysis Failed: Incorrect intervention. Try again.');
      }
    }, 2000);
  };

  return (
    <div className="module-grid">
      <div className="panel vitals-monitor">
        <h2>Vitals Monitor Sim</h2>
        <div className="ecg-screen">
          {/* Simulated ECG wavy line */}
          <div className="ecg-line-animated" style={{
             backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 45%, var(--teal) 50%, transparent 55%, transparent 100%)',
             backgroundSize: '50px 100%'
          }}></div>
        </div>
        <p style={{ color: isAnalyzing ? 'var(--teal)' : 'white', marginBottom: '1rem' }}>STATUS: {status}</p>
        <button className="btn-teal" onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? 'ANALYZING...' : 'ANALYZE RHYTHM & INTERVENE'}
        </button>
      </div>
    </div>
  );
}

function Storefront({ items, xp }) {
  return (
    <div className="module-grid">
      {items.map(item => (
        <div key={item.id} className="panel store-card">
          <div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{item.description}</p>
          </div>
          <div>
            <div className="price-tag">AUD ${item.price.toFixed(2)}</div>
            <button className="btn-teal" disabled={xp < item.price} style={{ opacity: xp < item.price ? 0.5 : 1 }}>
              {xp < item.price ? `NEED ${item.price - xp} MORE XP` : 'BUY NOW'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
