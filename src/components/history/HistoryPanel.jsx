import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Edit2, Star } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

export function HistoryPanel({ history, onUpdateHistory }) {
    // history is array: { id, password, timestamp, name (opt), favorite (opt) }

    const handleDelete = (id) => {
        const newHistory = history.filter(h => h.id !== id);
        onUpdateHistory(newHistory);
    };

    const handleToggleFavorite = (id) => {
        const newHistory = history.map(h =>
            h.id === id ? { ...h, favorite: !h.favorite } : h
        );
        onUpdateHistory(newHistory);
    };

    const handleRename = (id, currentName) => {
        const name = prompt("Enter new name:", currentName || "");
        if (name !== null) {
            const newHistory = history.map(h =>
                h.id === id ? { ...h, name } : h
            );
            onUpdateHistory(newHistory);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const clearHistory = () => {
        if (window.confirm("Clear all history? Favorites will be kept.")) {
            onUpdateHistory(history.filter(h => h.favorite));
        }
    };

    // Sort: Favorites first, then Newest first
    const sortedHistory = [...history].sort((a, b) => {
        // if one is fav and other is not
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
        // then by timestamp
        return b.timestamp - a.timestamp;
    });

    // Truncation logic: start [...] end
    const formatPassword = (p) => {
        if (p.length <= 16) return p;
        return `${p.slice(0, 8)} [...] ${p.slice(-8)}`;
    };

    return (
        <div className="flex flex-col gap-4 h-full" id="history-panel">
            <div className="flex justify-between items-center" id="history-header">
                <h2 className="text-xl font-bold" id="history-title">History</h2>
                {history.length > 0 &&
                    <Button variant="ghost" onClick={clearHistory} className="px-3 py-1 text-xs h-8" id="clear-history-btn">Clear</Button>
                }
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-2" style={{ maxHeight: '600px' }} id="history-items-container">
                {history.length === 0 && <p className="text-muted text-center py-8" id="history-empty-msg">No history yet.<br /><span className="text-xs">Generated passwords will appear here when copied.</span></p>}
                {sortedHistory.map(item => (
                    <GlassCard
                        key={item.id}
                        className="p-3 flex items-center justify-between group hover:bg-white-5 transition-colors history-item"
                        id={`history-item-${item.id}`}
                        onClick={() => handleCopy(item.password)}
                    >
                        <div className="flex-1 overflow-hidden" id={`history-item-content-${item.id}`}>
                            <div className="flex flex-col" id={`history-item-stack-${item.id}`}>
                                {/* Swap: Name on top, Password below */}
                                <div className="flex items-center gap-2 mb-1" id={`history-item-meta-${item.id}`}>
                                    {item.favorite && <Star size={12} className="text-yellow-400 fill-yellow-400" id={`history-fav-icon-${item.id}`} />}
                                    {item.name ?
                                        <span className="text-xs font-semibold text-primary" id={`history-name-${item.id}`}>{item.name}</span> :
                                        <span className="text-xs text-muted opacity-50" id={`history-time-${item.id}`}>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                    }
                                </div>
                                <span className="font-mono text-sm truncate block password-trunc" title={item.password} id={`history-pwd-${item.id}`}>
                                    {formatPassword(item.password)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()} id={`history-actions-${item.id}`}>
                            {/* Item copy is already handled by card click, but keeping explicit icons if needed, or removing padding to avoid double click */}
                            <button onClick={() => handleToggleFavorite(item.id)} className="icon-btn icon-btn-secondary" id={`history-fav-btn-${item.id}`}>
                                <Star size={18} className={item.favorite ? "fill-yellow-400 text-yellow-400" : ""} />
                            </button>
                            <button onClick={() => handleRename(item.id, item.name)} className="icon-btn icon-btn-primary" id={`history-rename-btn-${item.id}`}><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(item.id)} className="icon-btn" style={{ color: 'rgba(239, 68, 68, 0.7)' }} id={`history-delete-btn-${item.id}`}><Trash2 size={18} /></button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
