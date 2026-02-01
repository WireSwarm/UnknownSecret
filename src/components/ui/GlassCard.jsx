import React from 'react';

export function GlassCard({ children, className = '', id, ...props }) {
    return (
        <div className={`glass-card ${className}`} id={id} {...props}>
            {children}
        </div>
    );
}
