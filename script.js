document.addEventListener('DOMContentLoaded', () => {
    const yesBtn       = document.getElementById('yes-btn');
    const noBtn        = document.getElementById('no-btn');
    const response     = document.getElementById('response');
    const escapeMsg    = document.getElementById('escape-message');
    const audio        = document.getElementById('bg-music');
    const heading      = document.querySelector('h1');  // ← new: grab the h1

    const escapePhrases = [
        "Sadist 👀",
        "Overaction Cheyaku 😤",
        "Chalu inka !!! ",
        "Champa Pagluthundhi 😤",
        "Anthena 🥹",
        " 💔💔",
        " Accept chey ra ",
        " Chocolate konistha",
        "Poni Ice Cream",
        "My feelings!! 💔💔",
        "Catch me if you can~ 😏",
        "Okay okay I'll stop... maybe"
    ];

    let phraseIndex = 0;
    let isMoving = false;

    // ─── YES ────────────────────────────────────────
    yesBtn.addEventListener('click', () => {
        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';
        escapeMsg.classList.remove('show');

        // Hide the heading with fade-out
        if (heading) {
            heading.style.transition = 'opacity 1s ease';
            heading.style.opacity = '0';
            setTimeout(() => {
                heading.style.display = 'none';  // fully remove after fade
            }, 1000);
        }

        response.classList.remove('hidden');
        response.classList.add('show');

        // Play music
        audio.play().catch(err => {
            console.log("Audio play failed:", err);
        });

        // Show floating hearts
        const heartsContainer = document.querySelector('.hearts-container');
        heartsContainer.classList.remove('hidden');
        heartsContainer.classList.add('visible');
    });

    // ─── HELPER: Keep button inside screen ──────────
    function clampPosition(left, top, width, height) {
        const padding = 20;
        const maxLeft = window.innerWidth - width - padding;
        const maxTop  = window.innerHeight - height - padding;
        return {
            left: Math.max(padding, Math.min(left, maxLeft)),
            top:  Math.max(padding, Math.min(top, maxTop))
        };
    }

    // ─── MOVE AWAY WHEN CLOSE ───────────────────────
    function getCatchRadius() {
        return window.innerWidth < 768 ? 120 : 130;
    }

    function escapeFromPoint(x, y) {
        if (isMoving) return;
        isMoving = true;

        const rect = noBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = centerX - x;
        const dy = centerY - y;
        const dist = Math.hypot(dx, dy);

        if (dist < getCatchRadius()) {
            let moveX = dx * 2.0;
            let moveY = dy * 2.0;

            let newLeft = rect.left + moveX;
            let newTop  = rect.top + moveY;

            const clamped = clampPosition(newLeft, newTop, rect.width, rect.height);
            newLeft = clamped.left;
            newTop  = clamped.top;

            noBtn.classList.add('moving');
            noBtn.style.transition = 'left 0.4s ease-out, top 0.4s ease-out';
            noBtn.style.left = newLeft + 'px';
            noBtn.style.top  = newTop + 'px';
            noBtn.style.transform = 'none';

            noBtn.style.animation = 'shake 0.4s, panic 0.4s';
        }

        setTimeout(() => { isMoving = false; }, 450);
    }

    document.addEventListener('mousemove', e => escapeFromPoint(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => {
        if (e.touches?.length) escapeFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // ─── CLICK / TAP ON NO → JUMP + MESSAGE ─────────
    noBtn.addEventListener('click', e => {
        e.preventDefault();
    e.stopPropagation();

    noBtn.classList.add('moving');

    const rect = noBtn.getBoundingClientRect();
    const padding = 60;           // bigger padding to keep away from edges
    const safeMargin = Math.min(window.innerWidth, window.innerHeight) * 0.3;  // ~30% safe zone from center

    // Avoid center area where message appears
    let newLeft, newTop;
    do {
        newLeft = padding + Math.random() * (window.innerWidth - rect.width - padding * 2);
        newTop  = padding + Math.random() * (window.innerHeight - rect.height - padding * 2);
    } while (
        // Avoid center rectangle (message area roughly)
        newLeft > window.innerWidth * 0.35 && newLeft < window.innerWidth * 0.65 &&
        newTop  > window.innerHeight * 0.25 && newTop < window.innerHeight * 0.75
    );

    const clamped = clampPosition(newLeft, newTop, rect.width, rect.height);
    newLeft = clamped.left;
    newTop  = clamped.top;

    noBtn.style.transition = 'left 0.55s ease-out, top 0.55s ease-out';
    noBtn.style.left = newLeft + 'px';
    noBtn.style.top  = newTop + 'px';
    noBtn.style.transform = 'none';

    // Position message above the button
    const msgX = newLeft + rect.width / 2;
    const msgY = newTop - 40;  // higher so it's more visible

    escapeMsg.textContent = escapePhrases[phraseIndex];
    escapeMsg.style.left = msgX + 'px';
    escapeMsg.style.top  = msgY + 'px';
    escapeMsg.style.transform = 'translateX(-50%)';

    escapeMsg.classList.remove('fade-out');
    escapeMsg.classList.add('show');

    // Stay visible 8 seconds → fade out over 1.5 seconds
    setTimeout(() => {
        escapeMsg.classList.add('fade-out');
        setTimeout(() => {
            escapeMsg.classList.remove('show');
        }, 1500);
    }, 8000);

    phraseIndex = (phraseIndex + 1) % escapePhrases.length;

    noBtn.style.animation = 'shake 0.5s';
    });
});
