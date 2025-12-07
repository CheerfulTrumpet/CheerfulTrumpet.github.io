/* ==========================================================================
   1. GLOBAL THEME FUNCTIONS 
   (These must be outside the DOMContentLoaded listener to work with HTML buttons)
   ========================================================================== */

// Toggle the settings panel visibility
window.toggleThemeMenu = function() {
    const panel = document.getElementById('control-panel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
};

// Handle real-time color changes
window.changeTheme = function(type, color) {
    const root = document.documentElement;
    if (type === 'accent') {
        root.style.setProperty('--accent-color', color);
        // Create a faint version of the accent for borders
        root.style.setProperty('--card-border', color + '20');
    } 
    else if (type === 'secondary') {
        root.style.setProperty('--secondary-color', color);
        // Update particles immediately if they exist
        if (window.particlesArray) {
            window.particlesArray.forEach(p => p.color = color);
        }
    } 
    else if (type === 'bg') {
        root.style.setProperty('--bg-color', color);
    }
};


/* ==========================================================================
   2. MAIN PAGE LOGIC (Everything else happens here)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* --- PRIORITY 1: INITIALIZE ANIMATIONS (AOS) --- */
    // This effectively "turns on" the visibility of your elements
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false
        });
    }

    /* --- PRIORITY 2: CLOCK & GREETING --- */
    function updateTimeAndGreeting() {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        
        // Calculate angles
        const secondsDegrees = ((seconds / 60) * 360);
        const minutesDegrees = ((minutes / 60) * 360) + ((seconds/60)*6);
        const hoursDegrees = ((hours / 12) * 360) + ((minutes/60)*30);

        // Rotate Hands
        const sHand = document.getElementById('second-hand');
        const mHand = document.getElementById('minute-hand');
        const hHand = document.getElementById('hour-hand');

        if(sHand) sHand.style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
        if(mHand) mHand.style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
        if(hHand) hHand.style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;

        // Update Digital Text
        const displayMin = minutes < 10 ? '0' + minutes : minutes;
        const displayHour = hours % 12 || 12; 
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const dTime = document.getElementById('digital-time');
        if(dTime) dTime.innerText = `${displayHour}:${displayMin} ${ampm}`;

        // Update Greeting Text based on time of day
        const greetingElement = document.getElementById('greeting');
        if(greetingElement) {
            let greetingText = "Welcome";
            if (hours < 12) greetingText = "Good Morning!";
            else if (hours < 18) greetingText = "Good Afternoon!";
            else greetingText = "Good Evening!";
            greetingElement.innerText = greetingText;
        }
    }
    // Run immediately, then every second
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 1000);


    /* --- PRIORITY 3: TYPEWRITER EFFECT --- */
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
                // Remove a character
                typeElement.innerText = currentWord.substring(0, fullText.length - 1);
                timer = setTimeout(typeWriter, 50);
                
                // If word is gone, switch to typing next word
                if (typeElement.innerText === "") {
                    typeElement.setAttribute("data-state", "typing");
                    wordIndex++;
                }
            } else {
                // Add a character
                typeElement.innerText = currentWord.substring(0, fullText.length + 1);
                timer = setTimeout(typeWriter, 150);
                
                // If word is complete, wait then delete
                if (typeElement.innerText === currentWord) {
                    typeElement.setAttribute("data-state", "deleting");
                    clearTimeout(timer);
                    timer = setTimeout(typeWriter, 2000); // Pause at end of word
                }
            }
        }
        typeElement.setAttribute("data-state", "typing");
        typeWriter();
    }


    /* --- PRIORITY 4: PARTICLE BACKGROUND SYSTEM --- */
    const canvas = document.getElementById("background-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        // Set canvas size
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
                
                // Get color from CSS variable
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
                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            window.particlesArray = [];
            // Calculate number of particles based on screen area
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
                    // Pythagorean theorem for distance
                    let distance = ((window.particlesArray[a].x - window.particlesArray[b].x) ** 2)
                                 + ((window.particlesArray[a].y - window.particlesArray[b].y) ** 2);
                    
                    // If close enough, draw a line
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

        // Handle Window Resize
        window.addEventListener('resize', function() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        });

        initParticles();
        animateParticles();
    }


    /* --- PRIORITY 5: SCROLL SEQUENCE ANIMATION --- */
    const scrollContainer = document.getElementById('scroll-sequence-container');
    const scrollCanvas = document.getElementById('scroll-canvas');
    
    if (scrollContainer && scrollCanvas) {
        const context = scrollCanvas.getContext('2d');
        const frameCount = 20; // Number of images you have
        const images = []; 
        const imageSeq = { frame: 0 };
        let imagesLoaded = 0;

        // Render Function: Draws the current frame to the canvas
        const render = () => {
            // Fill background
            const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
            context.fillStyle = bgColor;
            context.fillRect(0, 0, scrollCanvas.width, scrollCanvas.height);

            let img = null;
            
            // Safety check: Does image exist and is it loaded?
            if (images[imageSeq.frame] && images[imageSeq.frame].complete && images[imageSeq.frame].naturalWidth !== 0) {
                img = images[imageSeq.frame];
                
                // Calculate "Contain" fit
                const hRatio = scrollCanvas.width / img.width;
                const vRatio = scrollCanvas.height / img.height;
                const ratio = Math.min(hRatio, vRatio); 
                
                const centerShift_x = (scrollCanvas.width - img.width * ratio) / 2;
                const centerShift_y = (scrollCanvas.height - img.height * ratio) / 2;
                
                context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            } 
            else {
                // Fallback text if loading or missing
                context.font = 'bold 30px Segoe UI';
                context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                context.textAlign = 'center';
                context.fillText("Loading Sequence...", scrollCanvas.width / 2, scrollCanvas.height / 2);
            }
        };

        // Resize Listener
        const resizeScrollCanvas = () => {
            scrollCanvas.width = window.innerWidth;
            scrollCanvas.height = window.innerHeight;
            render();
        };
        window.addEventListener('resize', resizeScrollCanvas);
        resizeScrollCanvas();

        // Load Images
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            // Path to your images
            img.src = `images/sequence/${i}-removebg-preview.png`; 
            
            img.onload = () => {
                imagesLoaded++;
                if (i === 1) render(); // Draw first frame immediately
            };
            img.onerror = () => { 
                console.log("Missing file: " + img.src); 
            };
            images.push(img);
        }

        render();

        // Scroll Listener
        window.addEventListener('scroll', () => {
            const rect = scrollContainer.getBoundingClientRect();
            // Calculate how far we are through the section
            const scrollTop = -rect.top;
            const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
            
            let scrollFraction = scrollTop / maxScroll;
            // Clamp value between 0 and 1
            if (scrollFraction < 0) scrollFraction = 0;
            if (scrollFraction > 1) scrollFraction = 1;

            // Map scroll percentage to frame number
            const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
            
            if (imageSeq.frame !== frameIndex) {
                imageSeq.frame = frameIndex;
                requestAnimationFrame(render);
            }
        });
    }


    /* --- PRIORITY 6: RANDOM FOOTER QUOTE --- */
    const quoteElement = document.getElementById("philosophy-quote");
    if(quoteElement) {
        const quotes = [
            "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim. - Dijkstra",
            "It is not enough to have a good mind; the main thing is to use it well. - Descartes",
            "Simplicity is the ultimate sophistication. - Da Vinci",
            "Code is like humor. When you have to explain it, it’s bad. - Cory House",
            "First, solve the problem. Then, write the code. - John Johnson"
        ];
        quoteElement.innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    }

}); // <--- END OF DOMCONTENTLOADED
