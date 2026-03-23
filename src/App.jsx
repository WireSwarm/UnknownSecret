import React, { useEffect } from 'react';
import { ShieldCheck, Settings, History } from 'lucide-react';
import './App.css';
import { GeneratorPanel } from './components/generator/GeneratorPanel';
import { HistoryPanel } from './components/history/HistoryPanel';
import { TopMenu } from './components/ui/TopMenu';
// To re-enable the UI showcase, uncomment the line below.
// import { HelpShowcase } from './components/showcase/HelpShowcase';
import { useSessionStorage } from './utils/storage';
import { useLocalStorage } from './utils/storage';
import { LanguageProvider } from './i18n';

function App() {
  const [history, setHistory] = useSessionStorage('password_history', []);
  const [language, setLanguage] = useLocalStorage('app_language', navigator.language?.startsWith('fr') ? 'fr' : 'en');
  // const [showcaseMode, setShowcaseMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('config');

  const handleHistoryUpdate = (newHistory) => {
    setHistory(newHistory);
  };

  const handleGeneratedPasswordCopy = (result) => {
    if (result.alreadyCopied) return;

    const newItem = {
      id: Date.now().toString() + Math.random().toString().slice(2, 5),
      password: result.password,
      entropy: result.entropy,
      timestamp: result.timestamp || Date.now(),
      favorite: false,
      name: ''
    };

    setHistory([...history, newItem]);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const hasFavorites = history.some(item => item.favorite);
      if (hasFavorites) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [history]);

  // if (showcaseMode) {
  //   return <HelpShowcase onExit={() => setShowcaseMode(false)} />;
  // }

  return (
    <LanguageProvider language={language}>
    <div className="app-container" id="app-root">
      <header className="app-header animate-float" id="main-header">
        <div className="header-content" id="header-content">
          <div className="logo-wrapper glass-card" id="app-logo">
            <ShieldCheck size={32} />
          </div>
          <div className="title-stack" id="title-stack">
            <h1 className="app-title text-gradient" id="app-title">UnknownSecret</h1>
            <p className="label-text" id="app-subtitle">{language === 'fr' ? 'Générateur de mots de passe premium' : 'Premium Password Generator'}</p>
          </div>
        </div>
        <TopMenu language={language} onLanguageChange={setLanguage} />
      </header>

      <main className="app-main" id="main-content">
        <section className="generator-section" id="generator-section">
          <GeneratorPanel onCopyPassword={handleGeneratedPasswordCopy} />
        </section>

        <aside className="right-panel-aside" id="history-aside">
          {/* Tab Switcher */}
          <div className="right-panel-tabs" id="right-panel-tabs">
            <button
              id="tab-btn-config"
              className={`right-panel-tab-btn${activeTab === 'config' ? ' active' : ''}`}
              onClick={() => setActiveTab('config')}
            >
              <Settings size={14} />
              Configuration
            </button>
            <button
              id="tab-btn-history"
              className={`right-panel-tab-btn${activeTab === 'history' ? ' active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <History size={14} />
              {language === 'fr' ? 'Historique' : 'History'}
              {history.length > 0 && (
                <span className="right-panel-tab-badge" id="history-tab-badge">
                  {history.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="glass-card right-panel-card" id="right-panel-card">
            {/* Config Tab: portal target rendered by GeneratorPanel */}
            <div
              id="config-panel-portal"
              style={{ display: activeTab === 'config' ? 'flex' : 'none', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
            />
            {/* History Tab */}
            <div
              id="history-panel-wrapper"
              style={{ display: activeTab === 'history' ? 'flex' : 'none', flexDirection: 'column', height: '100%', padding: '1.25rem', overflow: 'hidden' }}
            >
              <HistoryPanel history={history} onUpdateHistory={handleHistoryUpdate} />
            </div>
          </div>
        </aside>
      </main>

      {/* To re-enable the UI showcase, uncomment this button */}
      {/* <button
        onClick={() => setShowcaseMode(true)}
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          cursor: 'pointer',
          backdropFilter: 'blur(5px)',
          fontSize: '0.8rem',
          zIndex: 1000
        }}
        id="showcase-toggle"
      >
        UI Showcase
      </button> */}
    </div>
    </LanguageProvider>
  );
}

export default App;
