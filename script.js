document.addEventListener('DOMContentLoaded', () => {
    const yesBtn       = document.getElementById('yes-btn');
    const noBtn        = document.getElementById('no-btn');
    const response     = document.getElementById('response');
    const typewriterEl = document.getElementById('typewriter-text');
    const escapeMsg    = document.getElementById('escape-message');
    const audio        = document.getElementById('bg-music');

    const escapePhrases = [
        "Sadist",
        "Oye No Enti... 😭",
        "Overaction Cheyaku",
        "Anthena 🥹",
        "My feelings!! 💔💔",
        "Champa Pagulthunddhi !!! 😤",
        "Yes chepthava ledha",
        "Catch me if you can~ 😏",
        "Catch me if you can~ 😏",
        "Okay okay I'll stop... maybe"
    ];

    let phraseIndex = 0;
    let isMoving = false;

    // ─── YES BUTTON ────────────────────────────────────────
    yesBtn.addEventListener('click', () => {
        // Hide buttons
        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';
        escapeMsg.classList.remove('show');

        // Show response container
        response.classList.remove('hidden');
        response.classList.add('show');

        // Start background music
        audio.play().catch(err => {
            console.log("Audio play failed:", err);
        });

        // Typewriter effect
        const fullText = 
"It's still fighting against the time that's kept us apart,\n" +
"but I promise you — I'll win this battle one day.\n\n" +

"Until that moment comes,\n" +
"every heartbeat,\n" +
"every second,\n" +
"is spent loving you.\n\n" +

"Happy Valentine's Day My Nishitha💗❣️";

        typewriterEl.textContent = ""; // clear
        let i = 0;
        const speed = 80; // ms per character

        function typeNext() {
            if (i < fullText.length) {
                typewriterEl.innerHTML += fullText.charAt(i); // use innerHTML for <span>
                i++;
                setTimeout(typeNext, speed);
            } else {
                // Stop cursor blink after typing done
                document.querySelector('.cursor').style.display = 'none';
            }
        }

        typeNext();

        // Show floating hearts
        const heartsContainer = document.querySelector('.hearts-container');
        heartsContainer.classList.remove('hidden');
        heartsContainer.classList.add('visible');

        // Fade in hearts slowly
        setTimeout(() => {
            heartsContainer.style.opacity = '1';
        }, 500);
    });

    // ─── HELPER: Keep button inside screen ──────────
    function clampPosition(left, top, width, height) {
        const padding = 20;
        const maxLeft = window.innerWidth  - width  - padding;
        const maxTop  = window.innerHeight - height - padding;

        return {
            left: Math.max(padding, Math.min(left, maxLeft)),
            top:  Math.max(padding, Math.min(top,  maxTop))
        };
    }

    // ─── MOVE AWAY WHEN CURSOR/TOUCH IS CLOSE ───────
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
            let newTop  = rect.top  + moveY;

            const clamped = clampPosition(newLeft, newTop, rect.width, rect.height);
            newLeft = clamped.left;
            newTop  = clamped.top;

            noBtn.classList.add('moving');
            noBtn.style.transition = 'left 0.4s ease-out, top 0.4s ease-out';
            noBtn.style.left = newLeft + 'px';
            noBtn.style.top  = newTop  + 'px';
            noBtn.style.transform = 'none';

            noBtn.style.animation = 'shake 0.4s, panic 0.4s';
        }

        setTimeout(() => { isMoving = false; }, 450);
    }

    document.addEventListener('mousemove', e => escapeFromPoint(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => {
        if (e.touches?.length) escapeFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    // ─── CLICK / TAP ON NO → JUMP + MESSAGE ───────────────
    noBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        noBtn.classList.add('moving');

        const rect = noBtn.getBoundingClientRect();
        const padding = 40;

        let newLeft = padding + Math.random() * (window.innerWidth  - rect.width  - padding * 2);
        let newTop  = padding + Math.random() * (window.innerHeight - rect.height - padding * 2);

        const clamped = clampPosition(newLeft, newTop, rect.width, rect.height);
        newLeft = clamped.left;
        newTop  = clamped.top;

        noBtn.style.transition = 'left 0.55s ease-out, top 0.55s ease-out';
        noBtn.style.left = newLeft + 'px';
        noBtn.style.top  = newTop  + 'px';
        noBtn.style.transform = 'none';

        // Message
        const msgX = newLeft + rect.width / 2;
        const msgY = newTop - 10;

        escapeMsg.textContent = escapePhrases[phraseIndex];
        escapeMsg.style.left = msgX + 'px';
        escapeMsg.style.top  = msgY + 'px';
        escapeMsg.style.transform = 'translateX(-50%)';

        escapeMsg.classList.remove('fade-out');
        escapeMsg.classList.add('show');

        setTimeout(() => {
            escapeMsg.classList.add('fade-out');
            setTimeout(() => escapeMsg.classList.remove('show'), 600);
        }, 1800);

        phraseIndex = (phraseIndex + 1) % escapePhrases.length;

        noBtn.style.animation = 'shake 0.5s';
    });
});

