import React from 'react';

export function GlassCard({ children, className = '', ...props }) {
    return (
        <div className={`glass-card ${className}`} {...props}>
            {children}
        </div>
    );
}
