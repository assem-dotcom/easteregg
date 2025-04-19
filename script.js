const questions = [
    {
        question: "What do Germans call the Easter Bunny?",
        options: [
            "Easter Bunny",
            "Osterhase",
            "Hoppel",
            "Hasenpeter"
        ],
        correct: 1,
        funFact: "The Osterhase tradition started in Germany in the 16th century!",
        emojis: ["🐰", "🥕", "🌸", "🐣", "🥚"]
    },
    {
        question: "What unusual tradition involves Germans decorating trees with Easter eggs?",
        options: [
            "Easter Tree Festival",
            "Spring Egg Tree",
            "Ostereierbaum",
            "Egg Tree Celebration"
        ],
        correct: 2,
        funFact: "The world's largest Easter egg tree has over 10,000 eggs!",
        emojis: ["🌳", "🥚", "🎨", "✨", "🌺"]
    },
    {
        question: "What do Germans traditionally eat on Good Friday?",
        options: [
            "Chocolate",
            "Bread",
            "Potatoes",
            "Fish"
        ],
        correct: 3,
        funFact: "This tradition comes from the Catholic practice of not eating meat on Good Friday.",
        emojis: ["🐟", "🌊", "🍽️", "✝️", "🙏"]
    },
    {
        question: "What's the name of the German Easter bread?",
        options: [
            "Holiday Loaf",
            "Spring Bread",
            "Osterbrot",
            "Easter Cake"
        ],
        correct: 2,
        funFact: "Osterbrot often contains raisins and is shaped like a braid!",
        emojis: ["🥨", "🍞", "🥖", "✨", "🎉"]
    },
    {
        question: "What unusual Easter tradition involves fire?",
        options: [
            "Spring Fire",
            "Osterfeuer",
            "Holiday Flame",
            "Easter Bonfire"
        ],
        correct: 1,
        funFact: "The Osterfeuer tradition symbolizes the end of winter and the coming of spring!",
        emojis: ["🔥", "✨", "🌟", "✝️", "🌸"]
    }
];

let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;  // Track number of correct answers for egg growth
let easterScene;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const resultElement = document.getElementById('result');
const finalMessageElement = document.getElementById('final-message');
const restartButton = document.getElementById('restart');
const funFactElement = document.getElementById('fun-fact');
const easterEgg = document.querySelector('.easter-egg');

function createEmojiBurst(emoji, x, y) {
    const emojiElement = document.createElement('div');
    emojiElement.className = 'emoji-burst';
    emojiElement.textContent = emoji;
    emojiElement.style.left = `${x}px`;
    emojiElement.style.top = `${y}px`;
    
    document.body.appendChild(emojiElement);
    
    setTimeout(() => {
        emojiElement.remove();
    }, 1500);
}

function burstEmojis(emojis, centerX, centerY) {
    emojis.forEach((emoji, index) => {
        setTimeout(() => {
            // Create multiple instances of each emoji at slightly different positions
            for (let i = 0; i < 3; i++) {
                const offsetX = centerX + (Math.random() - 0.5) * 100;
                const offsetY = centerY + (Math.random() - 0.5) * 100;
                createEmojiBurst(emoji, offsetX, offsetY);
            }
        }, index * 100);
    });
}

function updateEggSize() {
    // Remove all previous size classes
    for (let i = 1; i <= 5; i++) {
        easterEgg.classList.remove(`size-${i}`);
    }
    // Add new size class if there are correct answers
    if (correctAnswers > 0) {
        easterEgg.classList.add(`size-${correctAnswers}`);
    }
}

function updateEggExpression(isCorrect) {
    if (isCorrect) {
        easterScene.celebrate();
        correctAnswers++;
    } else {
        easterScene.showSad();
    }
}

function crackEggRevealBunny() {
    // Create particle effect for celebration
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xFFB6C1,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    easterScene.scene.add(particleSystem);
    
    // Animate particles
    const animateParticles = () => {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * 0.1;
            positions[i + 1] += (Math.random() - 0.5) * 0.1;
            positions[i + 2] += (Math.random() - 0.5) * 0.1;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    };
    
    const interval = setInterval(animateParticles, 50);
    setTimeout(() => {
        clearInterval(interval);
        easterScene.scene.remove(particleSystem);
    }, 2000);
}

function initializeScene() {
    try {
        const container = document.getElementById('three-container');
        if (!container) {
            console.error('Three.js container not found');
            return;
        }
        
        easterScene = new EasterScene(container);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (easterScene) {
                easterScene.onWindowResize();
            }
        });
        
        console.log('Scene initialized successfully');
    } catch (error) {
        console.error('Error initializing scene:', error);
    }
}

// Make sure DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeScene();
    startHatching();
    showQuestion();
});

function showQuestion() {
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    funFactElement.classList.add('hidden');
    
    // Reset egg expression but maintain size
    easterEgg.classList.remove('happy', 'sad', 'correct', 'cracking');
    
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', (e) => selectAnswer(index, e));
        optionsElement.appendChild(button);
    });
}

function selectAnswer(index, event) {
    const question = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.disabled = true;
    });
    
    const isCorrect = index === question.correct;
    updateEggExpression(isCorrect);
    
    if (isCorrect) {
        options[index].style.backgroundColor = '#98FB98'; // Light green
        score++;
        
        // Trigger emoji burst from the clicked button's position
        const rect = event.target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        burstEmojis(question.emojis, centerX, centerY);
    } else {
        options[index].style.backgroundColor = '#FFB6C1'; // Light pink for wrong answer
        options[question.correct].style.backgroundColor = '#98FB98'; // Light green for correct answer
    }
    
    // Show fun fact with fade in
    funFactElement.textContent = question.funFact;
    funFactElement.classList.remove('hidden', 'fade-out');
    funFactElement.classList.add('fade-in');
    
    // Move to next question after 5 seconds
    setTimeout(() => {
        // Fade out fun fact
        funFactElement.classList.remove('fade-in');
        funFactElement.classList.add('fade-out');
        
        // Wait for fade out animation to complete
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                showResult();
            }
        }, 800); // Match the fade-out animation duration
    }, 5000); // Increased to 5 seconds for better readability
}

function showResult() {
    questionElement.parentElement.classList.add('hidden');
    resultElement.classList.remove('hidden');
    scoreElement.textContent = score;
    totalElement.textContent = questions.length;
    
    let message = '';
    if (score === questions.length) {
        message = "Wow! You're a German Easter expert! 🐰🥚";
        // Trigger egg hatching
        setTimeout(() => {
            easterScene.hatch();
        }, 500);
    } else if (score >= questions.length / 2) {
        message = "Great job! You know quite a bit about German Easter traditions! 🌸";
        updateEggExpression(true);
    } else {
        message = "Keep learning about German Easter traditions! They're fascinating! 🌟";
        updateEggExpression(false);
    }
    
    finalMessageElement.textContent = message;
}

restartButton.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;  // Reset correct answers counter
    resultElement.classList.add('hidden');
    questionElement.parentElement.classList.remove('hidden');
    // Remove all size classes when restarting
    for (let i = 1; i <= 5; i++) {
        easterEgg.classList.remove(`size-${i}`);
    }
    showQuestion();
});

function startHatching() {
    const easterEgg = document.querySelector('.easter-egg');
    easterEgg.style.display = 'block';
    
    // Start the hatching animation after a short delay
    setTimeout(() => {
        easterEgg.classList.add('hatching');
        
        // Remove the hatching class after animation completes
        setTimeout(() => {
            easterEgg.classList.remove('hatching');
        }, 2000);
    }, 500);
} 