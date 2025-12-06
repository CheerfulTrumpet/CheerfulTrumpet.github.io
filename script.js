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
