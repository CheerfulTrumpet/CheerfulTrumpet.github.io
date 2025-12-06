/* ------------------------------------------------
   WAIT FOR PAGE TO LOAD
   ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------
       THEME SWITCHER LOGIC
       ------------------------------------------------ */
    const themes = [
        {   // 1. CYAN (Default)
            '--bg-color': '#0b0c10',
            '--card-bg': 'rgba(31, 40, 51, 0.8)',
            '--accent-color': '#66fcf1',
            '--secondary-color': '#45a29e',
            '--card-border': 'rgba(102, 252, 241, 0.1)'
        },
        {   // 2. NEON GREEN (Matrix)
            '--bg-color': '#000000',
            '--card-bg': 'rgba(20, 50, 20, 0.8)',
            '--accent-color': '#00ff41',
            '--secondary-color': '#008f11',
            '--card-border': 'rgba(0, 255, 65, 0.1)'
        },
        {   // 3. RETRO PURPLE (Synthwave)
            '--bg-color': '#1a0b2e',
            '--card-bg': 'rgba(40, 20, 60, 0.8)',
            '--accent-color': '#d16eff',
            '--secondary-color': '#9b26b6',
            '--card-border': 'rgba(209, 110, 255, 0.1)'
        },
        {   // 4. BLAZING ORANGE (Fire)
            '--bg-color': '#1a100b',
            '--card-bg': 'rgba(60, 30, 20, 0.8)',
            '--accent-color': '#ff7b00',
            '--secondary-color': '#b33b00',
            '--card-border': 'rgba(255, 123, 0, 0.1)'
        }
    ];

    let currentThemeIndex = 0;
    const themeButton = document.getElementById('theme-toggle');

    // ERROR CHECK: Does the button actually exist?
    if (themeButton) {
        themeButton.addEventListener('click', () => {
            // Cycle to next theme
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];

            // Apply Variables
            const root = document.documentElement;
            root.style.setProperty('--bg-color', newTheme['--bg-color']);
            root.style.setProperty('--card-bg', newTheme['--card-bg']);
            root.style.setProperty('--accent-color', newTheme['--accent-color']);
            root.style.setProperty('--secondary-color', newTheme['--secondary-color']);
            root.style.setProperty('--card-border', newTheme['--card-border']);

            // Update particles immediately
            if(particlesArray) {
                particlesArray.forEach(p => p.color = newTheme['--secondary-color']);
            }
        });
    } else {
        console.error("Theme button not found! Check your HTML ID.");
    }


    /* ------------------------------------------------
       PARTICLE NETWORK ANIMATION
       ------------------------------------------------ */
    const canvas = document.getElementById("background-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        // Resize canvas to fill parent (Hero Section)
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        let particlesArray;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 1) - 0.5;
                this.directionY = (Math.random() * 1) - 0.5;
                this.size = (Math.random() * 2) + 1;
                
                // Grab color safely
                const cssColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
                this.color = cssColor || '#45a29e'; // Fallback if variable is missing
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
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width/7) * (canvas.height/7)) {
                        opacityValue = 1 - (distance/20000);
                        ctx.strokeStyle = particlesArray[a].color; 
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
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


    /* ------------------------------------------------
       TYPEWRITER & CLOCK LOGIC
       ------------------------------------------------ */
    
    // Typewriter
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

    // Clock
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

}); // End DOMContentLoaded
