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
        <div className={`flex flex-col gap-2 ${wrapperClassName}`} id={props.id ? `${props.id}-wrapper` : undefined}>
            {label && <label className="label-text" id={props.id ? `${props.id}-label` : undefined}>{label}</label>}
            <div className="input-wrapper relative" id={props.id ? `${props.id}-container` : undefined}>
                {icon && (
                    <div className="absolute left-3 flex items-center h-full text-muted" style={{ color: 'var(--text-muted)' }} id={props.id ? `${props.id}-icon` : undefined}>
                        {icon}
                    </div>
                )}
                <input
                    className={`input-field ${icon ? 'pl-10' : ''} ${className}`}
                    id={props.id}
                    {...props}
                />
                {rightElement && (
                    <div className="absolute right-3 flex items-center h-full gap-2" id={props.id ? `${props.id}-right-content` : undefined}>
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
}
