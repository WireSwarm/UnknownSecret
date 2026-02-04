import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export const HelpPopover = ({ title, content, children, isImportant }) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    // Force hover effect on parent card when open or hovering popover
    useEffect(() => {
        const trigger = triggerRef.current;
        if (!trigger) return;

        // Find the closest card or container that needs the hover effect
        const parentCard = trigger.closest('.glass-card') || trigger.closest('.preset-item');

        if (parentCard) {
            if (isOpen) {
                parentCard.classList.add('force-hover');
            } else {
                parentCard.classList.remove('force-hover');
            }
        }

        return () => {
            if (parentCard) parentCard.classList.remove('force-hover');
        };
    }, [isOpen]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen &&
                popoverRef.current && !popoverRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isOpen) {
            // Calculate position
            const rect = triggerRef.current.getBoundingClientRect();
            // Position: Top-Right of the trigger, but need to account for scroll
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            // Default alignment: to the right and slightly down
            let top = rect.bottom + scrollY + 10;
            let left = rect.left + scrollX - 250; // Align right side roughly

            // Adjust if off screen
            if (left < 10) left = 10;

            // Actually, let's just center it relative to trigger horizontally if max-width permits
            // Or use fixed position and portal? Portal is safer for z-index.

            setPosition({
                top: rect.bottom + 5,
                left: Math.max(10, rect.left - 240) // heuristic 
            });
        }
        setIsOpen(!isOpen);
    };

    // Auto-close on mouse leave logic
    // We bind it to the container if possible, but since we portaled, we check refs.
    // Instead of complex logic, let's keep it simple: if mouse leaves trigger, we start a timer.
    // If mouse enters popover, we clear timer. If mouse leaves popover, we start timer.

    // Actually, user said: "Click outside to close... oui et même si la souris se déplace"
    // To make it robust:
    // 1. Click Toggle.
    // 2. MouseLeave (Trigger OR Popover) -> Close after delay.

    const closeTimerRef = useRef(null);

    const handleMouseEnter = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    const handleMouseLeave = () => {
        closeTimerRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 600); // 600ms delay to allow moving between
    };

    const popoverContent = isOpen && createPortal(
        <div
            ref={popoverRef}
            className="glass-popover"
            style={{
                position: 'fixed', // Use fixed for portal
                top: position.top,
                left: position.left,
                width: '280px',
                zIndex: 9999, // Super high z-index
                // Reuse styles from Showcase.css essentially, but inline or via class
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '1.25rem',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                color: '#e2e8f0'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="close-btn"
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                }}
            >
                <X size={14} />
            </button>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#f472b6', fontSize: '0.9rem', fontWeight: 700 }}>
                {title}
            </h4>
            <div style={{ fontSize: '0.8rem', lineHeight: '1.5', color: '#cbd5e1' }}>
                {content}
            </div>
            {/* Animation Keyframes injected if not present */}
            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95) translateY(-10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>,
        document.body
    );

    return (
        <span
            className="help-trigger-wrapper"
            style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '0.5rem' }}
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="help-trigger-btn"
                onClick={handleToggle}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOpen ? '#60a5fa' : 'rgba(255, 255, 255, 0.3)', // Default discrete gray
                    transition: 'all 0.2s ease',
                    borderRadius: '50%'
                }}
                onMouseOver={(e) => {
                    if (!isOpen) e.currentTarget.style.color = '#60a5fa'; // Blue/Luminous on hover
                    e.currentTarget.style.textShadow = '0 0 8px rgba(96, 165, 250, 0.6)';
                }}
                onMouseOut={(e) => {
                    if (!isOpen) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.textShadow = 'none';
                }}
                aria-label="Help"
            >
                {/* Use AlertCircle/Info depending on importance if needed, but keeping it standard for now */}
                <Info size={14} />
            </button>
            {popoverContent}
        </span>
    );
};
