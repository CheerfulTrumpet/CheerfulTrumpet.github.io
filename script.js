/* ==========================================================================
   1. GLOBAL THEME FUNCTIONS 
   ========================================================================== */
window.toggleThemeMenu = function() {
    const panel = document.getElementById('control-panel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
};

window.changeTheme = function(type, color) {
    const root = document.documentElement;
    if (type === 'accent') {
        root.style.setProperty('--accent-color', color);
        root.style.setProperty('--card-border', color + '20');
    } 
    else if (type === 'secondary') {
        root.style.setProperty('--secondary-color', color);
        if (window.particlesArray) {
            window.particlesArray.forEach(p => p.color = color);
        }
    } 
    else if (type === 'bg') {
        root.style.setProperty('--bg-color', color);
    }
};

/* ==========================================================================
   2. MAIN PAGE LOGIC 
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* --- PRIORITY 1: ANIMATION INIT (AOS) --- */
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, mirror: false });
    }

    /* --- PRIORITY 1.5: THEME NOTIFICATION TOAST --- */
    const toastElement = document.getElementById('themeToast');
    if (toastElement) {
        // Wait 2 seconds, then show the popup
        setTimeout(() => {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }, 2000);
    }

    /* --- PRIORITY 2: CLOCK --- */
    function updateTimeAndGreeting() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        
        const secondsDegrees = ((seconds / 60) * 360);
        const minutesDegrees = ((minutes / 60) * 360) + ((seconds/60)*6);
        const hoursDegrees = ((hours / 12) * 360) + ((minutes/60)*30);

        const sHand = document.getElementById('second-hand');
        const mHand = document.getElementById('minute-hand');
        const hHand = document.getElementById('hour-hand');

        if(sHand) sHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
        if(mHand) mHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
        if(hHand) hHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;

        const displayMin = minutes < 10 ? '0' + minutes : minutes;
        const displayHour = hours % 12 || 12; 
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        const dTime = document.getElementById('digital-time');
        if(dTime) dTime.innerText = `${displayHour}:${displayMin} ${ampm}`;

        const greetingElement = document.getElementById('greeting');
        if(greetingElement) {
            let greetingText = "Welcome";
            if (hours < 12) greetingText = "Good Morning!";
            else if (hours < 18) greetingText = "Good Afternoon!";
            else greetingText = "Good Evening!";
            greetingElement.innerText = greetingText;
        }
    }
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 1000);

    /* --- PRIORITY 3: TYPEWRITER --- */
    const typeElement = document.getElementById("typewriter");
    if (typeElement) {
        const words = ["CS Student.", "Problem Solver.", "C Developer.", "Tech Enthusiast."];
        let wordIndex = 0;
        let timer;

        function typeWriter() {
            const currentWord = words[wordIndex % words.length];
            const fullText = typeElement.innerText;
            const state = typeElement.getAttribute("data-state");

            if (state === "deleting") {
                typeElement.innerText = currentWord.substring(0, fullText.length - 1);
                timer = setTimeout(typeWriter, 50);
                if (typeElement.innerText === "") {
                    typeElement.setAttribute("data-state", "typing");
                    wordIndex++;
                }
            } else {
                typeElement.innerText = currentWord.substring(0, fullText.length + 1);
                timer = setTimeout(typeWriter, 150);
                if (typeElement.innerText === currentWord) {
                    typeElement.setAttribute("data-state", "deleting");
                    clearTimeout(timer);
                    timer = setTimeout(typeWriter, 2000); 
                }
            }
        }
        typeElement.setAttribute("data-state", "typing");
        typeWriter();
    }

    /* --- PRIORITY 4: PARTICLES --- */
    const canvas = document.getElementById("background-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        window.particlesArray = [];

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 1) - 0.5;
                this.directionY = (Math.random() * 1) - 0.5;
                this.size = (Math.random() * 2) + 1;
                const cssColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
                this.color = cssColor || '#bfbfbf'; 
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            window.particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                window.particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < window.particlesArray.length; i++) {
                window.particlesArray[i].update();
            }
            connectParticles();
        }

        function connectParticles() {
            for (let a = 0; a < window.particlesArray.length; a++) {
                for (let b = a; b < window.particlesArray.length; b++) {
                    let distance = ((window.particlesArray[a].x - window.particlesArray[b].x) ** 2)
                                 + ((window.particlesArray[a].y - window.particlesArray[b].y) ** 2);
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        ctx.strokeStyle = window.particlesArray[a].color; 
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(window.particlesArray[a].x, window.particlesArray[a].y);
                        ctx.lineTo(window.particlesArray[b].x, window.particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        window.addEventListener('resize', function() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        });
        initParticles();
        animateParticles();
    }

    /* --- PRIORITY 5: SCROLL SEQUENCE (SMOOTH MOUSE FIX) --- */
    const scrollContainer = document.getElementById('scroll-sequence-container');
    const scrollCanvas = document.getElementById('scroll-canvas');
    
    if (scrollContainer && scrollCanvas) {
        const context = scrollCanvas.getContext('2d');
        const frameCount = 20; 
        const images = []; 
        
        let currentFrame = 0; 
        let targetFrame = 0;  

        const render = (frameIndex) => {
            const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
            context.fillStyle = bgColor;
            context.fillRect(0, 0, scrollCanvas.width, scrollCanvas.height);

            const index = Math.round(frameIndex);

            if (images[index] && images[index].complete) {
                const img = images[index];
                const hRatio = scrollCanvas.width / img.width;
                const vRatio = scrollCanvas.height / img.height;
                const ratio = Math.min(hRatio, vRatio); 
                const centerShift_x = (scrollCanvas.width - img.width * ratio) / 2;
                const centerShift_y = (scrollCanvas.height - img.height * ratio) / 2;
                context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            } 
        };

        const resizeScrollCanvas = () => {
            scrollCanvas.width = window.innerWidth;
            scrollCanvas.height = window.innerHeight;
            render(currentFrame);
        };
        window.addEventListener('resize', resizeScrollCanvas);
        resizeScrollCanvas();

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `images/sequence/${i}-removebg-preview.png`; 
            img.onload = () => { if (i === 1) render(0); };
            images.push(img);
        }

        window.addEventListener('scroll', () => {
            const rect = scrollContainer.getBoundingClientRect();
            const scrollTop = -rect.top;
            const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
            
            let scrollFraction = scrollTop / maxScroll;
            if (scrollFraction < 0) scrollFraction = 0;
            if (scrollFraction > 1) scrollFraction = 1;

            targetFrame = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
        });

        // SMOOTH INTERPOLATION LOOP
        const smoothAnimationLoop = () => {
            const diff = targetFrame - currentFrame;
            
            if (Math.abs(diff) > 0.05) {
                let step = diff * 0.05;

                // Clamp step size to prevent skipping frames on large mouse jumps
                if (step > 0.8) step = 0.8;
                if (step < -0.8) step = -0.8;

                currentFrame += step;
                render(currentFrame);
            }
            requestAnimationFrame(smoothAnimationLoop);
        };
        smoothAnimationLoop();
    }

    /* --- PRIORITY 6: FOOTER QUOTE --- */
    const quoteElement = document.getElementById("philosophy-quote");
    if(quoteElement) {
        const quotes = [
            "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim. - Dijkstra",
            "It is not enough to have a good mind; the main thing is to use it well. - Descartes",
            "Simplicity is the ultimate sophistication. - Da Vinci",
            "Code is like humor. When you have to explain it, it’s bad. - Cory House"
        ];
        quoteElement.innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    }

});
