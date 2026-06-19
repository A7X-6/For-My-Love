function playClickSound() {
    clickSound.currentTime = 0;

    clickSound.play().catch(() => {
        // fallback kalau browser delay
        setTimeout(() => {
            clickSound.play();
        }, 10);
    });
}

function warmupAudio() {
    clickSound.currentTime = 0;
    clickSound.volume = 0;

    clickSound.play()
        .then(() => {
            clickSound.pause();
            clickSound.currentTime = 0;
            clickSound.volume = 0.6;
        })
        .catch(() => {});
}

function showSection(id) {
    // Hide all main sections
    document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
    
    // Show target section
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
    }
    
    // Scroll to top of container
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openLetter() {
    playPaperSound();
    if (bgMusic.paused) {
        bgMusic.play();
    }

    showSection('letter');

    document.getElementById("letter")
        .classList.remove("hidden");
    document.getElementById("letter")
        .scrollIntoView({behavior:"smooth"});
}

function showGalleries() {
    document.getElementById('navbar')
        .classList.remove('hidden');
    document.getElementById('emoji-navbar')
        .classList.remove('hidden');

    showSection('galleries');
}

function showGallery(id) {

    playCameraSound();

    // Hide all galleries and pages within the gallery section
    document.querySelectorAll('.gallery, .gallery-page').forEach(el => el.classList.add('hidden'));
    
    // Show selected gallery
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
    }
}

function showSubGallery(id) {

    playCameraSound();

    // Hide all subgalleries
    document.querySelectorAll('.subgallery').forEach(el => el.classList.add('hidden'));
    
    // Show selected subgallery
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
    }
}

function selectEmoji(btn, emoji){
    if(selectedEmoji === emoji){
        selectedEmoji = null;

        document
            .querySelectorAll('.emoji-navbar button')
            .forEach(b => b.classList.remove('active'));
        return;
    }

    selectedEmoji = emoji;
    document
        .querySelectorAll('.emoji-navbar button')
        .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    btn.classList.add('emoji-active');

    setTimeout(() => {
    btn.classList.remove('emoji-active');
    }, 300);
}

function playEmojiSound() {
    emojiSound.currentTime = 0;
    emojiSound.play().catch(() => {});
}

function playPaperSound() {
    paperSound.currentTime = 0;
    paperSound.play().catch(() => {});
}

function playCameraSound() {
    cameraSound.currentTime = 0;
    cameraSound.play().catch(() => {});
}

function openPopup(src) {
    const popup = document.getElementById('popup');
    const img = document.getElementById('popup-img');
    if (popup && img) {
        img.src = src;
        popup.classList.remove('hidden');
        img.classList.remove('show');
        void img.offsetWidth;
        requestAnimationFrame(() => { img.classList.add('show'); })
    }
}

function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const emojiSound = document.getElementById("emojiSound");
const paperSound = document.getElementById("paperSound");
const cameraSound = document.getElementById("cameraSound");

bgMusic.volume = 0.3;
clickSound.volume = 0.6;
emojiSound.volume = 0.5;
paperSound.volume = 0.7;
cameraSound.volume = 0.6;

// Floating Hearts Interactive Logic
const container = document.getElementById('hearts-container');
const hearts = [];
let mouseX = 0;
let mouseY = 0;

let selectedEmoji = null;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function createHeart() {
    if (!container) return;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = ['🩷', '❤️', '🤍', '💘', '💖', '💝'][Math.floor(Math.random() * 5)];
    
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight + 50;
    const size = Math.random() * 20 + 15;
    
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = size + 'px';
    
    container.appendChild(heart);
    
    const heartObj = {
        el: heart,
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 2 + 1),
        size: size
    };
    
    hearts.push(heartObj);

    setTimeout(() => {
        const index = hearts.indexOf(heartObj);
        if (index > -1) {
            hearts.splice(index, 1);
            heart.remove();
        }
    }, 8000);
}

function updateHearts() {
    hearts.forEach(heart => {
        heart.x += heart.vx;
        heart.y += heart.vy;

        const dx = mouseX - heart.x;
        const dy = mouseY - heart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const force = (150 - distance) / 150;
            heart.vx -= dx * force * 0.05;
            heart.vy -= dy * force * 0.05;
        }

        // Use translation for better performance
        heart.el.style.transform = `translate(${heart.x}px, ${heart.y - (window.innerHeight + 50)}px)`;
    });

    requestAnimationFrame(updateHearts);
}

setInterval(createHeart, 400);
updateHearts();

// Handle close on popup click
document.getElementById('popup')?.addEventListener('click', (e) => {
    if (e.target.id === 'popup') closePopup();
});

function isSpecialButton(target) {
    return target.classList.contains("scrap-btn");
}

document.addEventListener("click", function(e){

    if(!selectedEmoji) return;

    if(
        e.target.closest('.navbar') ||
        e.target.closest('.emoji-navbar') ||
        e.target.closest('img') ||
        e.target.closest('video') ||
        isSpecialButton(e.target)
    ){
        return;
    }

// suara saat menempel emoji
playEmojiSound();
createRipple(e.clientX, e.clientY);

    const sticker = document.createElement('div');

    sticker.className = 'emoji-sticker';
    sticker.textContent = selectedEmoji;

    sticker.style.left = e.clientX + 'px';
    sticker.style.top = e.clientY + 'px';

    document.querySelector('.scrapbook-container').appendChild(sticker);

function createRipple(x, y) {
    const colors = [
    "rgba(65, 105, 225, 0.9)",
    "rgba(225, 20, 147, 0.9)",
    "rgba(138, 43, 226, 0.9)"
    ];

    for (let i = 0; i < 3; i++) {
        const ripple = document.createElement("div");
        ripple.className = "ripple";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.style.borderColor = colors[i];
        ripple.style.width = (20 + i * 10) + "px";
        ripple.style.height = (20 + i * 10) + "px";
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }
}

    setTimeout(() => {
        sticker.classList.add('fade-out');
    }, 1500);

    setTimeout(() => {
        sticker.remove();
    }, 1900);
});

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("locked");

    const correctPassword = "OneForEternity67";

    const passwordScreen = document.getElementById("password-screen");
    const passwordInput = document.getElementById("password-input");
    const passwordError = document.getElementById("password-error");
    const passwordEnter = document.getElementById("password-enter");

passwordEnter.addEventListener("click", checkPassword);

function checkPassword() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    if (passwordInput.value === correctPassword) {
        passwordScreen.style.display = "none";
        document.body.classList.remove("locked");
        showSection("hero");

        bgMusic.currentTime = 0;
        bgMusic.play().catch(() => {});
    } else {
        passwordError.textContent = "Password salah";
        const frame = document.querySelector(".password-frame");

        frame.classList.remove("shake");
        void frame.offsetWidth;
        frame.classList.add("shake");
    }
}

passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkPassword();
    }
});

passwordInput.addEventListener("input", () => {
    passwordError.textContent = "";
});

    document.querySelectorAll(".section").forEach(el => {
        if (el.id !== "hero") { el.classList.add("hidden"); }
    });

    document.querySelectorAll("button, .nav-links a").forEach(el => {

    if (
    el.classList.contains("scrap-btn") ||
    el.classList.contains("special-sound")
) {
    return;
}

    el.addEventListener("click", playClickSound);
});

    document.addEventListener("click", warmupAudio, { once: true });
});
