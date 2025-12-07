/* =========================================
       PRIORITY 4: SCROLL SEQUENCE (Safety Mode)
       ========================================= */
    const scrollContainer = document.getElementById('scroll-sequence-container');
    const scrollCanvas = document.getElementById('scroll-canvas');
    
    if (scrollContainer && scrollCanvas) {
        const context = scrollCanvas.getContext('2d');
        const frameCount = 28; 
        const images = []; 
        const imageSeq = { frame: 0 };
        let imagesLoaded = 0;

        // 1. SETUP CANVAS SIZE
        const resizeCanvas = () => {
            scrollCanvas.width = window.innerWidth;
            scrollCanvas.height = window.innerHeight;
            render(); // Redraw immediately on resize
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Call once immediately

        // 2. THE RENDERER (With Fallback Visuals)
        const render = () => {
            // CLEAR CANVAS
            context.clearRect(0, 0, scrollCanvas.width, scrollCanvas.height);

            // CHECK: Do we have a valid image for this frame?
            if (images[imageSeq.frame] && images[imageSeq.frame].complete && images[imageSeq.frame].naturalWidth !== 0) {
                // SUCCESS: Draw the Image
                const img = images[imageSeq.frame];
                const hRatio = scrollCanvas.width / img.width;
                const vRatio = scrollCanvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (scrollCanvas.width - img.width * ratio) / 2;
                const centerShift_y = (scrollCanvas.height - img.height * ratio) / 2;
                
                context.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            } else {
                // FAILURE/LOADING: Draw a "Placeholder" so the space isn't blank
                
                // Draw a rectangle in the center
                const rectW = 600;
                const rectH = 300;
                context.fillStyle = "rgba(128, 128, 128, 0.1)"; // Light grey box
                context.fillRect((scrollCanvas.width/2)-(rectW/2), (scrollCanvas.height/2)-(rectH/2), rectW, rectH);
                
                // Draw Text
                context.font = 'bold 40px Segoe UI';
                context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                context.textAlign = 'center';
                
                if (imagesLoaded === 0) {
                    context.fillText("Searching for images...", scrollCanvas.width / 2, scrollCanvas.height / 2);
                    context.font = '20px Segoe UI';
                    context.fillText("Checking: images/sequence/1.jpg", scrollCanvas.width / 2, (scrollCanvas.height / 2) + 50);
                } else {
                    context.fillText("Loading...", scrollCanvas.width / 2, scrollCanvas.height / 2);
                }
            }
        };

        // 3. LOAD IMAGES
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `images/sequence/${i}.jpg`; // Tries to find 1.jpg, 2.jpg...
            
            img.onload = () => {
                imagesLoaded++;
                if (i === 1) render(); // Once frame 1 loads, draw it immediately
            };
            img.onerror = () => {
                console.error(`Missing file: images/sequence/${i}.jpg`);
                render(); // Force render to show error text
            };
            images.push(img);
        }

        // Draw the "Loading" state immediately so it's not blank
        render();

        // 4. SCROLL LISTENER
        window.addEventListener('scroll', () => {
            const rect = scrollContainer.getBoundingClientRect();
            const scrollTop = -rect.top;
            const maxScroll = scrollContainer.offsetHeight - window.innerHeight;
            let scrollFraction = scrollTop / maxScroll;
            if (scrollFraction < 0) scrollFraction = 0;
            if (scrollFraction > 1) scrollFraction = 1;

            const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));
            
            if (imageSeq.frame !== frameIndex) {
                imageSeq.frame = frameIndex;
                requestAnimationFrame(render);
            }
        });
    }
