// Initialize Lucide Icons
lucide.createIcons();

// Configuration from URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const presenterName = urlParams.get('presenter') || 'GCON2026 Presenter';
const sessionTitle = urlParams.get('session') || 'Hybrid Presentation';
const presenterId = presenterName.toLowerCase().replace(/\s+/g, '-');

// DOM Elements
const presenterEl = document.getElementById('presenter-name');
const sessionEl = document.getElementById('session-title');
const likeBtn = document.getElementById('like-btn');
const likeCountEl = document.getElementById('like-count');
const shareToggleBtn = document.getElementById('share-toggle');
const shareMenu = document.getElementById('share-menu');
const closeShareBtn = document.getElementById('close-share');
const copyLinkBtn = document.getElementById('copy-link');
const shareLinkedinBtn = document.getElementById('share-linkedin');
const shareWhatsappBtn = document.getElementById('share-whatsapp');
const toastEl = document.getElementById('toast');

// State Initialization
presenterEl.textContent = presenterName;
sessionEl.textContent = sessionTitle;

// Base "Global" Counts (Mock data)
const baseLikes = {
    'abuzar': 1242,
    'kumar': 893,
    'suhendran': 1504,
    'default': 521
};

let currentCount = baseLikes[presenterId] || baseLikes['default'];
let isLiked = localStorage.getItem(`gcon_liked_${presenterId}`) === 'true';

// Update internal count based on user action
if (isLiked) {
    likeBtn.classList.add('active');
    currentCount += 1;
}
updateCountDisplay(currentCount);

// --- Functions ---

function updateCountDisplay(count) {
    // Format large numbers (e.g., 1200 -> 1.2k)
    if (count >= 1000) {
        likeCountEl.textContent = (count / 1000).toFixed(1) + 'k';
    } else {
        likeCountEl.textContent = count;
    }
}

function toggleLike() {
    isLiked = !isLiked;
    
    if (isLiked) {
        currentCount += 1;
        likeBtn.classList.add('active');
        localStorage.setItem(`gcon_liked_${presenterId}`, 'true');
    } else {
        currentCount -= 1;
        likeBtn.classList.remove('active');
        localStorage.setItem(`gcon_liked_${presenterId}`, 'false');
    }
    
    updateCountDisplay(currentCount);
}

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    toastEl.classList.remove('hidden');
    
    setTimeout(() => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.classList.add('hidden'), 400);
    }, 2500);
}

function copyToClipboard() {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Link copied to clipboard!');
        shareMenu.classList.add('hidden');
    });
}

function shareOnPlatform(platform) {
    const text = `Check out this presentation by ${presenterName} at GCON2026: `;
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}${url}`;
    }
    
    window.open(shareUrl, '_blank');
}

// --- Event Listeners ---

likeBtn.addEventListener('click', toggleLike);

shareToggleBtn.addEventListener('click', () => {
    shareMenu.classList.remove('hidden');
});

closeShareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    shareMenu.classList.add('hidden');
});

copyLinkBtn.addEventListener('click', copyToClipboard);

shareLinkedinBtn.addEventListener('click', () => shareOnPlatform('linkedin'));
shareWhatsappBtn.addEventListener('click', () => shareOnPlatform('whatsapp'));

// Close share menu when clicking outside
document.addEventListener('click', (e) => {
    if (!shareMenu.contains(e.target) && e.target !== shareToggleBtn && !shareToggleBtn.contains(e.target)) {
        shareMenu.classList.add('hidden');
    }
});
