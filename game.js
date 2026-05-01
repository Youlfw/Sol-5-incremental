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
const upgrades = {
    efficiency_1: {
        name: 'Efficiency I',
        cost: 50,
        costType: 'energy',
        description: '+25% Energy Generation',
        effect: () => { gameState.essenceMultiplier *= 1.25; }
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
        effect: () => { gameState.essenceMultiplier *= 1.3; }
    },
    essence_doubler: {
        name: 'Essence Doubler',
        cost: 500,
        costType: 'essence',
        description: 'Double Essence gain on prestige',
        effect: () => { gameState.essenceMultiplier *= 2; }
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

// Render function (update UI)
function render() {
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

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Start the game
window.addEventListener('DOMContentLoaded', initGame);
