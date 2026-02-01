import React from 'react';

export function Slider({ label, value, min, max, onChange, className = '', id, ...props }) {
    return (
        <div className={`flex flex-col gap-2 w-full ${className}`} id={id ? `${id}-wrapper` : undefined}>
            <div className="flex justify-between items-end" id={id ? `${id}-header` : undefined}>
                {label && <label className="label-text" id={id ? `${id}-label` : undefined}>{label}</label>}
                <span className="font-mono text-sm" style={{ color: 'var(--primary)' }} id={id ? `${id}-val` : undefined}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                id={id}
                {...props}
            />
        </div>
    );
}
