import React from 'react';

export function Input({
    label,
    icon,
    rightElement,
    className = '',
    wrapperClassName = '',
    ...props
}) {
    return (
        <div className={`flex flex-col gap-2 ${wrapperClassName}`}>
            {label && <label className="label-text">{label}</label>}
            <div className="input-wrapper relative">
                {icon && (
                    <div className="absolute left-3 flex items-center h-full text-muted" style={{ color: 'var(--text-muted)' }}>
                        {icon}
                    </div>
                )}
                <input
                    className={`input-field ${icon ? 'pl-10' : ''} ${className}`}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute right-3 flex items-center h-full">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
}
