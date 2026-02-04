import React, { useState } from 'react';
import { HelpCircle, Info, X, ChevronDown, ChevronUp } from 'lucide-react';
import './Showcase.css';

const HelpText = () => (
    <span>
        <strong>Pourquoi utiliser cette option ?</strong><br />
        Cette option est utile lorsqu'un attaquant connaît la longueur maximale des mots de passe générés par cet outil.
        <br /><br />
        Si vous utilisez systématiquement la même longueur pour un service donné, activer le "Fuzz Length" permet de varier
        légèrement la longueur finale pour <em>brouiller les pistes</em> et compliquer l'analyse statistique.
    </span>
);

export const HelpShowcase = ({ onExit }) => {
    const [inlineOpen, setInlineOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    return (
        <div className="showcase-container animate-fade-in">
            <div className="showcase-header">
                <button onClick={onExit} style={{ position: 'absolute', left: '2rem', top: '2rem', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                    ← Retour
                </button>
                <h1 className="showcase-title">Help UI Patterns</h1>
                <p style={{ color: '#94a3b8' }}>Démonstration de différents styles d'aide contextuelle</p>
            </div>

            <div className="showcase-grid">

                {/* Option 1: Hover Tooltip */}
                <div className="showcase-card">
                    <div className="card-title">
                        <span style={{ background: 'rgba(96, 165, 250, 0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' }}>01</span>
                        Classic Hover
                    </div>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Survolez le point d'interrogation. Idéal pour une aide rapide et non-intrusive.
                    </p>

                    <div className="control-row">
                        <span>Fuzz Length</span>
                        <div className="tooltip-wrapper">
                            <button className="help-trigger" aria-label="Help">
                                <HelpCircle size={20} />
                            </button>
                            <div className="tooltip-content">
                                <HelpText />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Option 2: Inline Expandable */}
                <div className="showcase-card">
                    <div className="card-title">
                        <span style={{ background: 'rgba(167, 139, 250, 0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' }}>02</span>
                        Inline Expand
                    </div>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Cliquez pour dérouler l'explication. Idéal pour les textes longs ou sur mobile.
                    </p>

                    <div className="control-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Fuzz Length</span>
                            <button
                                className="help-trigger"
                                onClick={() => setInlineOpen(!inlineOpen)}
                                style={{ transform: inlineOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            >
                                {inlineOpen ? <ChevronUp size={20} /> : <HelpCircle size={20} />}
                            </button>
                        </div>

                        {inlineOpen && (
                            <div className="inline-help-panel animate-slide-down">
                                <HelpText />
                            </div>
                        )}
                    </div>
                </div>

                {/* Option 3: Glass Popover */}
                <div className="showcase-card">
                    <div className="card-title">
                        <span style={{ background: 'rgba(244, 114, 182, 0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' }}>03</span>
                        Glass Popover
                    </div>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                        Cliquez pour ouvrir un panneau flottant. Style "Premium" et moderne.
                    </p>

                    <div className="control-row popover-container">
                        <span>Fuzz Length</span>
                        <button
                            className={`help-trigger ${popoverOpen ? 'active' : ''}`}
                            onClick={() => setPopoverOpen(!popoverOpen)}
                        >
                            <Info size={20} />
                        </button>

                        {popoverOpen && (
                            <div className="glass-popover">
                                <button className="close-btn" onClick={() => setPopoverOpen(false)}>
                                    <X size={14} />
                                </button>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f472b6' }}>À propos de Fuzz Length</h4>
                                <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#e2e8f0' }}>
                                    <HelpText />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
