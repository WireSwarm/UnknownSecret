# 🛡️ UnknownSecret

**A premium, zero-trace password generator with full UTF-8 support.**

[![Open UnknownSecret](https://img.shields.io/badge/⚡%20Launch%20UnknownSecret-1e2d3d?style=for-the-badge&labelColor=0d1520)](https://unknownsecret.pages.dev)

---

UnknownSecret proves that security tools can be beautiful. It ships a polished, animated UI backed by a cryptographically solid engine, generating passwords from the entire UTF-8 spectrum with real-time entropy analysis, without ever writing a single character to disk.

## Features

**🔠 Full UTF-8 Charset Support** - Generate passwords using any script: Latin, Greek, Cyrillic, Arabic, Hebrew, emojis and more. Granular presets or a full custom charset, your call.

**📊 Real-time Entropy Analysis** - Crack-time estimation powered by `zxcvbn`, processed in a Web Worker so the UI stays fluid at all times.

**🕒 Secure Temporary History** - Copied a password then lost it? The session history keeps your recent generations close, and wipes itself clean the moment you close the tab. No local storage, no logs.

**⚙️ Advanced Generation Controls** - Byte-targeted generation, length randomization, mandatory character injection, minimum ASCII ratio (anti-tofu for legacy systems) and more.

## Getting Started

Make sure you have [Git](https://git-scm.com/downloads) and [Bun](https://bun.sh/docs/installation) installed, then run:

```bash
git clone https://github.com/WireSwarm/UnknownSecret.git
cd UnknownSecret
bun install
bun run dev
```

> [!NOTE]
> This project uses `bun` instead of `npm`. Do not use `npm` or `npx`.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the development server with HMR |
| `bun run build` | Build the production bundle into `dist/` |
| `bun run single` | Build the app into a single portable HTML file |

## Deployment

The `dist/` folder is ready for edge deployment. The live instance runs on [Cloudflare Pages](https://pages.cloudflare.com/).

## License

This project is open source. See [LICENSE](LICENSE) for details.
