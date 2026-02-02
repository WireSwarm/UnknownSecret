import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outFile = path.join(__dirname, '../src/data/recent_unstable.json');

// --- METHODOLOGIE "CONSERVATRICE" ---
// Nous allons identifier manuellement les plages "trop récentes" (Unicode 12 / 13 / 14 / 15)
// ou connues pour être problématiques sur des OS > 3-4 ans.

// Sources: 
// - Unicode Version History
// - Emojipedia Changelogs
// - Windows Segoe UI Emoji version history

// RÈGLE : TOUT CE QUI EST "RÉCENT" (Introduit dans Unicode >= 12.0 - Mars 2019)
// Cela éliminera 1F90B (Unicode 12.0) et 1FA52 (Unicode 13.0).

const RECENT_RANGES = [
    // --- EMOJI & SYMBOLS EXTENSIONS RÉCENTES ---

    // Symbols and Pictographs Extended-A (1FA70..1FAFF) -> Unicode 13.0 (2020)
    { start: 0x1FA70, end: 0x1FAFF },

    // Chess Symbols (1FA00..1FA6F) -> Unicode 11.0 / 12.0 / 13.0 mix
    // Beaucoup sont Unicode 12+. On sécurise le bloc entier.
    { start: 0x1FA00, end: 0x1FA6F },

    // Symbols for Legacy Computing (1FB00..1FBFF) -> Unicode 13.0 (2020)
    // Souvent non supporté par les polices standard Web.
    { start: 0x1FB00, end: 0x1FBFF },

    // Supplemental Symbols and Pictographs (1F900..1F9FF)
    // Contient beaucoup d'ajouts Unicode 12.0 (2019) comme l'Oignon, la Gaufre, le Guide Dog...
    // et 1F90B (Down-Pointing Hand?) -> Unicode 12.0
    // Pour "Only Printable" safe, on peut être agressif sur ce bloc.
    // Unicode 10/11 occupait déjà une grosse partie, mais 12/13/14/15 ont bouché les trous.
    // Stratégie : On va identifier les trous "récents" ou bannir les plages spécifiques.
    // 1F90C - 1F90F (Unicode 13)
    // 1F972 (Smiling with Tear - Uni 13)
    // 1F977 (Ninja - Uni 13)
    // Simplification : Exclure tout le bloc "Supplemental" (1F900-1F9FF) serait trop violent car il contient des emojis 2017 courants.
    // On va cibler les "Trous" qui ont été remplis récemment.

    // Plages spécifiques Unicode 12.0+ dans Supplemental (1F900-1F9FF)
    { start: 0x1F90D, end: 0x1F90F }, // Uni 12/13
    { start: 0x1F93F, end: 0x1F93F }, // Guide Dog etc.
    { start: 0x1F94B, end: 0x1F94F },
    { start: 0x1F971, end: 0x1F979 }, // Faces Uni 12+ (Yawning, Disguised...)
    { start: 0x1F9A3, end: 0x1F9FF }, // Plein d'animaux/objets récents (Mammoth, Dodos...)

    // Transport and Map Symbols (1F680..1F6FF) : Assez stable/vieux.

    // --- BLOCS ANCIENS MAIS MAL SUPPORTÉS ---
    // Supplemental Arrows-C (1F800..1F8FF) -> Introduit en Unicode 7.0 (2014)
    // Malgré l'âge, très peu de polices (même Segoe UI Symbol) supportent bien ce bloc Astral.
    // Contient U+1F8B2 qui posait problème.
    { start: 0x1F800, end: 0x1F8FF },

    // --- NOUVEAUX BLOCS DEPUIS 2019 ---
    // Khitan Small Script, Tangut Supplement... -> Pas des emojis, des écritures rares.
    // On assume que "All Unicode" ne veut pas dire "Ecritures mortes non supportées".
    // Mais on va se concentrer sur les Symboles/Emojis car c'est là que "ça se voit".
];

// Ajout spécifique des caractères signalés par l'utilisateur pour être sûr à 100%
const USER_REPORTED = [
    { start: 0x1F90B, end: 0x1F90B }, // 🤋 (Unicode 12)
    { start: 0x1FA52, end: 0x1FA52 }, // 🩒 (Plunger - Unicode 13)
    { start: 0x1FA2B, end: 0x1FA2B }  // 🨫 (Neutral Chess - Unicode 12)
];

const combined = [...RECENT_RANGES, ...USER_REPORTED];

// Tri et fusion simple pour la propreté (optionnel mais mieux)
combined.sort((a, b) => a.start - b.start);

const data = {
    generatedAt: new Date().toISOString(),
    comment: "Liste des plages Unicode >= 12.0 (2019+) considérées comme instables/non-imprimables sur les vieux systèmes.",
    unstable: combined
};

fs.writeFileSync(outFile, JSON.stringify(data, null, 2));
// console.log(`Unstable list written to ${outFile}`);
