const PRICING_MATRIX = { 
    pipeline: { base: 2000, rates: { INR: 1, USD: 0.012 } },
    advanced: { base: 5500, rates: { INR: 1, USD: 0.012 } },
    hyper: { base: 12500, rates: { INR: 1, USD: 0.012 } }
};
const SYMBOLS = { INR: '₹', USD: '$' };
let currencyState = 'INR';
let billingCycleState = 'monthly';

// 🪙 INSTANT BACKGROUND CANVAS PARTICLE GENERATOR (LOADS IMMEDIATELY ON BOOT)
const bgCanvas = document.getElementById('ambient-particle-canvas');
const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
let particles = [];

function initCanvasSize() {
    if (!bgCanvas) return;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * window.innerHeight; // Fill screen vertically instantly
    }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + Math.random() * 80;
        // Increased base sizes slightly for better visibility
        this.size = Math.random() * 26 + 14; 
        this.speedY = -(Math.random() * 0.5 + 0.3);
        this.speedX = Math.random() * 0.4 - 0.2;
        this.type = Math.random() > 0.45 ? 'bitcoin' : 'bubble';
        // 🌟 CRITICAL: Significantly boosted opacity ranges to make them darker/clearer against the background
        this.opacity = Math.random() * 0.25 + 0.15; 
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = Math.random() * 0.01 - 0.005;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.y < -30) this.reset();
    }
    draw() {
        if (!bgCtx) return;
        bgCtx.save();
        bgCtx.translate(this.x, this.y);
        bgCtx.rotate(this.rotation);
        
        if (this.type === 'bitcoin') {
            bgCtx.fillStyle = `rgba(255, 200, 1, ${this.opacity})`;
            bgCtx.font = `bold ${this.size}px Arial`;
            bgCtx.fillText('₿', 0, 0);
        } else {
            bgCtx.strokeStyle = `rgba(217, 232, 226, ${this.opacity})`;
            // Thicker lines for the bubbles to stand out
            bgCtx.lineWidth = 1.5; 
            bgCtx.beginPath();
            bgCtx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            bgCtx.stroke();
        }
        bgCtx.restore();
    }
}

// Initialize and execute particle canvas sequence right away
initCanvasSize();
// 🌟 CRITICAL: Increased total count from 50 to 85 for a denser, richer field
particles = Array.from({ length: 85 }, () => new Particle());

function animateParticles() {
    if (bgCtx && bgCanvas) {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
    }
    requestAnimationFrame(animateParticles);
}
requestAnimationFrame(animateParticles);

window.addEventListener('resize', () => {
    initCanvasSize();
});

// 📜 SYSTEM EVENT LOGGER PIPELINE
const auditContainer = document.getElementById('audit-history-rows');
function logAuditEvent(action, details, type = 'info') {
    if (!auditContainer) return;
    const row = document.createElement('div');
    row.className = 'grid grid-cols-12 gap-4 px-4 py-2.5 items-center';
    const timestamp = new Date().toLocaleTimeString();
    
    let colorClass = 'text-white/80';
    if (type === 'warning') colorClass = 'text-red-400 font-semibold';
    if (type === 'success') colorClass = 'text-emerald-400';
    if (type === 'system') colorClass = 'text-forsythia';

    row.innerHTML = `
        <div class="col-span-3 text-mysticMint/40">${timestamp}</div>
        <div class="col-span-3 uppercase font-bold text-[10px] ${colorClass}">${action}</div>
        <div class="col-span-6 text-mysticMint/70 truncate">${details}</div>
    `;
    auditContainer.insertBefore(row, auditContainer.firstChild);
}

document.getElementById('clear-history-btn')?.addEventListener('click', () => {
    if (auditContainer) auditContainer.innerHTML = '';
    logAuditEvent('LOGS_CLEARED', 'Visual logging stack reset to base parameters.', 'system');
});

// 🔑 LOGIN PORTAL CONTROLLER Handshake routines
const authGateway = document.getElementById('auth-gateway');
const mainContent = document.getElementById('main-content');
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('auth-user')?.value.trim() || "admin_mesh_operator";
        
        if (authGateway) authGateway.classList.add('opacity-0', 'pointer-events-none');
        if (mainContent) {
            mainContent.classList.remove('opacity-0');
            mainContent.classList.add('opacity-100');
        }
        const userDisplayTag = document.getElementById('user-display-tag');
        if (userDisplayTag) userDisplayTag.innerText = username;
        
        logAuditEvent('USER_LOGIN', `Access code verification complete for user [${username}]`, 'success');
        executeAIEngineAudit();
    });
}

// 📊 REAL TIME TIMELINE GRAPH MATRIX SCRUBBER SETUP
const canvas = document.getElementById('timelineGraph');
const ctx = canvas ? canvas.getContext('2d') : null;
const speedReadout = document.getElementById('graph-speed-readout');

let graphDataPoints = [440, 452, 448, 460, 455, 438, 442, 450, 447, 459, 462, 450, 442, 449, 453, 458, 441, 446, 450, 455, 448, 452, 449, 450];
let historicalTimestamps = [];
let isLagging = false;

function generateTimestamps() {
    historicalTimestamps = [];
    let baseTime = new Date();
    for (let i = graphDataPoints.length - 1; i >= 0; i--) {
        let t = new Date(baseTime.getTime() - i * 60000);
        historicalTimestamps.push(t.toLocaleTimeString());
    }
}
generateTimestamps();

function resizeGraphCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeGraphCanvas);
setTimeout(resizeGraphCanvas, 150);

const scrubTooltip = document.getElementById('chart-scrub-tooltip');
const scrubTime = document.getElementById('scrub-time');
const scrubVal = document.getElementById('scrub-val');
let currentHoverIndex = -1;

if (canvas && scrubTooltip) {
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = canvas.clientWidth;
        const sliceWidth = width / (graphDataPoints.length - 1);
        const targetIndex = Math.min(Math.max(Math.round(x / sliceWidth), 0), graphDataPoints.length - 1);
        
        currentHoverIndex = targetIndex;
        const dataVal = graphDataPoints[targetIndex];
        const timestampStr = historicalTimestamps[targetIndex] || "00:00:00";
        
        scrubTooltip.style.opacity = '1';
        scrubTooltip.style.left = `${x + 15}px`;
        scrubTooltip.style.top = `${e.clientY - rect.top - 45}px`;
        
        if (scrubTime) scrubTime.innerText = `⏱️ ${timestampStr}`;
        if (scrubVal) scrubVal.innerText = `${dataVal} MB/s`;
        if (speedReadout) speedReadout.innerText = `${dataVal} MB/s`;
    });

    canvas.addEventListener('mouseleave', () => {
        scrubTooltip.style.opacity = '0';
        currentHoverIndex = -1;
    });
}

function drawInteractiveGraph() {
    if (!canvas || !ctx) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isLagging) {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.15)');
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = '#EF4444';
    } else {
        gradient.addColorStop(0, 'rgba(255, 200, 1, 0.15)');
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = '#FFC801';
    }

    ctx.beginPath();
    const sliceWidth = width / (graphDataPoints.length - 1);
    
    graphDataPoints.forEach((point, i) => {
        const y = height - (point / 600) * (height * 0.7) - (height * 0.1);
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.closePath();
    ctx.fillStyle = gradient; ctx.fill();

    if (currentHoverIndex !== -1) {
        const scrubX = currentHoverIndex * sliceWidth;
        ctx.strokeStyle = 'rgba(255, 200, 1, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(scrubX, 0); ctx.lineTo(scrubX, height); ctx.stroke();
        ctx.setLineDash([]);
    }

    requestAnimationFrame(drawInteractiveGraph);
}

function executeAIEngineAudit() {
    const aiTrendTitle = document.getElementById('ai-trend-title');
    const aiTrendDesc = document.getElementById('ai-trend-desc');
    if (!aiTrendTitle) return;
    aiTrendTitle.innerText = isLagging ? "Negative Volatility Spike" : "Stable Matrix Bounds";
    if (aiTrendDesc) aiTrendDesc.innerText = isLagging ? "Mesh metrics collapsed down under cluster pressure." : "Data loops operating safely within parameter frameworks.";
}

// Pricing System DOM sync matrix
function updatePricingDOM() {
    Object.keys(PRICING_MATRIX).forEach(tier => {
        const element = document.getElementById(`price-${tier}`);
        if (element) {
            const factor = billingCycleState === 'annual' ? 12 * 0.8 : 1.0;
            let computed = PRICING_MATRIX[tier].base * PRICING_MATRIX[tier].rates[currencyState] * factor;
            element.innerText = `${SYMBOLS[currencyState]}${Math.round(computed)}`;
        }
    });
}

document.getElementById('currency-select')?.addEventListener('change', (e) => {
    currencyState = e.target.value;
    updatePricingDOM();
    logAuditEvent('CURRENCY_CHANGE', `Currency mode altered to token: ${currencyState}`);
});

document.getElementById('billing-toggle')?.addEventListener('change', (e) => {
    billingCycleState = e.target.checked ? 'annual' : 'monthly';
    updatePricingDOM();
});

document.getElementById('sim-inject-err')?.addEventListener('click', () => {
    isLagging = true;
    graphDataPoints = graphDataPoints.map(v => Math.floor(v * 0.35));
    
    document.getElementById('sim-node1-val').innerText = "54ms";
    document.getElementById('sim-node2-val').innerText = "61ms";
    const healthBadge = document.getElementById('mesh-health-badge');
    if (healthBadge) {
        healthBadge.className = "text-red-500 font-bold flex items-center gap-1";
        healthBadge.innerHTML = `<span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> COMPROMISED`;
    }

    executeAIEngineAudit();
    logAuditEvent('ANOMALY_TRIGGER', 'Simulated system performance degradation executed.', 'warning');
});

document.getElementById('sim-reset-mesh')?.addEventListener('click', () => {
    isLagging = false;
    graphDataPoints = [440, 452, 448, 460, 455, 438, 442, 450, 447, 459, 462, 450, 442, 449, 453, 458, 441, 446, 450, 455, 448, 452, 449, 450];
    generateTimestamps();
    
    document.getElementById('sim-node1-val').innerText = "11ms";
    document.getElementById('sim-node2-val').innerText = "10ms";
    const healthBadge = document.getElementById('mesh-health-badge');
    if (healthBadge) {
        healthBadge.className = "text-emerald-400 font-bold flex items-center gap-1";
        healthBadge.innerHTML = `<span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> HEALTHY`;
    }

    executeAIEngineAudit();
    logAuditEvent('CLUSTER_RESET', 'Restored automated optimization baseline bounds.', 'success');
});

// Modal popups deployment mocks
const termModal = document.getElementById('terminal-modal');
const termBody = document.getElementById('terminal-body');
function triggerTerminalMock(act) {
    if (!termModal) return;
    termModal.classList.remove('opacity-0', 'pointer-events-none');
    if (termBody) termBody.innerHTML = `<p class="text-white/40">[process] Initializing compile sequence array: "${act}"</p>`;
    logAuditEvent('PROVISION_REQ', `Dispatched runtime deployment request tracking token.`, 'info');
}
document.getElementById('close-terminal')?.addEventListener('click', () => termModal.classList.add('opacity-0', 'pointer-events-none'));

updatePricingDOM();
if (canvas) requestAnimationFrame(drawInteractiveGraph);