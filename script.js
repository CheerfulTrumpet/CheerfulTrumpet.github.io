/* ------------------------------------------------
   1. GLOBAL THEME FUNCTIONS (Called from HTML)
   ------------------------------------------------ */

// Toggle the Menu Open/Close
window.toggleThemeMenu = function() {
    const panel = document.getElementById('control-panel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
};

// Handle Color Changes from the inputs
window.changeTheme = function(type, color) {
    const root = document.documentElement;
    
    if (type === 'accent') {
        root.style.setProperty('--accent-color', color);
        root.style.setProperty('--card-border', color + '20');
    } 
    else if (type === 'secondary') {
        root.style.setProperty('--secondary-color', color);
        // Force particles to update immediately
        if (window.particlesArray) {
            window.particlesArray.forEach(p => p.color = color);
        }
    } 
    else if (type === 'bg') {
        root.style.setProperty('--bg-color', color);
    }
};

/* ------------------------------------------------
   2. PAGE LOAD LOGIC
   ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Animations Library
    if(typeof AOS !== 'undefined') {
        AOS.init();
    }

    /* --- PARTICLE NETWORK --- */
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
                // Grab color from CSS
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

        function init() {
            window.particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                window.particlesArray.push(new Particle());
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < window.particlesArray.length; i++) {
                window.particlesArray[i].update();
            }
            connect();
        }

        function connect() {
            for (let a = 0; a < window.particlesArray.length; a++) {
                for (let b = a; b < window.particlesArray.length; b++) {
                    let distance = ((window.particlesArray[a].x - window.particlesArray[b].x) * (window.particlesArray[a].x - window.particlesArray[b].x))
                                + ((window.particlesArray[a].y - window.particlesArray[b].y) * (window.particlesArray[a].y - window.particlesArray[b].y));
                    
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        let opacityValue = 1 - (distance/20000);
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
            init();
        });

        init();
        animate();
    }

    /* --- SCROLL SEQUENCE --- */
    const scrollContainer = document.getElementById('scroll-sequence-container');
    const scrollCanvas = document.getElementById('scroll-canvas');
    
    if (scrollContainer && scrollCanvas) {
        const context = scrollCanvas.getContext('2d');
        const frameCount = 28; 
        const images = []; 
        const imageSeq = { frame: 0 };

        // 1. PRELOAD IMAGES
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `images/sequence/${i}.jpg`; // Assumes files are 1.jpg, 2.jpg, etc.
            images.push(img);
        }

        const resizeCanvas = () => {
            scrollCanvas.width = window.innerWidth;
            scrollCanvas.height = window.innerHeight;
            render();
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // 2. RENDER FUNCTION
        const render = () => {
            if (images[imageSeq.frame] && images[imageSeq.frame].complete) {
                const img = images[imageSeq.frame];
                
                const hRatio = scrollCanvas.width / img.width;
                const vRatio = scrollCanvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                
                const centerShift_x = (scrollCanvas.width - img.width * ratio) / 2;
                const centerShift_y = (scrollCanvas.height - img.height * ratio) / 2;

                context.clearRect(0, 0, scrollCanvas.width, scrollCanvas.height);
                context.drawImage(
                    img, 
                    0, 0, img.width, img.height, 
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio 
                );
            } else {
                 // Placeholder for when images are still loading (Frame 0)
                context.font = 'bold 80px Segoe UI';
                context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                context.textAlign = 'center';
                context.fillText(`Loading Frames...`, scrollCanvas.width / 2, scrollCanvas.height / 2);
            }
        };

        images[0].onload = render;

        // 3. SCROLL LISTENER
        window.addEventListener('scroll', () => {
            const rect = scrollContainer.getBoundingClientRect();
            const scrollTop = -rect.top;
            const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
            
            let scrollFraction = scrollTop / maxScroll;
            
            if (scrollFraction < 0) scrollFraction = 0;
            if (scrollFraction > 1) scrollFraction = 1;

            const frameIndex = Math.min(
                frameCount - 1,
                Math.ceil(scrollFraction * frameCount)
            );
            
            if (imageSeq.frame !== frameIndex) {
                imageSeq.frame = frameIndex;
                requestAnimationFrame(render);
            }
        });
    }


    /* --- TYPEWRITER --- */
    const words = ["CS Student.", "Problem Solver.", "C Developer.", "Tech Enthusiast."];
    let i = 0;
    let timer;

    function typeWriter() {
        const heading = document.getElementById("typewriter");
        if (!heading) return;
        const currentWord = words[i % words.length];
        const fullText = heading.innerText;
        if (heading.getAttribute("data-state") === "deleting") {
            heading.innerText = currentWord.substring(0, fullText.length - 1);
            timer = setTimeout(typeWriter, 50);
            if (heading.innerText === "") {
                heading.setAttribute("data-state", "typing");
                i++;
            }
        } else {
            heading.innerText = currentWord.substring(0, fullText.length + 1);
            timer = setTimeout(typeWriter, 150);
            if (heading.innerText === currentWord) {
                heading.setAttribute("data-state", "deleting");
                clearTimeout(timer);
                timer = setTimeout(typeWriter, 2000);
            }
        }
    }
    const twElement = document.getElementById("typewriter");
    if(twElement) {
        twElement.setAttribute("data-state", "typing");
        typeWriter();
    }

    /* --- CLOCK --- */
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
        let greetingText = "Welcome";
        if (hours < 12) greetingText = "Good Morning!";
        else if (hours < 18) greetingText = "Good Afternoon!";
        else greetingText = "Good Evening!";
        if(greetingElement) greetingElement.innerText = greetingText;
    }
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 1000);
    
    /* --- PHILOSOPHY QUOTE --- */
    const quotes = [
        "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim. - Dijkstra",
        "It is not enough to have a good mind; the main thing is to use it well. - Descartes",
        "Simplicity is the ultimate sophistication. - Da Vinci",
        "Code is like humor. When you have to explain it, it’s bad. - Cory House"
    ];
    const quoteElement = document.getElementById("philosophy-quote");
    if(quoteElement) {
        quoteElement.innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    }

});
