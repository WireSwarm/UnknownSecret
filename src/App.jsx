import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import './App.css';
import { GeneratorPanel } from './components/generator/GeneratorPanel';
import { HistoryPanel } from './components/history/HistoryPanel';
import { useSessionStorage } from './utils/storage';

function App() {
  const [history, setHistory] = useSessionStorage('password_history', []);

  const handleHistoryUpdate = (newHistory) => {
    setHistory(newHistory);
  };

  const handleGeneratedPasswordCopy = (result) => {
    // result: { password, entropy, timestamp }
    const newItem = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      password: result.password,
      entropy: result.entropy,
      timestamp: result.timestamp || Date.now(),
      favorite: false,
      name: ''
    };

    // Add to history
    setHistory([...history, newItem]);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasFavorites = history.some(item => item.favorite);
      if (hasFavorites) {
        e.preventDefault();
        // Modern browsers require setting returnValue to show the dialog
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [history]);

  return (
    <div className="app-container" id="app-root">
      <header className="app-header animate-float" id="main-header">
        <div className="header-content" id="header-content">
          <div className="logo-wrapper glass-card" id="app-logo">
            <ShieldCheck size={32} />
          </div>
          <div className="title-stack" id="title-stack">
            <h1 className="app-title text-gradient" id="app-title">UnknownSecret</h1>
            <p className="label-text" id="app-subtitle">Premium Password Generator</p>
          </div>
        </div>
      </header>

      <main className="app-main" id="main-content">
        <section className="generator-section" id="generator-section">
          <GeneratorPanel onCopyPassword={handleGeneratedPasswordCopy} />
        </section>

        <aside className="glass-card history-aside" id="history-aside">
          <HistoryPanel history={history} onUpdateHistory={handleHistoryUpdate} />
        </aside>
      </main>
    </div>
  );
}

export default App;
