import React from 'react';

export function Slider({ label, value, min, max, onChange, className = '', ...props }) {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            <div className="flex justify-between items-end">
                {label && <label className="label-text">{label}</label>}
                <span className="font-mono text-sm" style={{ color: 'var(--primary)' }}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                {...props}
            />
        </div>
    );
}
