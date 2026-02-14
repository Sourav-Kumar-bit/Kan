// script.js
let currentStep = 1;
let confettiInterval;
const sadConfigs = {
    1: {
        title: "Oh Kangana… 💔",
        message: "That makes me a little sad… but you're still special to me.",
        emojis: "😔💔🥺",
        animationClass: "tear",
        animationCount: 5
    },
    2: {
        title: "Kangana… 🌑",
        message: "I really love talking to you. Hope I didn't make you uncomfortable.",
        emojis: "😞💭💔",
        animationClass: "cloud",
        animationCount: 4
    },
    3: {
        title: "Not yet, Kangana? 🌹",
        message: "You're still my favorite person. I'll keep trying to make you smile.",
        emojis: "😢💕😔",
        animationClass: "wilt",
        animationCount: 6
    }
};

function nextStep(step, isYes) {
    if (isYes) {
        // Yes: Proceed with enhanced animation
        document.getElementById(`step${step}`).classList.remove('active');
        if (step === 3) {
            finalStep(true);
        } else {
            document.getElementById(`step${step + 1}`).classList.add('active');
            currentStep = step + 1;
            createMiniConfetti();
            // Background transition
            setTimeout(() => document.body.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 50%, #44a08d 100%)', 500);
        }
    } else {
        // No: Step-specific sad
        showSadOverlay(step);
    }
}

function finalStep(isYes) {
    if (isYes) {
        document.getElementById('step3').classList.remove('active');
        document.getElementById('final-yes').classList.add('active');
        // Launch full confetti with more pieces
        launchConfetti(300);
        // Enhanced heart rain
        startHeartRain();
        // Celebration background
        document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ff6b6b 100%)';
    } else {
        showSadOverlay(3);
    }
}

function showSadOverlay(step) {
    const config = sadConfigs[step];
    document.getElementById('sad-title').innerHTML = config.title;
    document.getElementById('sad-message').innerHTML = config.message;
    document.getElementById('sad-emojis').innerHTML = config.emojis;
    
    const animContainer = document.getElementById('sad-animations');
    animContainer.innerHTML = '';
    animContainer.className = `sad-animations ${config.animationClass}`;
    
    for (let i = 0; i < config.animationCount; i++) {
        const anim = document.createElement('div');
        anim.className = config.animationClass;
        anim.style.animationDelay = `${i * 0.5}s`;
        anim.style.left = `${Math.random() * 100}%`;
        animContainer.appendChild(anim);
    }
    
    document.getElementById('sad-overlay').classList.remove('hidden');
}

function retryCurrentStep() {
    document.getElementById('sad-overlay').classList.add('hidden');
    // Return to current step
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${currentStep}`).classList.add('active');
    // Reset background if needed
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)';
}

function restart() {
    // Reset to step 1
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    document.getElementById('sad-overlay').classList.add('hidden');
    currentStep = 1;
    // Clear effects
    clearConfetti();
    stopHeartRain();
    // Reset background
    document.body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)';
}

function createMiniConfetti() {
    // Enhanced mini popper: more hearts and rotation
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = ['💖', '💕', '💗'][Math.floor(Math.random() * 3)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.top = Math.random() * 50 + 'vh';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '999';
            heart.style.animation = `heartRain 3s linear forwards, rotate360 1s linear infinite`;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, i * 50);
    }
}

function launchConfetti(count = 200) {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];

    for (let i = 0; i < count; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 200 + 200,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngle: Math.random() * Math.PI * 2,
            rotation: Math.random() * 360
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        confetti.forEach((c, i) => {
            c.tiltAngle += 0.1;
            c.rotation += 5;
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle) * 15;
            c.x += Math.sin(c.rotation * Math.PI / 180) * 2;

            if (c.y > canvas.height) {
                confetti.splice(i, 1);
            } else {
                active = true;
                ctx.save();
                ctx.translate(c.x + c.tilt + c.r / 4, c.y);
                ctx.rotate(c.rotation * Math.PI / 180);
                ctx.beginPath();
                ctx.lineWidth = c.r;
                ctx.strokeStyle = c.color;
                ctx.moveTo(0, 0);
                ctx.lineTo(c.tilt, c.tilt + c.r / 4);
                ctx.stroke();
                ctx.restore();
            }
        });

        if (active) {
            requestAnimationFrame(draw);
        }
    }

    draw();
}

function clearConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function startHeartRain() {
    // CSS handles, but add more dynamically
    for (let i = 9; i <= 16; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-float';
        heart.innerHTML = '💖';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        document.querySelector('.hearts-overflow').appendChild(heart);
    }
}

function stopHeartRain() {
    document.querySelectorAll('.heart-float').forEach(heart => {
        heart.style.animationPlayState = 'paused';
    });
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Touch enhancement for mobile
document.addEventListener('touchstart', (e) => {
    e.preventDefault();
}, { passive: false });