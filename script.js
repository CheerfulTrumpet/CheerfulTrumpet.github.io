      // TYPEWRITER EFFECT LOGIC
      const words = ["CS Student.", "Problem Solver.", "Java Developer.", "Tech Enthusiast."];
      let i = 0;
      let timer;
  
      function typeWriter() {
          const heading = document.getElementById("typewriter");
          const currentWord = words[i % words.length]; // Modulo operator to loop back to start
          const fullText = heading.innerText;
  
          // Check if we are currently typing or deleting?
          // This logic is a simple state machine:
          // If the full word is displayed, wait, then delete.
          // If the word is deleted, switch to next word, then type.
          
          if (heading.getAttribute("data-state") === "deleting") {
              // DELETING
              heading.innerText = currentWord.substring(0, fullText.length - 1);
              timer = setTimeout(typeWriter, 50); // Delete fast (50ms)
              
              if (heading.innerText === "") {
                  heading.setAttribute("data-state", "typing");
                  i++; // Move to next word in array
              }
          } else {
              // TYPING
              heading.innerText = currentWord.substring(0, fullText.length + 1);
              timer = setTimeout(typeWriter, 150); // Type slower (150ms)
              
              if (heading.innerText === currentWord) {
                  heading.setAttribute("data-state", "deleting");
                  // Pause at the end of the word so people can read it
                  clearTimeout(timer);
                  timer = setTimeout(typeWriter, 2000); // Wait 2 seconds
              }
          }
      }
  
      // Initialize the state and start
      document.getElementById("typewriter").setAttribute("data-state", "typing");
      typeWriter();

      function updateTimeAndGreeting() {
              const now = new Date();
              
              // 1. GET TIME PARTS
              const seconds = now.getSeconds();
              const minutes = now.getMinutes();
              const hours = now.getHours();
              
              // 2. CALCULATE DEGREES FOR ROTATION
              const secondsDegrees = ((seconds / 60) * 360);
              const minutesDegrees = ((minutes / 60) * 360) + ((seconds/60)*6); // Add seconds for smooth movement
              const hoursDegrees = ((hours / 12) * 360) + ((minutes/60)*30);   // Add minutes for smooth movement
      
              // 3. APPLY ROTATION TO HANDS
              document.getElementById('second-hand').style.transform = `translateX(-50%) rotate(${secondsDegrees}deg)`;
              document.getElementById('minute-hand').style.transform = `translateX(-50%) rotate(${minutesDegrees}deg)`;
              document.getElementById('hour-hand').style.transform = `translateX(-50%) rotate(${hoursDegrees}deg)`;
      
              // 4. UPDATE DIGITAL CAPTION
              // Format minutes to always have two digits (e.g., 05 instead of 5)
              const displayMin = minutes < 10 ? '0' + minutes : minutes;
              // Optional: Convert to 12-hour format for the caption
              const displayHour = hours % 12 || 12; 
              const ampm = hours >= 12 ? 'PM' : 'AM';
              
              document.getElementById('digital-time').innerText = `${displayHour}:${displayMin} ${ampm}`;
      
              // 5. UPDATE GREETING (Same as before)
              const greetingElement = document.getElementById('greeting');
              let greetingText = "Welcome";
              if (hours < 12) greetingText = "Good Morning!";
              else if (hours < 18) greetingText = "Good Afternoon!";
              else greetingText = "Good Evening!";
              
              if(greetingElement) greetingElement.innerText = greetingText;
          }
          
          // Run immediately and then every second
          updateTimeAndGreeting();
          setInterval(updateTimeAndGreeting, 1000);

/* ------------------------------------------------
   PARTICLE NETWORK ANIMATION
   ------------------------------------------------ */
const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fill screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Create Particle Class (Object Oriented Programming!)
class Particle {
    constructor() {
        // Random position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Random velocity (movement speed)
        // We subtract 0.5 to allow negative movement (left/up)
        this.directionX = (Math.random() * 1) - 0.5;
        this.directionY = (Math.random() * 1) - 0.5;
        // Size and Color
        this.size = (Math.random() * 2) + 1;
        this.color = '#45a29e'; // A subtle teal color
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Method to update particle position
    update() {
        // Check if particle hits the edge of screen, if so, reverse direction
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    // Create density based on screen size (prevent overcrowding on mobile)
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    // Clear the canvas on every frame so particles don't leave trails
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect(); // Draw the lines
}

// Check if particles are close enough to draw a line (Graph Theory!)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            // Pythagorean theorem to find distance
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // If close enough (distance < 140*140)
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = 'rgba(69, 162, 158,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Handle Window Resize (so particles don't stretch)
window.addEventListener('resize', 
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    }
);

// Start the animation
init();
animate();
