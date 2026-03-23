import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Github, Info } from 'lucide-react';
import { useLanguage } from '../../i18n';

const GITHUB_URL = 'https://github.com/WireSwarm/UnknownSecret';

function AboutModal({ onClose }) {
  const { t } = useLanguage();
  return (
    <div className="top-menu-modal-overlay" id="about-modal-overlay" onClick={onClose}>
      <div
        className="top-menu-modal glass-card"
        id="about-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="top-menu-modal-header" id="about-modal-header">
          <span className="top-menu-modal-title text-gradient" id="about-modal-title">{t('about_title')}</span>
          <button className="icon-btn" id="about-modal-close" onClick={onClose} aria-label={t('about_close')}>
            <X size={16} />
          </button>
        </div>
        <div className="top-menu-modal-body" id="about-modal-body">
          <p className="label-text" id="about-version">Version 1.0.1</p>
          <p id="about-desc" style={{ fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.75rem', color: 'var(--text-main)' }}>
            {t('about_desc')}
          </p>
          <div className="top-menu-modal-stack" id="about-stack">
            <span className="label-text" style={{ fontSize: '0.72rem' }}>Stack</span>
            <div className="top-menu-stack-tags" id="about-stack-tags">
              {['React', 'Vite', 'zxcvbn', 'Web Crypto API'].map((t) => (
                <span key={t} className="top-menu-stack-tag" id={`about-tag-${t.toLowerCase().replace(/\s/g, '-')}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopMenu({ language, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const menuRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className="top-menu-container" ref={menuRef} id="top-menu-container">
        <button
          className="icon-btn top-menu-toggle-btn"
          id="top-menu-toggle-btn"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isOpen && (
          <div className="top-menu-dropdown glass-card" id="top-menu-dropdown">
            {/* Language */}
            <div className="top-menu-section" id="top-menu-lang-section">
              <span className="label-text top-menu-section-label" id="top-menu-lang-label">{t('menu_lang')}</span>
              <div className="top-menu-lang-btns" id="top-menu-lang-btns">
                <button
                  id="lang-btn-fr"
                  className={`top-menu-lang-btn${language === 'fr' ? ' active' : ''}`}
                  onClick={() => onLanguageChange('fr')}
                  title="Français"
                >
                  🇫🇷 FR
                </button>
                <button
                  id="lang-btn-en"
                  className={`top-menu-lang-btn${language === 'en' ? ' active' : ''}`}
                  onClick={() => onLanguageChange('en')}
                  title="English"
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>

            <div className="top-menu-divider" id="top-menu-divider-1" />

            {/* GitHub */}
            <a
              id="top-menu-github-link"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="top-menu-link"
              onClick={() => setIsOpen(false)}
            >
              <Github size={15} />
              {t('menu_source_code')}
            </a>

            {/* About */}
            <button
              id="top-menu-about-btn"
              className="top-menu-link"
              onClick={() => { setShowAbout(true); setIsOpen(false); }}
              disabled
              style={{ opacity: 0.35, cursor: 'not-allowed' }}
            >
              <Info size={15} />
              {t('menu_about')}
            </button>
          </div>
        )}
      </div>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  );
}
