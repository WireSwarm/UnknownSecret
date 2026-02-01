import React from 'react';

export function Toggle({ checked, onChange, label, className = '', ...props }) {
    return (
        <label className={`flex items-center justify-between cursor-pointer ${className}`}>
            {label && <span className="label-text">{label}</span>}
            <input
                type="checkbox"
                className="toggle-switch"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                {...props}
            />
        </label>
    );
}
