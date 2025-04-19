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

// Add at the top with other constants
const lowScoreResponses = JSON.parse(localStorage.getItem('lowScoreResponses') || '[]');

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

// Add sound effect functions
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    sound.currentTime = 0; // Reset sound to start
    
    // Set different volume levels for different sounds
    switch(soundId) {
        case 'clickSound':
            sound.volume = 0.1; // Very quiet for clicks
            break;
        case 'correctSound':
            sound.volume = 0.3; // Moderate volume for correct answers
            break;
        case 'wrongSound':
            sound.volume = 0.2; // Slightly quieter for wrong answers
            break;
        case 'completeSound':
            sound.volume = 0.4; // Slightly louder for completion
            break;
        default:
            sound.volume = 0.3; // Default volume
    }
    
    sound.play().catch(error => console.log("Sound play failed:", error));
}

// Add new function to start the quiz
function startQuiz() {
    playSound('clickSound'); // Play click sound when starting quiz
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-container').classList.remove('hidden');
    showQuestion();
}

// Make sure DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeScene();
    startHatching();
    
    // Make sure quiz container is hidden and start screen is visible
    const quizContainer = document.getElementById('quiz-container');
    const startScreen = document.getElementById('start-screen');
    
    quizContainer.style.display = 'none';
    startScreen.style.display = 'flex';
    
    // Add start button event listener
    document.getElementById('start-button').addEventListener('click', () => {
        // Add fade-out animation to start screen
        startScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
        
        // Start the quiz after fade-out
        setTimeout(() => {
            startScreen.style.display = 'none';
            quizContainer.style.display = 'block';
            quizContainer.style.animation = 'fadeIn 0.5s ease-in forwards';
            showQuestion();
        }, 500);
    });
});

function showQuestion() {
    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    funFactElement.classList.add('hidden');
    
    // Reset egg expression but maintain size
    easterEgg.classList.remove('happy', 'sad', 'correct', 'cracking');
    
    // Clear out all previous options completely
    optionsElement.innerHTML = '';
    
    // Create new options with no color styling
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', (e) => selectAnswer(index, e));
        optionsElement.appendChild(button);
    });
}

function selectAnswer(index, event) {
    playSound('clickSound'); // Play click sound when selecting an answer
    
    const question = questions[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.disabled = true;
    });
    
    if (index === question.correct) {
        playSound('correctSound'); // Play correct answer sound
        event.target.classList.add('correct');
        event.target.style.backgroundColor = '#98FB98'; // Fallback green color
        event.target.style.borderColor = '#4CAF50'; // Fallback border color
        score++;
        correctAnswers++;
        updateEggExpression(true);
        burstEmojis(question.emojis, event.clientX, event.clientY);
    } else {
        playSound('wrongSound'); // Play wrong answer sound
        event.target.classList.add('wrong');
        event.target.style.backgroundColor = '#FFB6C1'; // Fallback pink color
        event.target.style.borderColor = '#FF6B6B'; // Fallback border color
        options[question.correct].classList.add('correct');
        options[question.correct].style.backgroundColor = '#98FB98'; // Fallback green color
        options[question.correct].style.borderColor = '#4CAF50'; // Fallback border color
        updateEggExpression(false);
    }
    
    funFactElement.textContent = question.funFact;
    funFactElement.classList.remove('hidden');
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            showQuestion();
        } else {
            playSound('completeSound'); // Play completion sound
            showResult();
        }
    }, 5000);
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
        // For low scores (0-2), show uncomfortable follow-up
        if (score <= 2) {
            const timestamp = new Date().toISOString();
            const response = { score, timestamp };
            lowScoreResponses.push(response);
            localStorage.setItem('lowScoreResponses', JSON.stringify(lowScoreResponses));
            
            message = `Oh... only ${score} out of ${questions.length}? That's... interesting. 🤨`;
            
            // Add uncomfortable follow-up container
            const followUpContainer = document.createElement('div');
            followUpContainer.className = 'follow-up-container';
            followUpContainer.innerHTML = `
                <p class="uncomfortable-text">Would you like to explain why you performed so... poorly? 📝</p>
                <textarea id="explanation" placeholder="Please explain your performance..." rows="3"></textarea>
                <div class="response-stats">
                    <p>You're the <strong>${lowScoreResponses.length}th person</strong> to score this low... 📊</p>
                    <p class="typing-time">Time spent explaining: <span id="typing-time">0</span> seconds</p>
                </div>
                <button id="submit-explanation" class="button">Submit Explanation</button>
            `;
            
            finalMessageElement.appendChild(followUpContainer);
            
            // Add typing time counter
            const textarea = followUpContainer.querySelector('#explanation');
            const typingTimeSpan = followUpContainer.querySelector('#typing-time');
            let startTypingTime = null;
            let typingInterval;
            
            textarea.addEventListener('focus', () => {
                if (!startTypingTime) {
                    startTypingTime = new Date();
                    typingInterval = setInterval(() => {
                        const seconds = Math.round((new Date() - startTypingTime) / 1000);
                        typingTimeSpan.textContent = seconds;
                        // Make it more uncomfortable after 30 seconds
                        if (seconds > 30) {
                            typingTimeSpan.style.color = 'red';
                            textarea.style.backgroundColor = '#fff0f0';
                        }
                    }, 1000);
                }
            });
            
            // Handle explanation submission
            const submitButton = followUpContainer.querySelector('#submit-explanation');
            submitButton.addEventListener('click', () => {
                const explanation = textarea.value.trim();
                if (explanation) {
                    response.explanation = explanation;
                    response.typingTime = parseInt(typingTimeSpan.textContent);
                    localStorage.setItem('lowScoreResponses', JSON.stringify(lowScoreResponses));
                    
                    // Show a final uncomfortable message
                    followUpContainer.innerHTML = `
                        <p class="final-message">Thank you for your... candid response. We'll keep it for our records. 🗄️</p>
                        <p class="stats-message">You spent ${response.typingTime} seconds explaining yourself. That's... thorough. 🤔</p>
                    `;
                } else {
                    textarea.style.borderColor = 'red';
                    textarea.placeholder = "We really need your explanation...";
                }
            });
        } else {
            message = "Keep learning about German Easter traditions! They're fascinating! 🌟";
        }
        updateEggExpression(false);
    }
    
    if (typeof message === 'string') {
        finalMessageElement.textContent = message;
    }
}

// Modify restart button to show start screen
restartButton.addEventListener('click', () => {
    playSound('clickSound'); // Play click sound when restarting
    currentQuestion = 0;
    score = 0;
    correctAnswers = 0;
    document.getElementById('result').classList.add('hidden');
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