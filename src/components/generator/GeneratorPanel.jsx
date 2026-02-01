import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Eye, EyeOff, Dice5, ShieldAlert, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { generatePassword, PRESETS, buildCharset } from '../../utils/passwordGen';
import { EntropyMeter } from './EntropyMeter';

export function GeneratorPanel({ onCopyPassword }) {
    const [config, setConfig] = useState({
        length: 16,
        tokens: PRESETS.ASCII_STANDARD.tokens,
        exclude: '',
        include: '',
        ensureCommon: true,
    });

    const [result, setResult] = useState({ password: '', entropy: 0 });
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activePreset, setActivePreset] = useState(PRESETS.ASCII_STANDARD.id);

    // Generate function
    const handleGenerate = () => {
        const charset = buildCharset({ tokens: config.tokens, exclude: config.exclude, include: config.include });
        const res = generatePassword({
            length: config.length,
            charset,
            mandatoryChars: config.include,
            ensureCommonSymbols: config.ensureCommon && config.tokens.includes('symbols')
        });
        setResult(res);
        setCopied(false);
    };

    // Initial & Watch trigger
    useEffect(() => {
        handleGenerate();
    }, [config]);

    const copyToClipboard = () => {
        if (!result.password) return;
        navigator.clipboard.writeText(result.password);
        setCopied(true);
        if (onCopyPassword) onCopyPassword({ ...result, timestamp: Date.now() });
        // Reset copied state after 2s
        setTimeout(() => setCopied(false), 2000);
    };

    // Toggle handling
    const toggleToken = (token) => {
        const has = config.tokens.includes(token);
        let newTokens;
        if (has) newTokens = config.tokens.filter(t => t !== token);
        else newTokens = [...config.tokens, token];

        setConfig({ ...config, tokens: newTokens });
        setActivePreset('custom'); // Switch to custom if modified
    };

    const setPreset = (presetKey) => {
        setActivePreset(presetKey);
        setConfig({ ...config, tokens: PRESETS[presetKey].tokens });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Output Section */}
            <div className="relative">
                <Input
                    value={result.password}
                    readOnly
                    type={showPassword ? "text" : "password"}
                    className="pr-32 text-center text-lg font-bold tracking-wider"
                    wrapperClassName="mb-1"
                    rightElement={
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="p-2 text-muted hover:text-white transition-colors"
                                title={showPassword ? "Hide" : "Show"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            <button
                                onClick={handleGenerate}
                                className="p-2 text-muted hover:text-primary transition-colors hover:rotate-180 duration-500"
                                title="Regenerate"
                            >
                                <Dice5 size={20} />
                            </button>
                        </div>
                    }
                />
            </div>

            {/* Copy Button & Meter */}
            <div className="flex flex-col md:flex-row md-flex-row gap-4 items-start md:items-center md-items-center justify-between">
                <EntropyMeter entropy={result.entropy} />

                <Button
                    onClick={copyToClipboard}
                    className={`w-full md:w-auto md-w-auto mt-4 md:mt-0 md-mt-0 ${copied ? 'bg-green-500' : ''}`}
                    variant={copied ? 'ghost' : 'primary'}
                    style={copied ? { borderColor: '#10B981', color: '#10B981' } : {}}
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? 'Copied!' : 'Copy Password'}
                </Button>
            </div>

            {/* Controls */}
            <GlassCard className="p-6 mt-4">
                <h3 className="label-text mb-4">Presets</h3>
                {/* Presets */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {Object.keys(PRESETS).map(key => (
                        <button
                            key={key}
                            onClick={() => setPreset(key)}
                            className={`
                    px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                    ${activePreset === key ? 'bg-primary text-white shadow-lg' : 'bg-white-5 hover-bg-white-10 text-muted'}
                 `}
                        >
                            {PRESETS[key].name}
                        </button>
                    ))}
                    <button
                        className={`
                    px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border border-dashed border-white-20
                    ${activePreset === 'custom' ? 'text-primary border-primary' : 'text-muted'}
                 `}
                    >
                        Custom
                    </button>
                </div>

                <div className="grid grid-cols-1 md-grid-cols-2 gap-8">
                    {/* Left Column: Sliders & Checks */}
                    <div className="flex flex-col gap-6">
                        <Slider
                            label="Password Length"
                            value={config.length}
                            min={8}
                            max={128}
                            onChange={(val) => setConfig({ ...config, length: val })}
                        />

                        <div className="flex flex-col gap-3">
                            <h3 className="label-text mb-2">Character Sets</h3>
                            <Toggle
                                label="Uppercase (A-Z)"
                                checked={config.tokens.includes('uppercase')}
                                onChange={() => toggleToken('uppercase')}
                            />
                            <Toggle
                                label="Lowercase (a-z)"
                                checked={config.tokens.includes('lowercase')}
                                onChange={() => toggleToken('lowercase')}
                            />
                            <Toggle
                                label="Numbers (0-9)"
                                checked={config.tokens.includes('numbers')}
                                onChange={() => toggleToken('numbers')}
                            />
                            <Toggle
                                label="Symbols (!@#...)"
                                checked={config.tokens.includes('symbols')}
                                onChange={() => toggleToken('symbols')}
                            />
                            <Toggle
                                label="Extended ASCII"
                                checked={config.tokens.includes('extended')}
                                onChange={() => toggleToken('extended')}
                            />
                        </div>
                    </div>

                    {/* Right Column: Advanced */}
                    <div className="flex flex-col gap-6">
                        <h3 className="label-text">Advanced Options</h3>

                        <div className="p-4 rounded-xl bg-black-20 border border-white-5 flex flex-col gap-4">
                            <Toggle
                                label="Enhance Compatibility"
                                checked={config.ensureCommon}
                                onChange={(v) => setConfig({ ...config, ensureCommon: v })}
                                className="w-full"
                            />
                            <p className="text-xs text-muted leading-relaxed">
                                Forces insertion of standard symbols to satisfy most website requirements.
                            </p>
                        </div>

                        <Input
                            label="Must Include Characters"
                            placeholder="e.g. @Root"
                            value={config.include}
                            onChange={(e) => setConfig({ ...config, include: e.target.value })}
                            icon={<Sparkles size={16} />}
                        />

                        <Input
                            label="Forbidden Characters"
                            placeholder="e.g. I1l0O"
                            value={config.exclude}
                            onChange={(e) => setConfig({ ...config, exclude: e.target.value })}
                            icon={<ShieldAlert size={16} />}
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
