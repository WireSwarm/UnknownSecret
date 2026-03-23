export const translations = {
  fr: {
    // App
    app_subtitle: 'Générateur de mots de passe premium',
    tab_config: 'Configuration',
    tab_history: 'Historique',

    // TopMenu
    menu_lang: 'Langue',
    menu_source_code: 'Code source',
    menu_about: 'À propos',
    about_title: 'À propos',
    about_close: 'Fermer',
    about_desc:
      "UnknownSecret génère des mots de passe cryptographiquement sûrs via window.crypto.getRandomValues(). Supporte les caractères ASCII, Unicode étendu, emojis et plus de 60 langues.",

    // Generator – password display
    stop_inspecting: "Arrêter l'inspection",
    hide: 'Masquer',
    show: 'Afficher',
    regenerate: 'Régénérer',
    inspect_characters: 'Inspecter les caractères',
    copy_password: 'Copier',
    copied: 'Copié !',
    toggle_statistics: 'Afficher les statistiques',

    // Generator – presets
    custom_configurations: 'Configurations personnalisées',
    preset_name_placeholder: 'Nom de la configuration...',
    drop_json_import: 'Déposer un fichier JSON pour importer',
    presets_added_to_list: 'Les préréglages seront ajoutés à votre liste',
    clear: 'Effacer',
    sure: 'Sûr ?',
    really: 'VRAIMENT ?',
    save_current: 'Sauvegarder',
    hold_shift_pre: 'Maintenez ',
    hold_shift_post: ' pour supprimer des préréglages',
    import_presets_title: 'Importer des préréglages',
    export_presets_title: 'Exporter les préréglages',
    default_configurations: 'Configurations par défaut',

    // Import conflict modal
    duplicate_presets_title: 'Préréglages en double',
    duplicate_presets_exist: 'Les préréglages suivants existent déjà :',
    new_presets_added_n: (n) =>
      `${n} nouveau${n > 1 ? 'x' : ''} préréglage${n > 1 ? 's' : ''} sera${n > 1 ? 'ont' : ''} ajouté${n > 1 ? 's' : ''}.`,
    overwrite: 'Écraser',
    skip_duplicates: 'Ignorer les doublons',

    // Preset actions
    confirm_save: 'Confirmer',
    cancel_save: 'Annuler',
    delete_preset_title: 'Supprimer le préréglage',

    // Configuration panel
    configuration: 'Configuration',
    reset_config: 'Réinitialiser',
    reset_config_title: 'Réinitialiser la configuration par défaut',

    // Length
    password_length: 'Longueur du mot de passe',
    click_edit_length: 'Cliquer pour modifier la longueur',
    click_edit_max: 'Cliquer pour modifier le maximum',

    // Charset
    charset_title: 'Jeu de caractères',
    lowercase: 'Minuscules',
    uppercase: 'Majuscules',
    numbers: 'Chiffres',
    basic_symbols: 'Symboles basiques',
    advanced_symbols: 'Symboles avancés',

    // Charset sets titles
    set_title_ascii_extended: 'ASCII Étendu',
    set_title_symbols_set: 'Avec Symboles',
    set_title_active_languages: 'Langues Actives',
    set_title_emojis: 'Avec Emojis',
    set_title_all_unicode: 'Tout Unicode',

    // Charset sets descriptions
    set_desc_ascii_extended: '+ Plus de symboles (Latin étendu A & B (U+0100-024F))',
    set_desc_symbols_set: '+ Flèches, Maths, Monnaie (→∑€...)',
    set_desc_active_languages: '+ Grec, Cyrillique, Hébreu, Arabe (αБא...)',
    set_desc_emojis: '+ Emojis (🎉🔥💻...)',
    set_desc_all_unicode: '+ BMP complet (CJK, Technique...)',
    charset_characters: 'caractères',

    // Options
    options_title: 'Options',
    randomize_length_label: 'Longueur aléatoire (jusqu\'à -',
    click_change_deviation: 'Cliquer pour modifier l\'écart %',
    randomize_length_help_title: 'Longueur aléatoire',
    randomize_length_help:
      "Obscurcit les patterns d'utilisation en randomisant légèrement la longueur. Utile contre les attaques en boîte blanche ou pour éviter des patterns de longueur fixe.",

    ensure_compat_label: 'Assurer la compatibilité',
    ensure_compat_help_title: 'Assurer la compatibilité',
    ensure_compat_help:
      "Restreint le jeu de caractères pour garantir la présence d'au moins un caractère de chaque bloc actif (minuscules, majuscules, chiffres, symboles).",
    compat_desc: 'Garantit au moins un caractère de chaque option de jeu de caractères actif.',

    // Advanced
    advanced_title: 'Avancé',
    post_quantum_label: 'Résistance Post-Quantique',
    post_quantum_help_title: 'Résistance Post-Quantique',
    post_quantum_help:
      "Estime la sécurité face aux futures attaques quantiques. L'algorithme de Grover divise l'entropie effective par deux (racine carrée), donc nous divisons l'entropie par 2.",
    post_quantum_desc: "Simule l'impact de l'algorithme de Grover : l'entropie effective est divisée par deux (N/2).",

    guarantee_ascii_label: 'Garantir ASCII (>=',
    click_change_ascii: 'Cliquer pour modifier le % ASCII minimum',

    custom_charset_label: 'Jeu de caractères personnalisé',
    custom_charset_desc: 'Le mot de passe sera uniquement composé des caractères suivants :',
    add_chars_label: 'Ajouter des caractères au jeu',
    add_chars_desc: 'J\'ajoute les caractères suivants dans les mots de passe :',
    custom_charset_help_title: 'Jeu de caractères personnalisé',
    custom_charset_help: 'Permet un contrôle précis des caractères autorisés pour des exigences spécifiques.',
    add_chars_help_title: 'Ajouter des caractères',
    add_chars_help: 'Injecte manuellement des caractères spécifiques dans le pool de génération.',
    custom_charset_placeholder: 'Ajouter des caractères (ex. ñçµ...)',

    enable_std_charset: 'Inclure les caractères standards',

    boost_custom_label: 'Augmenter prob. personnalisée (~',
    click_change_weight: 'Cliquer pour modifier le poids %',
    boost_custom_help_title: 'Augmenter la probabilité personnalisée',
    boost_custom_help:
      "Augmente significativement la probabilité d'apparition de vos caractères personnalisés. Utile quand le pool de base est immense (ex. Unicode).",

    must_include_label: 'Caractères obligatoires',
    must_include_help_title: 'Caractères obligatoires',
    must_include_help:
      "Garantit la présence de ces caractères dans le mot de passe final. Peut aussi servir de liste autorisée.",
    must_include_placeholder: 'ex. @ö5',

    forbidden_label: 'Caractères interdits',
    forbidden_help_title: 'Caractères interdits',
    forbidden_help:
      'Supprime des caractères spécifiques du pool, empêchant leur rejet par des services avec des contraintes strictes.',
    forbidden_placeholder: 'ex. I1l0O',

    remove_forbidden_dupe: "Supprimer les caractères présents dans 'Interdits'",
    remove_include_dupe: "Supprimer les caractères présents dans 'Obligatoires'",
    remove_duplicate: 'Supprimer le doublon',

    conflict_title: 'Conflit détecté',
    conflict_desc_pre:
      'Certains caractères apparaissent dans les deux champs « Obligatoires » et « Interdits ». C\'est impossible à satisfaire (',
    conflict_desc_post: ').',

    import_failed: "Échec de l'importation : format JSON invalide",

    // HistoryPanel
    history_title: 'Historique',
    hide_all: 'Tout masquer',
    show_all: 'Tout afficher',
    clear_history: 'Effacer',
    clear_history_confirm: "Effacer tout l'historique ? Les favoris seront conservés.",
    no_history: 'Aucun historique.',
    no_history_sub: 'Les mots de passe générés apparaîtront ici quand copiés.',
    copied_clipboard: 'Copié dans le presse-papiers',
    name_placeholder: 'Nom',

    // PasswordStats – stat cards
    stat_lowercase: 'Minuscules',
    stat_uppercase: 'Majuscules',
    stat_numbers: 'Chiffres',
    stat_emojis: 'Emojis',
    stat_symbols: 'Symboles',
    stat_bcrypt: 'Bcrypt',
    stat_compatibility: 'Compatibilité',

    bcrypt_compat_title: 'Compatibilité Bcrypt',
    bcrypt_compat_desc:
      "Bcrypt est un algorithme de hachage legacy courant avec une limite technique stricte : il ignore toute entrée dépassant 72 octets.",
    bcrypt_exceeded_title: "Limite d'octets dépassée",
    bcrypt_exceeded_desc:
      "Vos caractères multi-octets complexes (emojis, symboles) ont dépassé la limite de 72 octets. Le site cible pourrait tronquer silencieusement le mot de passe.",
    set_to_72: 'Limiter à 72 octets',

    unicode_compat_title: 'Compatibilité Unicode',
    unicode_compat_desc:
      "Tous les backends ne supportent pas pleinement UTF-8. Les systèmes legacy peuvent remplacer ou rejeter des symboles complexes, réduisant la force du mot de passe.",
    compat_risk_title: 'Risque de compatibilité détecté',
    compat_risk_desc:
      "Votre jeu de caractères inclut des caractères Unicode complexes non supportés par tous les systèmes. Suivez les étapes dans la vérification de compatibilité Unicode ci-dessous.",
    goto_compat_check: 'Aller à la vérification',

    security_analysis: 'Analyse de sécurité',
    algorithm_zxcvbn: 'Algorithme : zxcvbn',
    zxcvbn_desc:
      "Conçu pour détecter les mots de passe facilement mémorisables en analysant les mots du dictionnaire, répétitions et patterns communs souvent manqués par les calculateurs d'entropie traditionnels.",
    zxcvbn_note:
      "Note : Cette analyse est moins pertinente pour les mots de passe purement aléatoires générés par cet outil.",
    warning: 'Avertissement',

    crack_offline_fast_label: 'Fuite de données (Sécurité faible)',
    crack_offline_fast_tooltip:
      "La base de données a fuité et l'algorithme de hachage (ex. MD5) est très rapide. L'attaquant teste 10 milliards de combinaisons par seconde.",
    crack_offline_slow_label: 'Fuite de données (Sécurité forte)',
    crack_offline_slow_tooltip:
      "La base de données a fuité, mais le mot de passe est protégé par un algorithme lent (ex. Bcrypt, Argon2). L'attaquant est limité à ~10 000 tests par seconde.",
    crack_unthrottled_label: 'Tentatives de connexion (Illimitées)',
    crack_unthrottled_tooltip:
      "Attaque en ligne : le formulaire de connexion n'a pas de protection contre les bots.",
    crack_throttled_label: 'Tentatives de connexion (Limitées)',
    crack_throttled_tooltip:
      "Attaque en ligne : le système bloque ou ralentit l'attaquant après quelques tentatives (rate limiting).",

    // EntropyMeter
    size_utf8: 'Taille (utf-8) :',
    bytes_unit: 'octets',
    comb: 'Comb. :',
    entropy_label: 'Entropie :',
    security_strength: 'Niveau de sécurité',
    strength_very_weak: 'Très Faible',
    strength_weak: 'Faible',
    strength_medium: 'Moyen',
    strength_strong: 'Fort',
    strength_excellent: 'Excellent',
    strength_overkill: 'Excessif',
    strength_paranoiac: 'Paranoïaque',
    strength_absolute_demon: 'Démon Absolu',

    // Time formatting (function values – called as t('key', n))
    time_instantly: 'Instantanément',
    time_seconds: (n) => `${n} secondes`,
    time_minutes: (n) => `${n} minutes`,
    time_hours: (n) => `${n} heures`,
    time_days: (n) => `${n} jours`,
    time_years: (n) => `${n} ans`,
    time_centuries: 'Des siècles',
    time_millennia: 'Des millénaires',
    time_millions_years: "Des millions d'années",
    time_billions_years: "Des milliards d'années",
    time_universe_age: "Âge de l'univers",

    // UnicodeChecker
    unicode_check_title: 'Vérification de compatibilité Unicode',
    unicode_check_sub: 'Testez si votre service gère correctement les caractères rares',
    lockout_warning_title: 'Avertissement : Risque de blocage de compte',
    lockout_warning_desc:
      "Assurez-vous d'avoir toujours des options de récupération de compte (numéro de téléphone, email de secours). Si le mot de passe Unicode n'est pas supporté lors de la connexion, il sera considéré comme perdu et il deviendra impossible de se reconnecter.",
    step1_title: 'Créer un compte ou changer de mot de passe',
    step1_desc: 'Utilisez ce mot de passe pour créer un nouveau compte ou modifier votre mot de passe actuel.',
    step2_title: 'Se déconnecter et se reconnecter',
    step2_desc: 'Déconnectez-vous, puis tentez de vous reconnecter avec le même mot de passe.',
    step3_title: 'Vérifier que ces variantes sont refusées',
    step3_desc: 'Ces deux mots de passe doivent être rejetés par le système. S\'ils sont acceptés, le service ne gère pas l\'Unicode correctement.',
    compat_confirmed: 'Si les 3 étapes réussissent, votre système est compatible Unicode, vous pouvez utiliser des mots de passe contenant des caractères rares en toute sécurité.',
    field1_label: 'Mot de passe Unicode',
    field1_status: '✅ UTF-8 valide',
    field2_label: 'Avec U+FFFD (caractère de remplacement)',
    field2_status: '❌ Contient \uFFFD (U+FFFD)',
    field3_label: 'Sans suffixe Unicode',
    field3_status: '❌ Caractère requis manquant',
  },

  en: {
    // App
    app_subtitle: 'Premium Password Generator',
    tab_config: 'Configuration',
    tab_history: 'History',

    // TopMenu
    menu_lang: 'Language',
    menu_source_code: 'Source Code',
    menu_about: 'About',
    about_title: 'About',
    about_close: 'Close',
    about_desc:
      'UnknownSecret generates cryptographically secure passwords via window.crypto.getRandomValues(). Supports ASCII characters, extended Unicode, emojis and more than 60 languages.',

    // Generator – password display
    stop_inspecting: 'Stop Inspecting',
    hide: 'Hide',
    show: 'Show',
    regenerate: 'Regenerate',
    inspect_characters: 'Inspect Characters',
    copy_password: 'Copy Password',
    copied: 'Copied!',
    toggle_statistics: 'Toggle Statistics',

    // Generator – presets
    custom_configurations: 'Custom Configurations',
    preset_name_placeholder: 'Configuration name...',
    drop_json_import: 'Drop JSON file to import',
    presets_added_to_list: 'Presets will be added to your list',
    clear: 'Clear',
    sure: 'Sure?',
    really: 'REALLY?',
    save_current: 'Save Current',
    hold_shift_pre: 'Hold ',
    hold_shift_post: ' to delete individual presets',
    import_presets_title: 'Import Presets',
    export_presets_title: 'Export Presets',
    default_configurations: 'Default Configurations',

    // Import conflict modal
    duplicate_presets_title: 'Duplicate Presets Found',
    duplicate_presets_exist: 'The following presets already exist:',
    new_presets_added_n: (n) => `${n} new preset${n > 1 ? 's' : ''} will be added regardless.`,
    overwrite: 'Overwrite',
    skip_duplicates: 'Skip Duplicates',

    // Preset actions
    confirm_save: 'Confirm Save',
    cancel_save: 'Cancel',
    delete_preset_title: 'Delete preset',

    // Configuration panel
    configuration: 'Configuration',
    reset_config: 'Reset',
    reset_config_title: 'Reset to default configuration',

    // Length
    password_length: 'Password Length',
    click_edit_length: 'Click to edit length',
    click_edit_max: 'Click to edit max limit',

    // Charset
    charset_title: 'Character Set',
    lowercase: 'Lowercase',
    uppercase: 'Uppercase',
    numbers: 'Numbers',
    basic_symbols: 'Basic Symbols',
    advanced_symbols: 'Advanced Symbols',

    // Charset sets titles
    set_title_ascii_extended: 'ASCII Extended',
    set_title_symbols_set: 'With Symbols',
    set_title_active_languages: 'Active Languages',
    set_title_emojis: 'With Emojis',
    set_title_all_unicode: 'All Unicode',

    // Charset sets descriptions
    set_desc_ascii_extended: '+ More symbols (Latin Extended A & B (U+0100-024F))',
    set_desc_symbols_set: '+ Arrows, Math, Currency (→∑€...)',
    set_desc_active_languages: '+ Greek, Cyrillic, Hebrew, Arabic (αБא...)',
    set_desc_emojis: '+ Emojis (🎉🔥💻...)',
    set_desc_all_unicode: '+ Full BMP (CJK, Technical...)',
    charset_characters: 'characters',

    // Options
    options_title: 'Options',
    randomize_length_label: 'Randomize Length (down to -',
    click_change_deviation: 'Click to change deviation %',
    randomize_length_help_title: 'Randomize Length',
    randomize_length_help:
      'Obfuscates usage patterns by slightly randomizing the password length. Useful against white-box attacks (where the attacker knows you use this tool) or to avoid predictable fixed-length patterns.',

    ensure_compat_label: 'Ensure Compatibility',
    ensure_compat_help_title: 'Ensure Compatibility',
    ensure_compat_help:
      'Restricts the character set to ensure at least one character from each active character block (lowercase, uppercase, numbers, symbols) is present in the generated password.',
    compat_desc: 'Guarantees at least one character from each active character set option.',

    // Advanced
    advanced_title: 'Advanced',
    post_quantum_label: 'Post-Quantum Strength',
    post_quantum_help_title: 'Post-Quantum Strength',
    post_quantum_help:
      "Estimates security against future quantum attacks. Since Grover's algorithm effectively halves the bit strength (square root of the search space), we divide the entropy by 2 to measure post-quantum resilience.",
    post_quantum_desc: "Simulates Grover's algorithm impact: effective entropy is halved (N/2).",

    guarantee_ascii_label: 'Guarantee ASCII (>=',
    click_change_ascii: 'Click to change min ASCII %',

    custom_charset_label: 'Custom Charset',
    custom_charset_desc: 'The password will only consist of the following characters:',
    add_chars_label: 'Add characters to the charset',
    add_chars_desc: 'I add the following characters to the passwords:',
    custom_charset_help_title: 'Custom Charset',
    custom_charset_help: 'Enables precise control over the allowed characters for specific requirements.',
    add_chars_help_title: 'Add Characters',
    add_chars_help: 'Manually injects specific characters into the generation pool.',
    custom_charset_placeholder: 'Add characters (e.g. ñçµ...)',

    enable_std_charset: 'Include standard characters',

    boost_custom_label: 'Boost Custom Prob. (~',
    click_change_weight: 'Click to change weight %',
    boost_custom_help_title: 'Boost Custom Probability',
    boost_custom_help:
      "Significantly increases the probability of your custom characters appearing. Useful when the base pool is huge (e.g., Unicode), ensuring your additions aren't statistically drowned out.",

    must_include_label: 'Must Include Characters',
    must_include_help_title: 'Must Include Characters',
    must_include_help:
      "Guarantees these specific characters appear in the final password. Can also be used as an 'Allowed List' by selecting Alphanumeric mode and pasting accepted symbols here.",
    must_include_placeholder: 'e.g. @ö5',

    forbidden_label: 'Forbidden Characters',
    forbidden_help_title: 'Forbidden Characters',
    forbidden_help:
      'Removes specific characters from the pool, preventing rejection by services with strict character constraints.',
    forbidden_placeholder: 'e.g. I1l0O',

    remove_forbidden_dupe: "Remove characters that are also in 'Forbidden'",
    remove_include_dupe: "Remove characters that are also in 'Must Include'",
    remove_duplicate: 'Remove Duplicate',

    conflict_title: 'Conflict Detected',
    conflict_desc_pre:
      'Some characters appear in both "Must Include" and "Forbidden" fields. This is impossible to satisfy (',
    conflict_desc_post: ').',

    import_failed: 'Failed to import presets: Invalid JSON format',

    // HistoryPanel
    history_title: 'History',
    hide_all: 'Hide all',
    show_all: 'Show all',
    clear_history: 'Clear',
    clear_history_confirm: 'Clear all history? Favorites will be kept.',
    no_history: 'No history yet.',
    no_history_sub: 'Generated passwords will appear here when copied.',
    copied_clipboard: 'Copied to clipboard',
    name_placeholder: 'Name',

    // PasswordStats – stat cards
    stat_lowercase: 'Lowercase',
    stat_uppercase: 'Uppercase',
    stat_numbers: 'Numbers',
    stat_emojis: 'Emojis',
    stat_symbols: 'Symbols',
    stat_bcrypt: 'Bcrypt',
    stat_compatibility: 'Compatibility',

    bcrypt_compat_title: 'Bcrypt Compatibility',
    bcrypt_compat_desc:
      'Bcrypt is a common legacy password hashing algorithm with a strict technical limit: it ignores any input beyond 72 bytes.',
    bcrypt_exceeded_title: 'Byte-Size Exceeded',
    bcrypt_exceeded_desc:
      'Because you are using complex multi-byte characters (like emojis or symbols), your generated password has exceeded this 72-byte limit. It may be silently truncated by the target website.',
    set_to_72: 'Set to 72 Bytes',

    unicode_compat_title: 'Unicode Compatibility',
    unicode_compat_desc:
      'Not all backends fully support UTF-8. Legacy systems might replace or reject complex symbols, reducing password strength.',
    compat_risk_title: 'Compatibility Risk Detected',
    compat_risk_desc:
      'Your active charset includes complex Unicode characters that may not be supported by all systems. Please follow the steps in the Unicode Compatibility Check card below.',
    goto_compat_check: 'Go to Compatibility Check',

    security_analysis: 'Security Analysis',
    algorithm_zxcvbn: 'Algorithm: zxcvbn',
    zxcvbn_desc:
      'Specifically designed to detect human-friendly passwords by analyzing dictionary words, repetitions, and common patterns often missed by traditional entropy calculators.',
    zxcvbn_note:
      'Note: This analysis is less relevant for purely random passwords generated by this tool.',
    warning: 'Warning',

    crack_offline_fast_label: 'Data Breach (Weak Security)',
    crack_offline_fast_tooltip:
      'The database leaked and the hashing algorithm (e.g., MD5) is very fast to compute. The attacker uses hardware to test 10 billion combinations per second.',
    crack_offline_slow_label: 'Data Breach (Strong Security)',
    crack_offline_slow_tooltip:
      'The database leaked, but the password is defended by a slow algorithm (e.g., Bcrypt, Argon2). The attacker is limited to about 10,000 tests per second.',
    crack_unthrottled_label: 'Login Attempts (Unlimited)',
    crack_unthrottled_tooltip:
      'Online attack: the login form has no protection against bots. The attacker tests passwords as fast as the network allows.',
    crack_throttled_label: 'Login Attempts (With Max Attempts)',
    crack_throttled_tooltip:
      'Online attack: the login page has a security system that blocks or slows down the attacker after a few failed tries (rate limiting, max attempts).',

    // EntropyMeter
    size_utf8: 'Size (utf-8):',
    bytes_unit: 'bytes',
    comb: 'Comb:',
    entropy_label: 'Entropy:',
    security_strength: 'Security Strength',
    strength_very_weak: 'Very Weak',
    strength_weak: 'Weak',
    strength_medium: 'Medium',
    strength_strong: 'Strong',
    strength_excellent: 'Excellent',
    strength_overkill: 'Overkill',
    strength_paranoiac: 'Paranoiac',
    strength_absolute_demon: 'Absolute Demon',

    // Time formatting (function values – called as t('key', n))
    time_instantly: 'Instantly',
    time_seconds: (n) => `${n} seconds`,
    time_minutes: (n) => `${n} minutes`,
    time_hours: (n) => `${n} hours`,
    time_days: (n) => `${n} days`,
    time_years: (n) => `${n} years`,
    time_centuries: 'Centuries',
    time_millennia: 'Millennia',
    time_millions_years: 'Millions of years',
    time_billions_years: 'Billions of years',
    time_universe_age: 'Age of the Universe',

    // UnicodeChecker
    unicode_check_title: 'Unicode Compatibility Check',
    unicode_check_sub: 'Test whether your service correctly handles rare characters',
    lockout_warning_title: 'Warning: Risk of Account Lockout',
    lockout_warning_desc:
      'Make sure you always have account recovery options (phone number, extra info, backup email). If the Unicode password is not supported during login, you can consider the password lost and it becomes impossible to log back into the account.',
    step1_title: 'Create an account or change your password',
    step1_desc: 'Use this password to create a new account or update your current password.',
    step2_title: 'Log out and log back in',
    step2_desc: 'Log out, then try to log back in using the same password.',
    step3_title: 'Verify these variants are rejected',
    step3_desc: 'Both passwords below must be refused by the system. If either is accepted, the service does not handle Unicode correctly.',
    compat_confirmed: 'If all 3 steps pass, your system is Unicode compatible — you can safely use passwords containing rare characters.',
    field1_label: 'Unicode Password',
    field1_status: '✅ Valid UTF-8',
    field2_label: 'With U+FFFD (replacement char)',
    field2_status: '❌ Contains \uFFFD (U+FFFD)',
    field3_label: 'Without Unicode suffix',
    field3_status: '❌ Missing required char',
  },
};
