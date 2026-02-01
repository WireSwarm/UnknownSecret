import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './App.css';
import { GeneratorPanel } from './components/generator/GeneratorPanel';
import { HistoryPanel } from './components/history/HistoryPanel';
import { useLocalStorage } from './utils/storage';

function App() {
  const [history, setHistory] = useLocalStorage('password_history', []);

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

  return (
    <div className="app-container">
      <header className="app-header animate-float">
        <div className="logo-wrapper glass-card">
          <ShieldCheck size={48} />
        </div>
        <h1 className="app-title text-gradient">UnknownSecret</h1>
        <p className="label-text">Premium Password Generator</p>
      </header>

      <main className="app-main">
        <section className="flex flex-col gap-4">
          {/* Generator */}
          <GeneratorPanel onCopyPassword={handleGeneratedPasswordCopy} />
        </section>

        <aside className="glass-card p-4 h-full" style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '500px' }}>
          <HistoryPanel history={history} onUpdateHistory={handleHistoryUpdate} />
        </aside>
      </main>
    </div>
  );
}

export default App;
