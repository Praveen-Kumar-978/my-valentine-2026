document.addEventListener('DOMContentLoaded', () => {
    const yesBtn       = document.getElementById('yes-btn');
    const noBtn        = document.getElementById('no-btn');
    const response     = document.getElementById('response');
    const typewriterEl = document.getElementById('typewriter-text');
    const escapeMsg    = document.getElementById('escape-message');
    const audio        = document.getElementById('bg-music');

    const escapePhrases = [
        "Oh nooo... 😭",
        "Wait—come back! 🥺",
        "Too fast for me... 💨",
        "Don't leave me hanging! 😢",
        "You're breaking my heart... 💔",
        "Hey! That's not fair! 😤",
        "One more chance please? 🥹",
        "Running away already? 🏃‍♂️",
        "I wasn't ready! 😅",
        "You almost got me... 👀",
        "Why are you so cruel? 😭",
        "My feelings!! 💔💔",
        "Catch me if you can~ 😏",
        "...I'm scared... 😨",
        "Okay okay I'll stop... maybe"
    ];

    let phraseIndex = 0;
    let isMoving = false;

    // ─── YES ────────────────────────────────────────
    yesBtn.addEventListener('click', () => {
        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';
        escapeMsg.classList.remove('show');

        response.classList.remove('hidden');
        response.classList.add('show');

        audio.play().catch(err => {
            console.log("Audio play failed:", err);
        });

        const fullText =
"It's been 5 years since I met you,\n" +
"but I'm still falling for you every single day.\n\n" +
"I'm still fighting against the time that's kept us apart,\n" +
"but I promise you — I'll win this battle one day.\n\n" +
"Until that moment comes,\n" +
"every heartbeat,\n" +
"every second,\n" +
"is spent loving you.\n\n" +
"You're my Yesterday,\n" +
"my Today,\n" +
"my Tomorrow,\n" +
"and everything in between.\n\n" +
"Happy Valentine's Day, my Nishitha 💗❣️";

        typewriterEl.textContent = "";
        let i = 0;
        const speed = 60;

        function typeNext() {
            if (i < fullText.length) {
                typewriterEl.textContent += fullText.charAt(i);
                i++;
                setTimeout(typeNext, speed);
            } else {
                document.querySelector('.cursor').style.display = 'none';
            }
        }
        typeNext();

        // Show envelope after typing roughly finishes
        setTimeout(() => {
            const envelopeWrapper = document.querySelector('.envelope-wrapper');
            if (envelopeWrapper) {
                envelopeWrapper.classList.remove('hidden');
                envelopeWrapper.classList.add('show');
            }
        }, 2800); // ~2.8 seconds — adjust if typing feels too fast/slow

        // Auto-open envelope ~2 seconds after it appears
        setTimeout(() => {
            const envelope = document.getElementById('envelope');
            if (envelope) {
                envelope.classList.add('open');
            }
        }, 5200);
    });

    // Toggle envelope open/close on click/tap (mobile friendly)
    const envelope = document.getElementById('envelope');
    if (envelope) {
        envelope.addEventListener('click', function() {
            this.classList.toggle('open');
        });
    }

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

    // ─── MOVE AWAY WHEN CURSOR/TOUCH CLOSE ──────────
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

    // ─── CLICK / TAP ON NO → JUMP + LONGER MESSAGE ───
    noBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        noBtn.classList.add('moving');

        const rect = noBtn.getBoundingClientRect();
        const padding = 40;

        let newLeft = padding + Math.random() * (window.innerWidth - rect.width - padding * 2);
        let newTop  = padding + Math.random() * (window.innerHeight - rect.height - padding * 2);

        const clamped = clampPosition(newLeft, newTop, rect.width, rect.height);
        newLeft = clamped.left;
        newTop  = clamped.top;

        noBtn.style.transition = 'left 0.55s ease-out, top 0.55s ease-out';
        noBtn.style.left = newLeft + 'px';
        noBtn.style.top = newTop + 'px';
        noBtn.style.transform = 'none';

        const msgX = newLeft + rect.width / 2;
        const msgY = newTop - 20; // a bit higher so it's easier to read

        escapeMsg.textContent = escapePhrases[phraseIndex];
        escapeMsg.style.left = msgX + 'px';
        escapeMsg.style.top  = msgY + 'px';
        escapeMsg.style.transform = 'translateX(-50%)';

        // Show message
        escapeMsg.classList.remove('fade-out');
        escapeMsg.classList.add('show');

        // Stay visible 5 seconds → then fade out over 1.2 seconds
        setTimeout(() => {
            escapeMsg.classList.add('fade-out');
            setTimeout(() => {
                escapeMsg.classList.remove('show');
            }, 1200);
        }, 5000);

        phraseIndex = (phraseIndex + 1) % escapePhrases.length;

        noBtn.style.animation = 'shake 0.5s';
    });
});
