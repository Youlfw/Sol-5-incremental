// --- GAME STATE (Your Original Values) ---
const gameState = {
    energy: 0,
    matter: 0,
    lightYears: 0,
    essence: 0,
    shards: 0,
    essenceMultiplier: 1,
    shardMultiplier: 1,
    generators: {
        solar_collector: 0,
        matter_converter: 0,
        light_harvester: 0,
        quantum_reactor: 0,
        stellar_engine: 0
    },
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
    prestigeLayer1Unlocked: false,
    prestigeLayer2Unlocked: false,
    totalEnergyGenerated: 0,
    totalPrestigesL1: 0,
    totalPrestigesL2: 0,
    autoSaveInterval: 10000 
};

// --- DEFINITIONS (Your Original Balance) ---
const generators = {
    solar_collector: { name: 'Solar Collector', baseCost: 10, baseProduction: 0.1, currencyType: 'energy', description: 'Collects solar energy', icon: '☀️' },
    matter_converter: { name: 'Matter Converter', baseCost: 100, baseProduction: 0.5, currencyType: 'matter', description: 'Converts matter', icon: '🪨' },
    light_harvester: { name: 'Light Harvester', baseCost: 500, baseProduction: 0.2, currencyType: 'lightYears', description: 'Harvests light energy', icon: '💫' },
    quantum_reactor: { name: 'Quantum Reactor', baseCost: 5000, baseProduction: 1, currencyType: 'energy', description: 'Quantum energy generation', icon: '⚛️' },
    stellar_engine: { name: 'Stellar Engine', baseCost: 50000, baseProduction: 5, currencyType: 'lightYears', description: 'Advanced stellar propulsion', icon: '🚀' }
};

const upgrades = {
    efficiency_1: { name: 'Efficiency I', cost: 50, costType: 'energy', description: '+25% Energy Generation' },
    efficiency_2: { name: 'Efficiency II', cost: 500, costType: 'energy', description: '+50% Energy Generation' },
    efficiency_3: { name: 'Efficiency III', cost: 5000, costType: 'energy', description: '+100% Energy Generation' },
    matter_boost_1: { name: 'Matter Boost I', cost: 200, costType: 'matter', description: '+50% Matter Generation' },
    matter_boost_2: { name: 'Matter Boost II', cost: 2000, costType: 'matter', description: '+100% Matter Generation' },
    light_years_boost: { name: 'Light-Year Boost', cost: 1000, costType: 'lightYears', description: '+25% Light-Year Generation' },
    passive_generation: { name: 'Passive Generation', cost: 10000, costType: 'energy', description: 'Generators produce 2x offline' },
    quantum_leap: { name: 'Quantum Leap', cost: 50000, costType: 'lightYears', description: 'Unlock Layer 2 Prestige', effect: () => { gameState.prestigeLayer2Unlocked = true; } },
    cosmic_resonance: { name: 'Cosmic Resonance', cost: 100, costType: 'essence', description: '+30% Essence Gain', effect: () => { gameState.essenceMultiplier *= 1.3; } },
    essence_doubler: { name: 'Essence Doubler', cost: 500, costType: 'essence', description: 'Double Essence gain on prestige', effect: () => { gameState.essenceMultiplier *= 2; } },
    shard_tripler: { name: 'Shard Tripler', cost: 50, costType: 'shards', description: '3x Shard generation', effect: () => { gameState.shardMultiplier *= 3; } }
};

// --- NEW SYSTEM FUNCTIONS ---

function buyGenerator(genId) {
    const gen = generators[genId];
    if (gameState[gen.currencyType] >= gen.baseCost) {
        gameState[gen.currencyType] -= gen.baseCost;
        gameState.generators[genId]++;
        renderGenerators();
    }
}

function buyUpgrade(upgradeId) {
    const upgrade = upgrades[upgradeId];
    if (!gameState.upgrades[upgradeId] && gameState[upgrade.costType] >= upgrade.cost) {
        gameState[upgrade.costType] -= upgrade.cost;
        gameState.upgrades[upgradeId] = true;
        if (upgrade.effect) upgrade.effect();
        renderUpgrades();
    }
}

// --- UI & RENDER LOGIC ---

function renderGenerators() {
    const container = document.getElementById('generators-container');
    if (!container) return;
    container.innerHTML = '<h3>Generators</h3>';
    for (const id in generators) {
        const gen = generators[id];
        const btn = document.createElement('button');
        btn.innerHTML = `${gen.icon} ${gen.name} (${gameState.generators[id]})<br>Cost: ${gen.baseCost} ${gen.currencyType}`;
        btn.onclick = () => buyGenerator(id);
        container.appendChild(btn);
    }
}

function renderUpgrades() {
    const container = document.getElementById('upgrades-container');
    if (!container) return;
    container.innerHTML = '<h3>Upgrades</h3>';
    for (const id in upgrades) {
        const upg = upgrades[id];
        if (gameState.upgrades[id]) continue; 
        const btn = document.createElement('button');
        btn.innerHTML = `<strong>${upg.name}</strong><br>${upg.description}<br>Cost: ${upg.cost} ${upg.costType}`;
        btn.onclick = () => buyUpgrade(id);
        container.appendChild(btn);
    }
}

function formatNumber(num) { return Math.floor(num).toLocaleString(); }

// --- CORE GAME LOOP ---

function update() {
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime) / 1000;
    lastUpdateTime = now;

    ['energy', 'matter', 'lightYears'].forEach(type => {
        const prod = calculateProduction(type);
        gameState[type] += prod * deltaTime;
        const el = document.getElementById(`${type}PerSec`);
        if (el) el.textContent = prod.toFixed(2);
    });
}

function calculateProduction(currencyType) {
    let production = 0;
    for (const [genId, count] of Object.entries(gameState.generators)) {
        const gen = generators[genId];
        if (gen.currencyType === currencyType) {
            let genProduction = gen.baseProduction * count;
            // Energy Boosts
            if (currencyType === 'energy') {
                if (gameState.upgrades.efficiency_1) genProduction *= 1.25;
                if (gameState.upgrades.efficiency_2) genProduction *= 1.5;
                if (gameState.upgrades.efficiency_3) genProduction *= 2;
            }
            // Matter Boosts
            if (gameState.upgrades.matter_boost_1 && currencyType === 'matter') genProduction *= 1.5;
            if (gameState.upgrades.matter_boost_2 && currencyType === 'matter') genProduction *= 2;
            // LY Boosts
            if (gameState.upgrades.light_years_boost && currencyType === 'lightYears') genProduction *= 1.25;
            // Global Multiplier
            if (gameState.essenceMultiplier > 1) genProduction *= gameState.essenceMultiplier;
            
            production += genProduction;
        }
    }
    return production;
}

function render() {
    document.getElementById('energy').textContent = formatNumber(gameState.energy);
    document.getElementById('matter').textContent = formatNumber(gameState.matter);
    document.getElementById('lightYears').textContent = formatNumber(gameState.lightYears);
}

let lastUpdateTime = Date.now();
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start
window.onload = () => {
    renderGenerators();
    renderUpgrades();
    gameLoop();
};
