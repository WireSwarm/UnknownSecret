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

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">History</h2>
                {history.length > 0 &&
                    <Button variant="ghost" onClick={clearHistory} className="px-3 py-1 text-xs h-8">Clear</Button>
                }
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-2" style={{ maxHeight: '600px' }}>
                {history.length === 0 && <p className="text-muted text-center py-8">No history yet.<br /><span className="text-xs">Generated passwords will appear here when copied.</span></p>}
                {sortedHistory.map(item => (
                    <GlassCard key={item.id} className="p-3 flex items-center justify-between group hover:bg-white-5 transition-colors">
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2">
                                {item.favorite && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                                <span className="font-mono text-sm truncate block" title={item.password}>{item.password}</span>
                            </div>
                            {item.name ?
                                <span className="text-xs text-muted block mt-1">{item.name}</span> :
                                <span className="text-xs text-muted block mt-1 opacity-50">{new Date(item.timestamp).toLocaleTimeString()}</span>
                            }
                        </div>
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleCopy(item.password)} className="p-2 hover:text-primary rounded hover:bg-white-10"><Copy size={16} /></button>
                            <button onClick={() => handleToggleFavorite(item.id)} className="p-2 hover:text-yellow-400 rounded hover:bg-white-10">
                                <Star size={16} className={item.favorite ? "fill-yellow-400" : ""} />
                            </button>
                            <button onClick={() => handleRename(item.id, item.name)} className="p-2 hover:text-secondary rounded hover:bg-white-10"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:text-red-500 rounded hover:bg-white-10"><Trash2 size={16} /></button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
