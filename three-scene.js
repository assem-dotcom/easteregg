class EasterScene {
    constructor(container) {
        try {
            console.log('Initializing Three.js scene...');
            
            if (!container) {
                throw new Error('Container element not found');
            }
            
            if (!THREE) {
                throw new Error('Three.js not loaded');
            }
            
            // Setup scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xffffff);
            
            // Setup camera
            this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.z = 5;
            
            // Setup renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(this.renderer.domElement);
            
            // Add lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            this.scene.add(directionalLight);
            
            // Create egg-shaped geometry
            const eggGeometry = new THREE.SphereGeometry(1, 32, 32);
            eggGeometry.scale(1, 1.5, 1);
            
            const material = new THREE.MeshPhongMaterial({
                color: 0xffe0b2,
                specular: 0x050505,
                shininess: 100,
                transparent: true,
                opacity: 0.7 // Make egg slightly transparent
            });
            
            this.egg = new THREE.Mesh(eggGeometry, material);
            this.scene.add(this.egg);
            
            // Create bunny
            this.createBunny();
            
            // Add controls with disabled zoom
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = false;
            this.controls.minDistance = 5;
            this.controls.maxDistance = 5;
            
            // Initialize growth state
            this.currentGrowth = 1;
            this.maxGrowth = 3.0; // Reduced max growth for better readability
            this.growthStep = (this.maxGrowth - 1) / 5;
            
            // Start animation
            this.animate();
            
            console.log('Three.js scene initialized successfully');
        } catch (error) {
            console.error('Error initializing Three.js scene:', error);
            const fallbackEgg = document.querySelector('.easter-egg');
            if (fallbackEgg) {
                fallbackEgg.style.display = 'block';
            }
        }
    }
    
    createBunny() {
        // Create a more detailed and cute bunny
        const bunnyGroup = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bunnyGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const head = new THREE.Mesh(headGeometry, bodyMaterial);
        head.position.y = 0.5;
        bunnyGroup.add(head);
        
        // Ears
        const earGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
        const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
        leftEar.position.set(-0.2, 0.8, 0);
        leftEar.rotation.z = Math.PI / 6;
        bunnyGroup.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
        rightEar.position.set(0.2, 0.8, 0);
        rightEar.rotation.z = -Math.PI / 6;
        bunnyGroup.add(rightEar);
        
        // Inner ears
        const innerEarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8);
        const innerEarMaterial = new THREE.MeshPhongMaterial({ color: 0xFFB6C1 });
        const leftInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        leftInnerEar.position.set(-0.2, 0.8, 0.01);
        leftInnerEar.rotation.z = Math.PI / 6;
        bunnyGroup.add(leftInnerEar);
        
        const rightInnerEar = new THREE.Mesh(innerEarGeometry, innerEarMaterial);
        rightInnerEar.position.set(0.2, 0.8, 0.01);
        rightInnerEar.rotation.z = -Math.PI / 6;
        bunnyGroup.add(rightInnerEar);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.5, 0.25);
        bunnyGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.5, 0.25);
        bunnyGroup.add(rightEye);
        
        // Nose
        const noseGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const noseMaterial = new THREE.MeshPhongMaterial({ color: 0xFFB6C1 });
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(0, 0.4, 0.3);
        bunnyGroup.add(nose);
        
        // Cheeks
        const cheekGeometry = new THREE.SphereGeometry(0.04, 8, 8);
        const cheekMaterial = new THREE.MeshPhongMaterial({ color: 0xFFB6C1 });
        
        const leftCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
        leftCheek.position.set(-0.15, 0.35, 0.25);
        bunnyGroup.add(leftCheek);
        
        const rightCheek = new THREE.Mesh(cheekGeometry, cheekMaterial);
        rightCheek.position.set(0.15, 0.35, 0.25);
        bunnyGroup.add(rightCheek);
        
        this.bunny = bunnyGroup;
        this.bunny.visible = false;
        this.scene.add(this.bunny);
    }
    
    animate() {
        try {
            requestAnimationFrame(() => this.animate());
            
            // Rotate egg
            if (this.egg) {
                this.egg.rotation.y += 0.005;
            }
            
            // Rotate bunny if visible
            if (this.bunny && this.bunny.visible) {
                this.bunny.rotation.y += 0.01;
            }
            
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Error in animation loop:', error);
        }
    }
    
    celebrate() {
        try {
            if (this.egg) {
                // Increase permanent size with a bounce effect
                this.currentGrowth += this.growthStep;
                const targetScale = this.currentGrowth;
                
                // Create bounce animation
                const bounceAnimation = () => {
                    const currentScale = this.egg.scale.x;
                    const newScale = currentScale + (targetScale - currentScale) * 0.1;
                    this.egg.scale.set(newScale, newScale, newScale);
                    
                    if (Math.abs(newScale - targetScale) > 0.01) {
                        requestAnimationFrame(bounceAnimation);
                    }
                };
                
                bounceAnimation();
                
                // Add temporary celebration effect
                const originalScale = this.egg.scale.clone();
                this.egg.scale.multiplyScalar(1.3); // Reduced bounce effect
                setTimeout(() => {
                    this.egg.scale.copy(originalScale);
                }, 300);
            }
        } catch (error) {
            console.error('Error in celebrate animation:', error);
        }
    }
    
    showSad() {
        try {
            if (this.egg) {
                const originalRotation = this.egg.rotation.clone();
                this.egg.rotation.z = Math.PI / 12;
                setTimeout(() => {
                    this.egg.rotation.copy(originalRotation);
                }, 300);
            }
        } catch (error) {
            console.error('Error in sad animation:', error);
        }
    }
    
    hatch() {
        try {
            if (this.egg && this.bunny) {
                // Create two halves of the egg
                const eggTop = this.egg.clone();
                const eggBottom = this.egg.clone();
                
                // Position the halves
                eggTop.position.y = 0.5;
                eggBottom.position.y = -0.5;
                
                // Add the halves to the scene
                this.scene.add(eggTop);
                this.scene.add(eggBottom);
                
                // Hide the original egg
                this.egg.visible = false;
                
                // Animate the splitting
                const splitAnimation = () => {
                    let progress = 0;
                    const duration = 1000; // 1 second
                    const startTime = Date.now();
                    
                    const animate = () => {
                        const currentTime = Date.now();
                        progress = (currentTime - startTime) / duration;
                        
                        if (progress < 1) {
                            // Rotate the halves outward
                            eggTop.rotation.x = Math.PI * 0.5 * progress;
                            eggBottom.rotation.x = -Math.PI * 0.5 * progress;
                            
                            // Move the halves apart
                            eggTop.position.y = 0.5 + progress;
                            eggBottom.position.y = -0.5 - progress;
                            
                            requestAnimationFrame(animate);
                        } else {
                            // Show the bunny after the egg splits
                            this.showBunny();
                            
                            // Remove the egg halves after a delay
                            setTimeout(() => {
                                this.scene.remove(eggTop);
                                this.scene.remove(eggBottom);
                            }, 1000);
                        }
                    };
                    
                    animate();
                };
                
                splitAnimation();
            }
        } catch (error) {
            console.error('Error in hatching animation:', error);
        }
    }
    
    showBunny() {
        try {
            if (this.bunny) {
                this.bunny.visible = true;
                this.bunny.position.copy(this.egg.position);
                this.bunny.scale.set(0.1, 0.1, 0.1);
                
                // Animate bunny appearance with bounce and rotation
                const bunnyAnimation = () => {
                    const currentScale = this.bunny.scale.x;
                    const targetScale = 1.5; // Larger bunny
                    const newScale = currentScale + (targetScale - currentScale) * 0.1;
                    
                    this.bunny.scale.set(newScale, newScale, newScale);
                    
                    if (Math.abs(newScale - targetScale) > 0.01) {
                        requestAnimationFrame(bunnyAnimation);
                    }
                };
                
                bunnyAnimation();
            }
        } catch (error) {
            console.error('Error in showing bunny:', error);
        }
    }
    
    onWindowResize() {
        try {
            const container = this.renderer.domElement.parentElement;
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
        } catch (error) {
            console.error('Error handling window resize:', error);
        }
    }
} 