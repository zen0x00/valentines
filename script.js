/**
 * Valentine's Day - Mobile-First Minimal Experience
 * Optimized for smooth performance on all devices
 */

// ===== Configuration - Optimized for Mobile =====
const CONFIG = {
    valentineMessage: "Happy Valentine's Day ❤️",
    romanticParagraph: `Every moment with you feels like a beautiful dream I never want to wake up from. Your presence brings a quiet warmth to my days, and your love fills my heart in ways words cannot capture. You are my favorite hello and my hardest goodbye. In this world of fleeting moments, my love for you remains constant and true. Today and always, you are the calm in my chaos, the warmth in my silence, and the love of my life.`,
    
    // Responsive settings
    mobile: {
        typingSpeed: 55,
        paragraphTypingSpeed: 32,
        particleCount: 6,
        sparkleCount: 10
    },
    desktop: {
        typingSpeed: 65,
        paragraphTypingSpeed: 38,
        particleCount: 12,
        sparkleCount: 15
    }
};

// ===== Device Detection =====
const isMobile = () => window.innerWidth < 600;
const getConfig = (key) => isMobile() ? CONFIG.mobile[key] : CONFIG.desktop[key];

// ===== DOM Elements =====
const elements = {
    valentineTitle: document.getElementById('valentineTitle'),
    continueBtn: document.getElementById('continueBtn'),
    initialSection: document.getElementById('initialSection'),
    messageSection: document.getElementById('messageSection'),
    messageContent: document.getElementById('messageContent'),
    floatingParticles: document.getElementById('floatingParticles'),
    sparkleContainer: document.getElementById('sparkleContainer'),
    musicToggle: document.getElementById('musicToggle'),
    backgroundMusic: document.getElementById('backgroundMusic'),
    footer: document.getElementById('footer')
};

// ===== State =====
let state = {
    isMusicPlaying: false,
    titleTypingComplete: false,
    paragraphTypingComplete: false,
    canTapToContinue: false
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initFloatingParticles();
    initMusic();
    initTapAnywhere();
    startInitialSequence();
});

// ===== Floating Particles - Performance Optimized =====
function initFloatingParticles() {
    const count = getConfig('particleCount');
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < count; i++) {
        const particle = createParticle(i);
        fragment.appendChild(particle);
    }
    
    elements.floatingParticles.appendChild(fragment);
}

function createParticle(index) {
    const particle = document.createElement('div');
    const isPetal = Math.random() > 0.5;
    
    particle.className = isPetal ? 'particle petal' : 'particle dot';
    
    const size = isPetal ? null : 3 + Math.random() * 4;
    const leftPosition = Math.random() * 100;
    const animationDelay = Math.random() * 22;
    const animationDuration = 20 + Math.random() * 12;
    
    particle.style.cssText = `
        left: ${leftPosition}%;
        animation-delay: ${animationDelay}s;
        animation-duration: ${animationDuration}s;
        ${!isPetal ? `width: ${size}px; height: ${size}px;` : ''}
    `;
    
    return particle;
}

// ===== Music Control =====
function initMusic() {
    elements.backgroundMusic.volume = 0.2;
    elements.musicToggle.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    const musicOnIcon = elements.musicToggle.querySelector('.music-on');
    const musicOffIcon = elements.musicToggle.querySelector('.music-off');
    
    if (state.isMusicPlaying) {
        elements.backgroundMusic.pause();
        musicOnIcon.style.display = 'none';
        musicOffIcon.style.display = 'block';
    } else {
        elements.backgroundMusic.play().catch(() => {
            // Silent fail - audio requires user interaction
        });
        musicOnIcon.style.display = 'block';
        musicOffIcon.style.display = 'none';
    }
    
    state.isMusicPlaying = !state.isMusicPlaying;
    
    // Haptic feedback on mobile
    triggerHaptic('light');
}

// ===== Tap Anywhere to Continue =====
function initTapAnywhere() {
    // Add tap hint element
    const tapHint = document.createElement('div');
    tapHint.className = 'tap-hint';
    tapHint.textContent = 'or tap anywhere';
    elements.continueBtn.parentNode.appendChild(tapHint);
    
    // Listen for taps on the initial section
    elements.initialSection.addEventListener('click', (e) => {
        // Don't trigger if clicking on button or music toggle
        if (e.target.closest('.continue-btn') || e.target.closest('.music-toggle')) {
            return;
        }
        
        if (state.canTapToContinue && elements.initialSection.classList.contains('active')) {
            transitionToMessage();
        }
    });
}

// ===== Haptic Feedback =====
function triggerHaptic(style = 'light') {
    if ('vibrate' in navigator) {
        const patterns = {
            light: [10],
            medium: [20],
            heavy: [30]
        };
        navigator.vibrate(patterns[style] || patterns.light);
    }
}

// ===== Initial Sequence =====
function startInitialSequence() {
    // Shorter wait for mobile (faster heart animation)
    const heartAnimationDuration = isMobile() ? 2200 : 2600;
    
    setTimeout(() => {
        typeText(
            elements.valentineTitle, 
            CONFIG.valentineMessage, 
            getConfig('typingSpeed'),
            onTitleComplete
        );
    }, heartAnimationDuration);
}

function onTitleComplete() {
    state.titleTypingComplete = true;
    state.canTapToContinue = true;
    elements.valentineTitle.classList.add('typing-done');
    
    // Show continue button
    setTimeout(() => {
        elements.continueBtn.classList.add('visible');
        
        // Show tap hint on mobile after a delay
        if (isMobile()) {
            setTimeout(() => {
                const tapHint = document.querySelector('.tap-hint');
                if (tapHint) tapHint.classList.add('visible');
            }, 800);
        }
    }, 500);
}

// ===== Continue Button Handler =====
elements.continueBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    transitionToMessage();
});

function transitionToMessage() {
    if (!state.titleTypingComplete) return;
    
    // Prevent double-tap
    state.canTapToContinue = false;
    
    // Haptic feedback
    triggerHaptic('medium');
    
    // Hide tap hint immediately
    const tapHint = document.querySelector('.tap-hint');
    if (tapHint) tapHint.classList.remove('visible');
    
    // Fade out initial section
    elements.initialSection.classList.add('fade-out');
    
    setTimeout(() => {
        elements.initialSection.classList.remove('active');
        elements.messageSection.classList.add('active');
        
        // Scroll to top smoothly (for mobile)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Start typing the paragraph
        setTimeout(() => {
            typeText(
                elements.messageContent,
                CONFIG.romanticParagraph,
                getConfig('paragraphTypingSpeed'),
                onParagraphComplete
            );
        }, 400);
    }, 800);
}

function onParagraphComplete() {
    state.paragraphTypingComplete = true;
    elements.messageContent.classList.add('typing-done');
    
    // Add glow effect
    elements.messageContent.classList.add('glow-complete');
    
    // Create sparkles
    requestAnimationFrame(() => {
        createSparkles();
    });
    
    // Haptic for completion
    triggerHaptic('light');
    
    // Show footer
    setTimeout(() => {
        elements.footer.classList.add('visible');
    }, 1000);
}

// ===== Typewriter Effect - Optimized =====
function typeText(element, text, speed, callback) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            const char = text.charAt(index);
            element.textContent += char;
            index++;
            
            // Minimal variance for smoother feel
            const variance = Math.random() * 15 - 7;
            let delay = speed + variance;
            
            // Shorter pauses on mobile
            if (['.', ',', '—'].includes(char)) {
                delay += isMobile() ? 80 : 100;
            }
            
            setTimeout(type, delay);
        } else {
            if (callback) callback();
        }
    }
    
    // Use requestAnimationFrame for smoother start
    requestAnimationFrame(type);
}

// ===== Sparkle Effect - Performance Optimized =====
function createSparkles() {
    const container = elements.sparkleContainer;
    const rect = elements.messageContent.getBoundingClientRect();
    const count = getConfig('sparkleCount');
    
    // Use DocumentFragment
    const fragment = document.createDocumentFragment();
    const sparkles = [];
    
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.animationDelay = `${i * 0.1}s`;
        
        fragment.appendChild(sparkle);
        sparkles.push(sparkle);
    }
    
    container.appendChild(fragment);
    
    // Clean up after animation
    setTimeout(() => {
        sparkles.forEach(s => s.remove());
    }, 2200);
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && state.canTapToContinue) {
        e.preventDefault();
        transitionToMessage();
    }
    
    if (e.code === 'KeyM') {
        toggleMusic();
    }
});

// ===== Visibility Change Handler (pause music when tab hidden) =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.isMusicPlaying) {
        elements.backgroundMusic.pause();
    } else if (!document.hidden && state.isMusicPlaying) {
        elements.backgroundMusic.play().catch(() => {});
    }
});

// ===== Resize Handler (reinit particles on orientation change) =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Clear and reinit particles on significant resize
        const particles = elements.floatingParticles;
        if (particles.children.length !== getConfig('particleCount')) {
            particles.innerHTML = '';
            initFloatingParticles();
        }
    }, 300);
});
