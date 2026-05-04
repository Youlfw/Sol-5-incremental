<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SOL5 — Incremental</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap');

        :root {
            --bg: #06060f;
            --panel: #0b0b1a;
            --border: #1a1a3a;
            --accent: #64c8ff;
            --accent2: #a06aff;
            --accent3: #ffb84d;
            --text: #c8d0f0;
            --text-dim: #6870a0;
            --green: #4dffb4;
            --red: #ff4d6a;
            --radius: 8px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: var(--bg);
            color: var(--text);
            font-family: 'Share Tech Mono', monospace;
            font-size: 13px;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* Starfield background */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image:
                radial-gradient(1px 1px at 10% 20%, rgba(100,200,255,0.4) 0%, transparent 100%),
                radial-gradient(1px 1px at 30% 70%, rgba(160,106,255,0.3) 0%, transparent 100%),
                radial-gradient(1px 1px at 55% 15%, rgba(100,200,255,0.3) 0%, transparent 100%),
                radial-gradient(1px 1px at 80% 45%, rgba(255,184,77,0.2) 0%, transparent 100%),
                radial-gradient(1px 1px at 65% 85%, rgba(100,200,255,0.25) 0%, transparent 100%),
                radial-gradient(1px 1px at 92% 10%, rgba(160,106,255,0.35) 0%, transparent 100%),
                radial-gradient(1px 1px at 20% 90%, rgba(100,200,255,0.2) 0%, transparent 100%);
            pointer-events: none;
            z-index: 0;
        }

        #game-wrapper {
            position: relative;
            z-index: 1;
            display: grid;
            grid-template-columns: 280px 1fr;
            grid-template-rows: 1fr auto;
            gap: 10px;
            padding: 10px;
            min-height: 100vh;
            max-width: 1100px;
            margin: 0 auto;
        }

        /* ── LEFT PANEL ── */
        #left-panel {
            grid-row: 1 / 2;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .panel {
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 14px;
        }

        .panel-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 10px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--text-dim);
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border);
        }

        /* Game title */
        #game-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 22px;
            font-weight: 900;
            color: var(--accent);
            text-shadow: 0 0 20px rgba(100,200,255,0.5);
            letter-spacing: 0.15em;
            text-align: center;
            padding: 12px 14px;
        }
        #game-title span { color: var(--accent2); }

        /* Resources */
        .resource-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
        }
        .resource-row + .resource-row {
            border-top: 1px solid rgba(26,26,58,0.6);
        }
        .resource-label {
            color: var(--text-dim);
            font-size: 11px;
        }
        .resource-value {
            font-family: 'Orbitron', sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: var(--accent);
        }
        .resource-value.matter  { color: #a0d4a0; }
        .resource-value.ly      { color: var(--accent3); }
        .resource-value.essence { color: var(--accent2); }
        .resource-value.shards  { color: var(--green); }

        /* Production rates */
        .rate-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3px 0;
            font-size: 11px;
        }
        .rate-label { color: var(--text-dim); }
        .rate-value { color: var(--text); }

        /* Multipliers */
        .multi-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            padding: 3px 0;
        }
        .multi-label { color: var(--text-dim); }
        .multi-value { color: var(--accent2); font-weight: 600; }

        /* Progress bar */
        #progress-wrap { margin-top: 4px; }
        #progress-label {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: var(--text-dim);
            margin-bottom: 5px;
        }
        #progress-track {
            height: 6px;
            background: var(--border);
            border-radius: 3px;
            overflow: hidden;
        }
        #progressFill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--accent), var(--accent2));
            border-radius: 3px;
            transition: width 0.3s ease;
        }

        /* Click button */
        #clickBtn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, rgba(100,200,255,0.12), rgba(160,106,255,0.08));
            border: 1px solid var(--accent);
            border-radius: var(--radius);
            color: var(--accent);
            font-family: 'Orbitron', sans-serif;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.1em;
            cursor: pointer;
            transition: all 0.1s ease;
            text-shadow: 0 0 10px rgba(100,200,255,0.4);
            box-shadow: 0 0 15px rgba(100,200,255,0.08), inset 0 0 15px rgba(100,200,255,0.04);
        }
        #clickBtn:hover {
            background: linear-gradient(135deg, rgba(100,200,255,0.22), rgba(160,106,255,0.14));
            box-shadow: 0 0 25px rgba(100,200,255,0.2), inset 0 0 20px rgba(100,200,255,0.08);
        }
        #clickBtn:active { transform: scale(0.96); }

        /* ── RIGHT PANEL ── */
        #right-panel {
            grid-row: 1 / 2;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        /* Tabs */
        #tab-bar {
            display: flex;
            gap: 6px;
        }
        .tab-btn {
            flex: 1;
            padding: 9px 6px;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--text-dim);
            font-family: 'Orbitron', sans-serif;
            font-size: 9px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .tab-btn:hover { color: var(--text); border-color: #2a2a5a; }
        .tab-btn.active {
            background: rgba(100,200,255,0.08);
            border-color: var(--accent);
            color: var(--accent);
        }

        .tab-content { display: none; }
        .tab-content.active { display: block; }

        #tab-panel {
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 14px;
            flex: 1;
            overflow-y: auto;
            max-height: calc(100vh - 120px);
        }

        /* Generators */
        #generators-container,
        #upgrades-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .generator-btn, .upgrade-btn {
            width: 100%;
            padding: 12px 14px;
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--text);
            font-family: 'Share Tech Mono', monospace;
            font-size: 12px;
            cursor: pointer;
            text-align: left;
            transition: all 0.15s ease;
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            gap: 2px 10px;
        }
        .generator-btn:hover:not(:disabled), .upgrade-btn:hover:not(:disabled) {
            background: rgba(100,200,255,0.06);
            border-color: rgba(100,200,255,0.3);
        }
        .generator-btn.disabled, .upgrade-btn.disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
        .upgrade-btn.purchased {
            opacity: 0.5;
            border-color: var(--green);
            cursor: default;
        }
        .upgrade-btn.purchased .upgrade-cost { color: var(--green); }

        .generator-name, .upgrade-name {
            font-weight: 600;
            color: var(--accent);
            grid-column: 1;
            grid-row: 1;
        }
        .generator-info {
            font-size: 11px;
            color: var(--text-dim);
            grid-column: 1;
            grid-row: 2;
        }
        .generator-cost, .upgrade-cost {
            font-size: 11px;
            color: var(--accent3);
            grid-column: 2;
            grid-row: 1 / 3;
            align-self: center;
            text-align: right;
            white-space: nowrap;
        }
        .upgrade-info {
            font-size: 11px;
            color: var(--text-dim);
            grid-column: 1;
            grid-row: 2;
        }

        /* Prestige tab */
        #prestige-tab {
            display: none;
        }
        #prestige-tab.active { display: flex; flex-direction: column; gap: 14px; }

        .prestige-layer {
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 14px;
            background: rgba(255,255,255,0.01);
        }
        .prestige-layer-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        .prestige-layer:nth-child(1) .prestige-layer-title { color: var(--accent2); }
        .prestige-layer:nth-child(2) .prestige-layer-title { color: var(--green); }

        .prestige-info-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 4px 0;
            color: var(--text-dim);
        }
        .prestige-info-row span { color: var(--text); }

        .prestige-btn {
            width: 100%;
            margin-top: 10px;
            padding: 12px;
            border-radius: var(--radius);
            font-family: 'Orbitron', sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            cursor: pointer;
            transition: all 0.15s ease;
            text-transform: uppercase;
        }
        #prestigeBtn1 {
            background: rgba(160,106,255,0.1);
            border: 1px solid var(--accent2);
            color: var(--accent2);
        }
        #prestigeBtn1:hover:not(:disabled) {
            background: rgba(160,106,255,0.2);
            box-shadow: 0 0 15px rgba(160,106,255,0.2);
        }
        #prestigeBtn2 {
            background: rgba(77,255,180,0.08);
            border: 1px solid var(--green);
            color: var(--green);
        }
        #prestigeBtn2:hover:not(:disabled) {
            background: rgba(77,255,180,0.15);
            box-shadow: 0 0 15px rgba(77,255,180,0.15);
        }
        .prestige-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        /* Stats tab */
        #stats-tab { display: none; }
        #stats-tab.active { display: block; }
        .stat-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid rgba(26,26,58,0.5);
            font-size: 12px;
        }
        .stat-label { color: var(--text-dim); }
        .stat-value { color: var(--text); }

        /* ── BOTTOM BAR ── */
        #bottom-bar {
            grid-column: 1 / 3;
            display: flex;
            align-items: center;
            gap: 8px;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 10px 14px;
        }

        .save-btn {
            padding: 7px 18px;
            border-radius: var(--radius);
            font-family: 'Orbitron', sans-serif;
            font-size: 9px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        #saveBtn {
            background: rgba(100,200,255,0.1);
            border: 1px solid var(--accent);
            color: var(--accent);
        }
        #saveBtn:hover { background: rgba(100,200,255,0.2); }
        #loadBtn {
            background: rgba(160,106,255,0.1);
            border: 1px solid var(--accent2);
            color: var(--accent2);
        }
        #loadBtn:hover { background: rgba(160,106,255,0.2); }
        #resetBtn {
            background: rgba(255,77,106,0.08);
            border: 1px solid var(--red);
            color: var(--red);
        }
        #resetBtn:hover { background: rgba(255,77,106,0.18); }

        #saveInfo {
            margin-left: auto;
            font-size: 11px;
            color: var(--text-dim);
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        /* Notifications */
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to   { transform: translateX(0);     opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0);     opacity: 1; }
            to   { transform: translateX(400px); opacity: 0; }
        }
    </style>
</head>
<body>

<div id="game-wrapper">

    <!-- ── LEFT PANEL ── -->
    <div id="left-panel">

        <div class="panel" style="padding:10px 14px;">
            <div id="game-title">SOL<span>5</span></div>
        </div>

        <!-- Resources -->
        <div class="panel">
            <div class="panel-title">Resources</div>
            <div class="resource-row">
                <span class="resource-label">⚡ Energy</span>
                <span class="resource-value" id="energy">0</span>
            </div>
            <div class="resource-row">
                <span class="resource-label">🪨 Matter</span>
                <span class="resource-value matter" id="matter">0</span>
            </div>
            <div class="resource-row">
                <span class="resource-label">💫 Light Years</span>
                <span class="resource-value ly" id="lightYears">0</span>
            </div>
            <div class="resource-row">
                <span class="resource-label">✨ Essence</span>
                <span class="resource-value essence" id="essence">0</span>
            </div>
            <div class="resource-row">
                <span class="resource-label">💠 Shards</span>
                <span class="resource-value shards" id="shards">0</span>
            </div>
        </div>

        <!-- Production -->
        <div class="panel">
            <div class="panel-title">Per Second</div>
            <div class="rate-row">
                <span class="rate-label">⚡ Energy/s</span>
                <span class="rate-value" id="energyPerSec">0.00</span>
            </div>
            <div class="rate-row">
                <span class="rate-label">🪨 Matter/s</span>
                <span class="rate-value" id="matterPerSec">0.00</span>
            </div>
            <div class="rate-row">
                <span class="rate-label">💫 LY/s</span>
                <span class="rate-value" id="lyPerSec">0.00</span>
            </div>
        </div>

        <!-- Multipliers -->
        <div class="panel">
            <div class="panel-title">Multipliers</div>
            <div class="multi-row">
                <span class="multi-label">Essence Multi</span>
                <span class="multi-value" id="essenceMultiplier">1.00x</span>
            </div>
            <div class="multi-row">
                <span class="multi-label">Shard Multi</span>
                <span class="multi-value" id="shardMultiplier">1.00x</span>
            </div>
            <div id="progress-wrap" style="margin-top:10px;">
                <div id="progress-label">
                    <span>Progress to Singularity</span>
                    <span><span id="progressPercent">0</span>%</span>
                </div>
                <div id="progress-track">
                    <div id="progressFill"></div>
                </div>
            </div>
        </div>

        <!-- Click button -->
        <button id="clickBtn">⚡ COLLECT ENERGY</button>

    </div><!-- /left-panel -->

    <!-- ── RIGHT PANEL ── -->
    <div id="right-panel">

        <div id="tab-bar">
            <button class="tab-btn active" data-tab="generators">Generators</button>
            <button class="tab-btn" data-tab="upgrades">Upgrades</button>
            <button class="tab-btn" data-tab="prestige">Prestige</button>
            <button class="tab-btn" data-tab="stats">Stats</button>
        </div>

        <div id="tab-panel">

            <div id="generators-tab" class="tab-content active">
                <div id="generators-container"></div>
            </div>

            <div id="upgrades-tab" class="tab-content">
                <div id="upgrades-container"></div>
            </div>

            <div id="prestige-tab" class="tab-content">

                <!-- Layer 1 -->
                <div class="prestige-layer">
                    <div class="prestige-layer-title">✨ Layer 1 — Essence</div>
                    <div class="prestige-info-row">
                        Current Essence <span id="essenceDisplay">0</span>
                    </div>
                    <div class="prestige-info-row">
                        Gain on Reset <span>+<span id="essenceGain">0</span></span>
                    </div>
                    <p style="font-size:11px;color:var(--text-dim);margin-top:6px;">
                        Resets energy, matter, light-years &amp; generators. Requires 100 Light Years.
                    </p>
                    <button class="prestige-btn" id="prestigeBtn1">Prestige Layer 1</button>
                </div>

                <!-- Layer 2 -->
                <div class="prestige-layer">
                    <div class="prestige-layer-title">💠 Layer 2 — Shards</div>
                    <div class="prestige-info-row">
                        Current Shards <span id="shardsDisplay">0</span>
                    </div>
                    <div class="prestige-info-row">
                        Gain on Reset <span>+<span id="shardsGain">0</span></span>
                    </div>
                    <p style="font-size:11px;color:var(--text-dim);margin-top:6px;">
                        Resets Essence &amp; Essence Multiplier. Requires 10 Essence.
                    </p>
                    <button class="prestige-btn" id="prestigeBtn2">Prestige Layer 2</button>
                </div>

            </div><!-- /prestige-tab -->

            <div id="stats-tab" class="tab-content">
                <div class="stat-row">
                    <span class="stat-label">Total Energy Generated</span>
                    <span class="stat-value" id="statTotalEnergy">0</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Total Layer 1 Prestiges</span>
                    <span class="stat-value" id="statPrestigesL1">0</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Total Layer 2 Prestiges</span>
                    <span class="stat-value" id="statPrestigesL2">0</span>
                </div>
            </div>

        </div><!-- /tab-panel -->
    </div><!-- /right-panel -->

    <!-- ── BOTTOM BAR ── -->
    <div id="bottom-bar">
        <button class="save-btn" id="saveBtn">Save</button>
        <button class="save-btn" id="loadBtn">Load</button>
        <button class="save-btn" id="resetBtn">Reset</button>
        <span id="saveInfo"></span>
    </div>

</div><!-- /game-wrapper -->

<script>
// Game State
const gameState = {
    // Base Currencies
    energy: 0,
    matter: 0,
    lightYears: 0,
    
    // Prestige Currencies
    essence: 0,
    shards: 0,
    
    // Multipliers
    essenceMultiplier: 1,
    shardMultiplier: 1,
    
    // Generators (id: count)
    generators: {
        solar_collector: 0,
        matter_converter: 0,
        light_harvester: 0,
        quantum_reactor: 0,
        stellar_engine: 0
    },
    
    // Upgrades (id: purchased boolean)
    upgrades: {
        efficiency_1: false,
        efficiency_2: false,
        efficiency_3: false,
        matter_boost_1: false,
        matter_boost_2: false,
        light_years_boost: false,
        passive_generation: false,
        quantum_leap: false,
        cosmic_resonance: false,
        essence_doubler: false,
        shard_tripler: false
    },
    
    // Prestige Layer flags
    prestigeLayer1Unlocked: false,
    prestigeLayer2Unlocked: false,
    
    // Stats
    totalEnergyGenerated: 0,
    totalPrestigesL1: 0,
    totalPrestigesL2: 0,
    
    // Game settings
    autoSaveInterval: 10000 // 10 seconds
};

// Generator definitions
const generators = {
    solar_collector: {
        name: 'Solar Collector',
        baseCost: 10,
        baseProduction: 0.1,
        currencyType: 'energy',
        description: 'Collects solar energy',
        icon: '☀️'
    },
    matter_converter: {
        name: 'Matter Converter',
        baseCost: 100,
        baseProduction: 0.5,
        currencyType: 'matter',
        description: 'Converts matter',
        icon: '🪨'
    },
    light_harvester: {
        name: 'Light Harvester',
        baseCost: 500,
        baseProduction: 0.2,
        currencyType: 'lightYears',
        description: 'Harvests light energy',
        icon: '💫'
    },
    quantum_reactor: {
        name: 'Quantum Reactor',
        baseCost: 5000,
        baseProduction: 1,
        currencyType: 'energy',
        description: 'Quantum energy generation',
        icon: '⚛️'
    },
    stellar_engine: {
        name: 'Stellar Engine',
        baseCost: 50000,
        baseProduction: 5,
        currencyType: 'lightYears',
        description: 'Advanced stellar propulsion',
        icon: '🚀'
    }
};

// Upgrade definitions
// BUG FIX: efficiency_1 was incorrectly modifying essenceMultiplier, causing double-multiplication
// in calculateProduction. All direct production multipliers are applied via checks in
// calculateProduction / calculatePrestigeGain instead, so effects that duplicate those
// checks via essenceMultiplier have been corrected to () => {}.
const upgrades = {
    efficiency_1: {
        name: 'Efficiency I',
        cost: 50,
        costType: 'energy',
        description: '+25% Energy Generation',
        effect: () => {}
    },
    efficiency_2: {
        name: 'Efficiency II',
        cost: 500,
        costType: 'energy',
        description: '+50% Energy Generation',
        effect: () => {}
    },
    efficiency_3: {
        name: 'Efficiency III',
        cost: 5000,
        costType: 'energy',
        description: '+100% Energy Generation',
        effect: () => {}
    },
    matter_boost_1: {
        name: 'Matter Boost I',
        cost: 200,
        costType: 'matter',
        description: '+50% Matter Generation',
        effect: () => {}
    },
    matter_boost_2: {
        name: 'Matter Boost II',
        cost: 2000,
        costType: 'matter',
        description: '+100% Matter Generation',
        effect: () => {}
    },
    light_years_boost: {
        name: 'Light-Year Boost',
        cost: 1000,
        costType: 'lightYears',
        description: '+25% Light-Year Generation',
        effect: () => {}
    },
    passive_generation: {
        name: 'Passive Generation',
        cost: 10000,
        costType: 'energy',
        description: 'Generators produce 2x offline',
        effect: () => {}
    },
    quantum_leap: {
        name: 'Quantum Leap',
        cost: 50000,
        costType: 'lightYears',
        description: 'Unlock Layer 2 Prestige',
        effect: () => { gameState.prestigeLayer2Unlocked = true; }
    },
    cosmic_resonance: {
        name: 'Cosmic Resonance',
        cost: 100,
        costType: 'essence',
        description: '+30% Essence Gain',
        effect: () => {}
    },
    essence_doubler: {
        name: 'Essence Doubler',
        cost: 500,
        costType: 'essence',
        description: 'Double Essence gain on prestige',
        effect: () => {}
    },
    shard_tripler: {
        name: 'Shard Tripler',
        cost: 50,
        costType: 'shards',
        description: '3x Shard generation',
        effect: () => { gameState.shardMultiplier *= 3; }
    }
};

// Initialize game
function initGame() {
    renderGenerators();
    renderUpgrades();
    setupEventListeners();
    loadGame();
    gameLoop();
    
    // Auto-save
    setInterval(saveGame, gameState.autoSaveInterval);
}

// Main game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Update function (called every frame)
let lastUpdateTime = Date.now();
function update() {
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime) / 1000; // Convert to seconds
    lastUpdateTime = now;
    
    // Calculate production per second
    const energyPerSec = calculateProduction('energy');
    const matterPerSec = calculateProduction('matter');
    const lyPerSec = calculateProduction('lightYears');
    
    // Apply production
    gameState.energy += energyPerSec * deltaTime;
    gameState.matter += matterPerSec * deltaTime;
    gameState.lightYears += lyPerSec * deltaTime;
    gameState.totalEnergyGenerated += energyPerSec * deltaTime;
    
    // Update UI
    document.getElementById('energyPerSec').textContent = energyPerSec.toFixed(2);
    document.getElementById('matterPerSec').textContent = matterPerSec.toFixed(2);
    document.getElementById('lyPerSec').textContent = lyPerSec.toFixed(2);
}

// Calculate production for a currency
function calculateProduction(currencyType) {
    let production = 0;
    
    for (const [genId, count] of Object.entries(gameState.generators)) {
        const gen = generators[genId];
        if (gen.currencyType === currencyType) {
            let genProduction = gen.baseProduction * count;
            
            // Apply multiplier based on upgrades
            if (gameState.upgrades.efficiency_1 && currencyType === 'energy') genProduction *= 1.25;
            if (gameState.upgrades.efficiency_2 && currencyType === 'energy') genProduction *= 1.5;
            if (gameState.upgrades.efficiency_3 && currencyType === 'energy') genProduction *= 2;
            if (gameState.upgrades.matter_boost_1 && currencyType === 'matter') genProduction *= 1.5;
            if (gameState.upgrades.matter_boost_2 && currencyType === 'matter') genProduction *= 2;
            if (gameState.upgrades.light_years_boost && currencyType === 'lightYears') genProduction *= 1.25;
            
            // Essence multiplier applies to all
            if (gameState.essenceMultiplier > 1) genProduction *= gameState.essenceMultiplier;
            
            production += genProduction;
        }
    }
    
    return production;
}

// BUG FIX: refresh generator/upgrade button states periodically so affordability
// updates as resources accumulate (not only when a purchase is made).
let renderFrame = 0;

// Render function (update UI)
function render() {
    renderFrame++;

    // Update currencies
    document.getElementById('energy').textContent = formatNumber(gameState.energy);
    document.getElementById('matter').textContent = formatNumber(gameState.matter);
    document.getElementById('lightYears').textContent = formatNumber(gameState.lightYears);
    document.getElementById('essence').textContent = formatNumber(gameState.essence);
    document.getElementById('shards').textContent = formatNumber(gameState.shards);
    
    // Update multipliers
    document.getElementById('essenceMultiplier').textContent = gameState.essenceMultiplier.toFixed(2) + 'x';
    document.getElementById('shardMultiplier').textContent = gameState.shardMultiplier.toFixed(2) + 'x';
    
    // Update progress
    const progress = Math.min((gameState.lightYears / 1000000) * 100, 100);
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressPercent').textContent = Math.floor(progress);
    
    // Check for achievements/unlocks
    if (gameState.lightYears >= 100 && !gameState.prestigeLayer1Unlocked) {
        gameState.prestigeLayer1Unlocked = true;
        showNotification('Layer 1 Prestige Unlocked!');
    }
    
    // Update prestige buttons
    const essenceGain = calculatePrestigeGain('essence');
    const shardsGain = calculatePrestigeGain('shards');
    
    document.getElementById('essenceDisplay').textContent = formatNumber(gameState.essence);
    document.getElementById('essenceGain').textContent = formatNumber(essenceGain);
    document.getElementById('shardsDisplay').textContent = formatNumber(gameState.shards);
    document.getElementById('shardsGain').textContent = formatNumber(shardsGain);
    
    // Enable/disable prestige buttons
    document.getElementById('prestigeBtn1').disabled = essenceGain <= 0;
    document.getElementById('prestigeBtn2').disabled = gameState.essence < 10 || shardsGain <= 0;

    // Update stats tab
    document.getElementById('statTotalEnergy').textContent = formatNumber(gameState.totalEnergyGenerated);
    document.getElementById('statPrestigesL1').textContent = gameState.totalPrestigesL1;
    document.getElementById('statPrestigesL2').textContent = gameState.totalPrestigesL2;

    // Refresh generator/upgrade affordability every 30 frames (~0.5 s at 60 fps)
    if (renderFrame % 30 === 0) {
        renderGenerators();
        renderUpgrades();
    }
}

// Format large numbers
function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

// Calculate prestige gain
function calculatePrestigeGain(type) {
    if (type === 'essence') {
        if (gameState.lightYears < 100) return 0;
        let essenceGain = Math.floor(gameState.lightYears / 100);
        if (gameState.upgrades.cosmic_resonance) essenceGain *= 1.3;
        if (gameState.upgrades.essence_doubler) essenceGain *= 2;
        return Math.floor(essenceGain * gameState.essenceMultiplier);
    }
    
    if (type === 'shards') {
        if (gameState.essence < 10) return 0;
        let shardsGain = Math.floor(gameState.essence / 10);
        if (gameState.upgrades.shard_tripler) shardsGain *= 3;
        return Math.floor(shardsGain * gameState.shardMultiplier);
    }
    
    return 0;
}

// Buy a generator
function buyGenerator(generatorId) {
    const gen = generators[generatorId];
    const cost = gen.baseCost * Math.pow(1.15, gameState.generators[generatorId]);
    
    if (gameState[gen.currencyType] >= cost) {
        gameState[gen.currencyType] -= cost;
        gameState.generators[generatorId]++;
        renderGenerators();
        saveGame();
    }
}

// Buy an upgrade
function buyUpgrade(upgradeId) {
    if (gameState.upgrades[upgradeId]) return; // Already purchased
    
    const upgrade = upgrades[upgradeId];
    if (gameState[upgrade.costType] >= upgrade.cost) {
        gameState[upgrade.costType] -= upgrade.cost;
        gameState.upgrades[upgradeId] = true;
        upgrade.effect();
        renderUpgrades();
        showNotification(upgrade.name + ' purchased!');
        saveGame();
    }
}

// Prestige Layer 1
function prestigeLayer1() {
    const essenceGain = calculatePrestigeGain('essence');
    if (essenceGain <= 0) return;
    
    gameState.essence += essenceGain;
    gameState.totalPrestigesL1++;
    
    // Reset main currencies
    gameState.energy = 0;
    gameState.matter = 0;
    gameState.lightYears = 0;
    
    // Reset generators but keep multiplier
    for (const gen in gameState.generators) {
        gameState.generators[gen] = 0;
    }
    
    showNotification('Prestige Layer 1 Complete! Gained ' + essenceGain + ' Essence');
    saveGame();
}

// Prestige Layer 2
function prestigeLayer2() {
    if (gameState.essence < 10) return;
    
    const shardsGain = calculatePrestigeGain('shards');
    if (shardsGain <= 0) return;
    
    gameState.shards += shardsGain;
    gameState.totalPrestigesL2++;
    
    // Reset essence
    gameState.essence = 0;
    gameState.essenceMultiplier = 1;
    
    // Keep shards multiplier
    
    showNotification('Prestige Layer 2 Complete! Gained ' + shardsGain + ' Shards');
    saveGame();
}

// Click button
function clickEnergy() {
    let clickValue = 1;
    if (gameState.upgrades.efficiency_1) clickValue *= 1.25;
    if (gameState.upgrades.efficiency_2) clickValue *= 1.5;
    if (gameState.upgrades.efficiency_3) clickValue *= 2;
    
    gameState.energy += clickValue * gameState.essenceMultiplier;
    
    // Visual feedback
    const btn = document.getElementById('clickBtn');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 100);
}

// Render generators
function renderGenerators() {
    const container = document.getElementById('generators-container');
    container.innerHTML = '';
    
    for (const [genId, gen] of Object.entries(generators)) {
        const count = gameState.generators[genId];
        const cost = gen.baseCost * Math.pow(1.15, count);
        const canAfford = gameState[gen.currencyType] >= cost;
        
        const btn = document.createElement('button');
        btn.className = 'generator-btn' + (canAfford ? '' : ' disabled');
        btn.disabled = !canAfford;
        btn.innerHTML = `
            <span class="generator-name">${gen.icon} ${gen.name}</span>
            <span class="generator-info">Owned: ${count}</span>
            <span class="generator-info">Prod: ${(gen.baseProduction * count).toFixed(2)}</span>
            <span class="generator-cost">Cost: ${formatNumber(cost)} ${gen.currencyType}</span>
        `;
        btn.onclick = () => buyGenerator(genId);
        container.appendChild(btn);
    }
}

// Render upgrades
function renderUpgrades() {
    const container = document.getElementById('upgrades-container');
    container.innerHTML = '';
    
    for (const [upgradeId, upgrade] of Object.entries(upgrades)) {
        const purchased = gameState.upgrades[upgradeId];
        const canAfford = gameState[upgrade.costType] >= upgrade.cost && !purchased;
        
        const btn = document.createElement('button');
        btn.className = 'upgrade-btn' + (purchased ? ' purchased' : canAfford ? '' : ' disabled');
        btn.disabled = purchased || !canAfford;
        btn.innerHTML = `
            <span class="upgrade-name">${upgrade.name}</span>
            <span class="upgrade-info">${upgrade.description}</span>
            <span class="upgrade-cost">${purchased ? 'OWNED' : 'Cost: ' + formatNumber(upgrade.cost) + ' ' + upgrade.costType}</span>
        `;
        btn.onclick = () => buyUpgrade(upgradeId);
        container.appendChild(btn);
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('clickBtn').addEventListener('click', clickEnergy);
    document.getElementById('prestigeBtn1').addEventListener('click', prestigeLayer1);
    document.getElementById('prestigeBtn2').addEventListener('click', prestigeLayer2);
    
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('loadBtn').addEventListener('click', loadGame);
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Are you sure? This will reset your entire game!')) {
            localStorage.removeItem('sol5GameSave');
            location.reload();
        }
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab + '-tab').classList.add('active');
        });
    });
}

// Save game
function saveGame() {
    localStorage.setItem('sol5GameSave', JSON.stringify(gameState));
    const saveInfo = document.getElementById('saveInfo');
    saveInfo.textContent = 'Game saved at ' + new Date().toLocaleTimeString();
    saveInfo.style.color = '#64c8ff';
    setTimeout(() => { saveInfo.style.color = '#a0a0d0'; }, 2000);
}

// Load game
function loadGame() {
    const saved = localStorage.getItem('sol5GameSave');
    if (saved) {
        const loadedState = JSON.parse(saved);
        Object.assign(gameState, loadedState);
        renderGenerators();
        renderUpgrades();
        const saveInfo = document.getElementById('saveInfo');
        saveInfo.textContent = 'Game loaded!';
        saveInfo.style.color = '#64c8ff';
    }
}

// Show notification
function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = 'position: fixed; top: 20px; right: 20px; background: rgba(100, 200, 255, 0.2); border: 2px solid #64c8ff; padding: 15px 20px; border-radius: 8px; color: #64c8ff; font-weight: 600; z-index: 1000; animation: slideIn 0.3s ease;';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Start the game
window.addEventListener('DOMContentLoaded', initGame);
</script>
</body>
</html>
