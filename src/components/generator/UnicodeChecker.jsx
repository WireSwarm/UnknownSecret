import React, { useState } from 'react';
import { ClipboardCheck, ChevronDown, RefreshCw, Copy, Check, TriangleAlert } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Input } from '../ui/Input';
import { useLanguage } from '../../i18n';

const DiceIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        className={className}
        style={{ fill: 'currentColor' }}
    >
        <path d="M449.532,105.602L288.463,8.989C278.474,2.994,267.235,0,256.011,0c-11.239,0-22.483,2.994-32.467,8.989 L62.475,105.602c-19.012,11.406-30.647,31.95-30.647,54.117v192.562c0,22.168,11.635,42.711,30.647,54.117l161.069,96.613 c9.984,5.988,21.228,8.989,32.467,8.989c11.225,0,22.463-3.001,32.452-8.989l161.069-96.613 c19.012-11.406,30.64-31.949,30.64-54.117V159.719C480.172,137.552,468.544,117.008,449.532,105.602z M250.599,492.733 c-6.029-0.745-11.93-2.719-17.32-5.948L72.21,390.172c-13.306-7.989-21.456-22.369-21.456-37.891V159.719 c0-6.022,1.236-11.862,3.518-17.233l196.328,117.76V492.733z M59.669,133.114c3.364-4.464,7.593-8.318,12.541-11.285 l161.069-96.613c6.995-4.196,14.85-6.291,22.732-6.291c7.868,0,15.723,2.095,22.718,6.291l161.069,96.613 c4.941,2.967,9.184,6.821,12.54,11.285L256.011,250.881L59.669,133.114z M461.254,352.281c0,15.522-8.15,29.902-21.456,37.891 l-161.069,96.613c-5.398,3.229-11.292,5.203-17.321,5.948V260.246l196.328-117.76c2.283,5.37,3.518,11.211,3.518,17.233V352.281z" />
        <path d="M160.209,119.875c-9.828-7.278-26.021-7.465-36.165-0.41c-10.144,7.056-10.399,18.67-0.57,25.947 c9.828,7.277,26.022,7.459,36.159,0.41C169.783,138.766,170.038,127.152,160.209,119.875z" />
        <path d="M279.159,48.686c-9.829-7.277-26.022-7.458-36.172-0.403c-10.137,7.049-10.393,18.664-0.564,25.941 c9.829,7.284,26.022,7.458,36.159,0.416C288.732,67.578,288.987,55.963,279.159,48.686z" />
        <path d="M220.59,82.024c-9.834-7.27-26.028-7.458-36.172-0.403c-10.15,7.049-10.406,18.664-0.571,25.941 c9.829,7.284,26.022,7.458,36.166,0.416C230.151,100.916,230.412,89.302,220.59,82.024z" />
        <path d="M267.437,184.754c-9.828-7.277-26.015-7.459-36.159-0.41c-10.15,7.056-10.405,18.671-0.577,25.947 c9.828,7.284,26.021,7.459,36.172,0.41C277.01,203.645,277.265,192.031,267.437,184.754z" />
        <path d="M386.385,113.564c-9.828-7.271-26.021-7.458-36.158-0.403c-10.151,7.049-10.406,18.664-0.577,25.941 c9.828,7.284,26.02,7.458,36.172,0.416C395.959,132.456,396.214,120.842,386.385,113.564z" />
        <path d="M327.817,146.903c-9.829-7.27-26.022-7.458-36.172-0.403c-10.137,7.049-10.392,18.664-0.564,25.941 c9.828,7.284,26.021,7.465,36.158,0.416C337.391,165.795,337.646,154.188,327.817,146.903z" />
        <path d="M89.289,248.303c11.158,6.083,20.194,1.961,20.194-9.19c0-11.158-9.036-25.128-20.194-31.21 c-11.157-6.083-20.207-1.967-20.207,9.19C69.081,228.244,78.131,242.221,89.289,248.303z" />
        <path d="M202.061,309.771c11.158,6.082,20.208,1.967,20.208-9.184c0-11.157-9.05-25.135-20.208-31.217 c-11.15-6.076-20.194-1.961-20.194,9.198C181.867,289.719,190.911,303.689,202.061,309.771z" />
        <path d="M89.289,361.082c11.158,6.076,20.194,1.967,20.194-9.19c0-11.158-9.036-25.129-20.194-31.21 c-11.157-6.083-20.207-1.968-20.207,9.19C69.081,341.029,78.131,355,89.289,361.082z" />
        <path d="M202.061,422.55c11.158,6.082,20.208,1.967,20.208-9.191c0-11.151-9.05-25.128-20.208-31.21 c-11.15-6.076-20.194-1.961-20.194,9.19C181.867,402.497,190.911,416.468,202.061,422.55z" />
        <path d="M145.675,335.424c11.158,6.082,20.201,1.967,20.201-9.191c0-11.151-9.044-25.128-20.201-31.204 c-11.158-6.082-20.201-1.967-20.201,9.185C125.474,315.37,134.517,329.341,145.675,335.424z" />
        <path d="M418.341,207.902c-11.158,6.082-20.208,20.053-20.208,31.21c0,11.151,9.05,15.273,20.208,9.19 c11.144-6.082,20.194-20.059,20.194-31.21C438.535,205.935,429.486,201.819,418.341,207.902z" />
        <path d="M305.555,382.149c-11.158,6.082-20.194,20.059-20.194,31.21c0,11.158,9.036,15.273,20.194,9.191 c11.158-6.082,20.194-20.053,20.194-31.211C325.749,380.188,316.714,376.074,305.555,382.149z" />
        <path d="M361.948,295.028c-11.158,6.076-20.207,20.053-20.207,31.204c0,11.158,9.05,15.273,20.207,9.191 c11.158-6.083,20.194-20.053,20.194-31.21C382.142,293.062,373.106,288.947,361.948,295.028z" />
    </svg>
);

const SPECIAL_SUFFIXES = [
    '𒁦', '𒃯', '𒀌', '𒂐', '𒇰', '𒅒', '𒄆', '𒆮', '𒅋', '𒆝',
    '𒈰', '𒉲', '𒈷', '𒉹', '𒊼', '𒎉', '𓁑'
];

const getRandomChar = (charset) => charset.charAt(Math.floor(Math.random() * charset.length));

const generateBase = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let pwd = '';
    for (let i = 0; i < 10; i++) {
        pwd += getRandomChar(charset);
    }
    return pwd;
};

const CheckerField = ({ label, value, index, status, description, isControl, onRegen, copiedIndex, onCopy, regenTitle }) => (
    <div id={`unicode-checker-field-${index}`} className="flex flex-col" style={{ gap: '0.5rem' }}>
        <div className="flex justify-between items-center px-1">
            <label className="label-text" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{label}</label>
            <span
                className={`text-xs font-bold ${status === 'valid' ? 'text-green-500' : 'text-red-500'}`}
                style={{ fontSize: '0.7rem' }}
            >
                {description}
            </span>
        </div>
        <Input
            value={value}
            readOnly
            type="text"
            className="font-mono text-center tracking-wider keeper-ignore"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                fontSize: '0.875rem',
                padding: '0.7rem 1rem',
                paddingRight: isControl ? '5rem' : '3.5rem',
            }}
            rightElement={
                <div className="flex items-center gap-2">
                    {isControl && (
                        <button
                            id="unicode-checker-regen-btn"
                            onClick={onRegen}
                            className="icon-btn icon-btn-primary"
                            title={regenTitle}
                            style={{ padding: '6px' }}
                        >
                            <DiceIcon size={18} />
                        </button>
                    )}
                    <button
                        id={`unicode-checker-copy-btn-${index}`}
                        onClick={(e) => { e.stopPropagation(); onCopy(value, index); }}
                        className="icon-btn"
                        title="Copy"
                        style={{
                            padding: '6px',
                            color: copiedIndex === index ? '#10B981' : undefined
                        }}
                    >
                        {copiedIndex === index ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
            }
        />
    </div>
);

const StepItem = ({ id, number, title, desc, children, isLast }) => (
    <div id={id} style={{ display: 'flex', gap: '1rem' }}>
        {/* Step indicator column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '2rem' }}>
            <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: 'rgba(var(--secondary-rgb), 0.12)',
                border: '1.5px solid rgba(var(--secondary-rgb), 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                flexShrink: 0,
            }}>
                {number}
            </div>
            {!isLast && (
                <div style={{
                    width: '1.5px',
                    flex: 1,
                    minHeight: '1rem',
                    background: 'rgba(255,255,255,0.07)',
                    marginTop: '0.4rem',
                }} />
            )}
        </div>

        {/* Step content */}
        <div style={{ flex: 1, paddingBottom: isLast ? 0 : '1.75rem' }}>
            <h4 style={{
                fontWeight: 700,
                fontSize: '0.875rem',
                marginBottom: '0.25rem',
            }}>
                {title}
            </h4>
            <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                marginBottom: children ? '0.75rem' : 0,
            }}>
                {desc}
            </p>
            {children}
        </div>
    </div>
);

export const UnicodeChecker = React.forwardRef((props, ref) => {
    const { t } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [basePassword, setBasePassword] = useState(() => generateBase());
    const [suffix, setSuffix] = useState(() => SPECIAL_SUFFIXES[Math.floor(Math.random() * SPECIAL_SUFFIXES.length)]);
    const [copiedIndex, setCopiedIndex] = useState(null);

    React.useImperativeHandle(ref, () => ({
        open: () => setIsOpen(true)
    }));

    const handleRegenerate = (e) => {
        if (e) e.stopPropagation();
        setBasePassword(generateBase());
        setSuffix(SPECIAL_SUFFIXES[Math.floor(Math.random() * SPECIAL_SUFFIXES.length)]);
    };

    const copyToClipboard = (text, index) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const field1Value = basePassword + suffix;
    const field2Value = basePassword + '\uFFFD';
    const field3Value = basePassword;

    return (
        <GlassCard id="unicode-checker-card" className="transition-all duration-300 overflow-hidden" style={{ userSelect: 'none' }}>
            <div
                id="unicode-checker-header"
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-white-5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="text-secondary p-2 rounded-lg bg-white-5">
                        <ClipboardCheck size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">{t('unicode_check_title')}</h3>
                        <p className="text-xs text-muted" style={{ fontWeight: 400 }}>{t('unicode_check_sub')}</p>
                    </div>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-muted`}>
                    <ChevronDown size={20} />
                </div>
            </div>

            {isOpen && (
                <div
                    id="unicode-checker-body"
                    className="flex flex-col animate-in slide-in-from-top-2 fade-in duration-300"
                    style={{ padding: '1rem 2rem 2.5rem 2rem', gap: '1.5rem' }}
                >
                    {/* Lockout warning */}
                    <div
                        id="unicode-checker-warning"
                        className="rounded-lg border"
                        style={{
                            padding: '1.25rem',
                            background: 'rgba(234, 179, 8, 0.1)',
                            borderColor: 'rgba(234, 179, 8, 0.2)',
                        }}
                    >
                        <div className="flex gap-3">
                            <TriangleAlert size={20} style={{ color: '#FACC15', minWidth: '20px' }} />
                            <div className="flex flex-col gap-1">
                                <h4 className="font-bold text-xs uppercase tracking-wider" style={{ color: '#FEF9C3' }}>
                                    {t('lockout_warning_title')}
                                </h4>
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(254, 240, 138, 0.9)' }}>
                                    {t('lockout_warning_desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3-step workflow */}
                    <div id="unicode-checker-steps">
                        {/* Step 1 — Create / change password */}
                        <StepItem
                            id="unicode-checker-step-1"
                            number={1}
                            title={t('step1_title')}
                            desc={t('step1_desc')}
                            isLast={false}
                        >
                            <CheckerField
                                index={1}
                                label={t('field1_label')}
                                value={field1Value}
                                status="valid"
                                description={t('field1_status')}
                                isControl={true}
                                onRegen={handleRegenerate}
                                regenTitle={t('regenerate')}
                                copiedIndex={copiedIndex}
                                onCopy={copyToClipboard}
                            />
                        </StepItem>

                        {/* Step 2 — Log out and log back in */}
                        <StepItem
                            id="unicode-checker-step-2"
                            number={2}
                            title={t('step2_title')}
                            desc={t('step2_desc')}
                            isLast={false}
                        >
                            {/* Compact password reminder for quick re-copy */}
                            <div
                                id="unicode-checker-step2-reminder"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.55rem 0.9rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                }}
                            >
                                <span
                                    className="font-mono keeper-ignore"
                                    style={{
                                        flex: 1,
                                        fontSize: '0.8rem',
                                        color: 'var(--text-muted)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    {field1Value}
                                </span>
                                <button
                                    id="unicode-checker-step2-copy-btn"
                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(field1Value, 'step2'); }}
                                    className="icon-btn"
                                    title="Copy"
                                    style={{
                                        padding: '4px',
                                        flexShrink: 0,
                                        color: copiedIndex === 'step2' ? '#10B981' : undefined,
                                    }}
                                >
                                    {copiedIndex === 'step2' ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            </div>
                        </StepItem>

                        {/* Step 3 — Verify failing passwords */}
                        <StepItem
                            id="unicode-checker-step-3"
                            number={3}
                            title={t('step3_title')}
                            desc={t('step3_desc')}
                            isLast={true}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <CheckerField
                                    index={2}
                                    label={t('field2_label')}
                                    value={field2Value}
                                    status="invalid"
                                    description={t('field2_status')}
                                    copiedIndex={copiedIndex}
                                    onCopy={copyToClipboard}
                                />
                                <CheckerField
                                    index={3}
                                    label={t('field3_label')}
                                    value={field3Value}
                                    status="invalid"
                                    description={t('field3_status')}
                                    copiedIndex={copiedIndex}
                                    onCopy={copyToClipboard}
                                />
                            </div>
                        </StepItem>
                    </div>

                    {/* Conclusion */}
                    <div
                        id="unicode-checker-conclusion"
                        className="rounded-lg border"
                        style={{
                            padding: '0.9rem 1.25rem',
                            background: 'rgba(16, 185, 129, 0.08)',
                            borderColor: 'rgba(16, 185, 129, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <span style={{ fontSize: '1rem', flexShrink: 0 }}>✅</span>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(167, 243, 208, 0.9)' }}>
                            {t('compat_confirmed')}
                        </p>
                    </div>
                </div>
            )}
        </GlassCard>
    );
});
