// ===== CHRISTMAS FUN HUB - MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎄 Christmas Fun Hub Initialized');
    
    // Initialize all features
    initSnowfall();
    initNavigation();
    initCountdown();
    initChecklist();
    initFunZone();
    initMusicPlayer();
    initSantaAIChat();
    initBackgroundMusic();
    initWelcomePage();
    
    // Set initial page
    const initialPage = window.location.hash.substring(1) || 'landing';
    showPage(initialPage);
});

// ===== WELCOME PAGE INITIALIZATION =====
function initWelcomePage() {
    // Animate greeting text
    const greetingWords = document.querySelectorAll('.greeting-word');
    if (greetingWords.length > 0) {
        greetingWords.forEach((word, index) => {
            word.style.animationDelay = `${index * 0.3}s`;
        });
    }
}

// ===== SNOWFALL ANIMATION =====
function initSnowfall() {
    const canvas = document.getElementById("snow");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes = [];
    const snowflakeCount = Math.min(150, Math.floor(window.innerWidth / 10));

    for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.5,
            wind: Math.random() * 0.5 - 0.25
        });
    }

    function drawSnowflakes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach((flake) => {
            const gradient = ctx.createRadialGradient(
                flake.x, flake.y, 0,
                flake.x, flake.y, flake.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${flake.opacity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${flake.opacity * 0.8})`);
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateSnowflakes() {
        snowflakes.forEach((flake) => {
            flake.y += flake.speed;
            flake.x += Math.sin(Date.now() * 0.001 + flake.y * 0.01) * flake.wind;
            
            if (flake.y > canvas.height) {
                flake.y = 0;
                flake.x = Math.random() * canvas.width;
            }
            if (flake.x > canvas.width) flake.x = 0;
            if (flake.x < 0) flake.x = canvas.width;
        });
    }

    function animate() {
        drawSnowflakes();
        updateSnowflakes();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== BACKGROUND MUSIC MANAGEMENT =====
let bgMusic = null;
let playlistAudio = null;
let isBGMPlaying = true;
let isPlaylistPlaying = false;

function initBackgroundMusic() {
    bgMusic = document.getElementById('background-music');
    playlistAudio = document.getElementById('playlist-audio');
    
    if (!bgMusic) return;
    
    // Set initial volume
    bgMusic.volume = 0.3;
    
    // Try to play background music
    const playBGM = () => {
        if (bgMusic.paused && isBGMPlaying && !isPlaylistPlaying) {
            bgMusic.play().catch(e => {
                console.log('BGM autoplay blocked:', e);
                showNotification('Click anywhere to enable background music!');
            });
        }
    };
    
    // Play on user interaction
    const enableAudio = () => {
        playBGM();
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
    };
    
    // Try to play immediately
    setTimeout(playBGM, 1000);
    
    // Add interaction listeners
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
    
    // Toggle button in footer
    const toggleBtn = document.getElementById('bgm-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (isBGMPlaying) {
                bgMusic.pause();
                isBGMPlaying = false;
                this.innerHTML = '<i class="fas fa-volume-mute"></i> Enable Background Music';
                this.style.background = 'rgba(255, 107, 107, 0.1)';
            } else {
                if (!isPlaylistPlaying) {
                    bgMusic.play();
                }
                isBGMPlaying = true;
                this.innerHTML = '<i class="fas fa-volume-up"></i> Disable Background Music';
                this.style.background = '';
            }
        });
    }
    
    // Monitor playlist audio to pause BGM when playing
    if (playlistAudio) {
        playlistAudio.addEventListener('play', () => {
            isPlaylistPlaying = true;
            if (!bgMusic.paused) {
                bgMusic.pause();
            }
        });
        
        playlistAudio.addEventListener('pause', () => {
            isPlaylistPlaying = false;
            if (isBGMPlaying && bgMusic.paused) {
                bgMusic.play();
            }
        });
        
        playlistAudio.addEventListener('ended', () => {
            isPlaylistPlaying = false;
            if (isBGMPlaying && bgMusic.paused) {
                bgMusic.play();
            }
        });
    }
}

// ===== PAGE NAVIGATION =====
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    // Update fun zone card event listeners
    document.querySelectorAll('.fun-zone-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const pageId = this.getAttribute('onclick')?.match(/showPage\('(.+?)'\)/)?.[1];
            if (pageId) showPage(pageId);
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.location.hash = pageId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Add entrance animation
        targetPage.style.animation = 'fadeIn 0.5s ease';
        setTimeout(() => targetPage.style.animation = '', 500);
    }
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        }
    });
    
    // Pause playlist audio when not on music page
    if (playlistAudio && pageId !== 'music') {
        playlistAudio.pause();
        isPlaylistPlaying = false;
        if (isBGMPlaying) {
            bgMusic.play();
        }
    }
}

// ===== CHRISTMAS COUNTDOWN =====
function initCountdown() {
    const christmas2025 = new Date('December 25, 2025 00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = christmas2025 - now;
        
        if (timeLeft <= 0) {
            document.querySelector('.countdown-banner').innerHTML = `
                <div class="container text-center py-3">
                    <span class="fs-4">🎄 Merry Christmas! 🎄</span>
                </div>
            `;
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ===== CHECKLIST FUNCTIONALITY =====
function initChecklist() {
    const defaultTasks = [
        { id: 1, text: "Buy gifts for family", checked: true },
        { id: 2, text: "Decorate the Christmas tree", checked: false },
        { id: 3, text: "Bake Christmas cookies", checked: false },
        { id: 4, text: "Wrap presents", checked: false },
        { id: 5, text: "Send Christmas cards", checked: false },
        { id: 6, text: "Watch Christmas movies", checked: false },
        { id: 7, text: "Make hot chocolate", checked: false },
        { id: 8, text: "Donate to charity", checked: false },
        { id: 9, text: "Plan Christmas dinner", checked: false },
        { id: 10, text: "Visit Christmas market", checked: false }
    ];

    const checklistContainer = document.querySelector('.checklist-items');
    if (!checklistContainer) return;

    // Load saved tasks or use default
    let tasks = JSON.parse(localStorage.getItem('christmas_checklist')) || defaultTasks;

    function renderChecklist() {
        checklistContainer.innerHTML = '';
        
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `checklist-item ${task.checked ? 'checked' : ''}`;
            taskElement.innerHTML = `
                <input type="checkbox" id="task-${task.id}" ${task.checked ? 'checked' : ''}>
                <label for="task-${task.id}">${task.text}</label>
                <button class="delete-task" onclick="deleteTask(${task.id})" title="Delete task">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            const checkbox = taskElement.querySelector('input');
            checkbox.addEventListener('change', function() {
                task.checked = this.checked;
                taskElement.classList.toggle('checked', this.checked);
                saveTasks();
                updateProgress();
                playCheckSound();
                
                if (tasks.every(t => t.checked)) {
                    celebrateAllTasksComplete();
                }
            });
            
            checklistContainer.appendChild(taskElement);
        });
        
        updateProgress();
    }

    function saveTasks() {
        localStorage.setItem('christmas_checklist', JSON.stringify(tasks));
    }

    function updateProgress() {
        const completed = tasks.filter(task => task.checked).length;
        const total = tasks.length;
        const percentage = (completed / total) * 100;
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
            if (percentage < 30) {
                progressFill.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ff4757 100%)';
            } else if (percentage < 70) {
                progressFill.style.background = 'linear-gradient(90deg, #FFA726 0%, #FF9800 100%)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)';
            }
        }
        if (progressText) progressText.textContent = `${completed} of ${total} tasks completed`;
    }

    window.openAddTaskModal = function() {
        const modal = document.getElementById('addTaskModal');
        if (modal) {
            modal.style.display = 'flex';
            const input = document.getElementById('newTaskInput');
            if (input) {
                input.value = '';
                input.focus();
            }
        }
    };

    window.closeAddTaskModal = function() {
        const modal = document.getElementById('addTaskModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    window.addTaskFromModal = function() {
        const input = document.getElementById('newTaskInput');
        if (input && input.value.trim()) {
            const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
            tasks.push({ id: newId, text: input.value.trim(), checked: false });
            saveTasks();
            renderChecklist();
            closeAddTaskModal();
            showNotification(`Added: ${input.value.trim()}`);
        }
    };

    window.deleteTask = function(id) {
        const task = tasks.find(t => t.id === id);
        if (task && confirm(`Delete "${task.text}"?`)) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderChecklist();
            showNotification('Task deleted');
        }
    };
    
    function celebrateAllTasksComplete() {
        const confettiCount = 50;
        const colors = ['#ff6b6b', '#4ECDC4', '#FFD700', '#4CAF50'];
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    top: -20px;
                    left: ${Math.random() * 100}vw;
                    z-index: 9999;
                    pointer-events: none;
                `;
                document.body.appendChild(confetti);
                
                const animation = confetti.animate([
                    { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
                ], {
                    duration: 2000 + Math.random() * 2000,
                    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
                });
                
                animation.onfinish = () => confetti.remove();
            }, i * 30);
        }
        
        showNotification('🎉 All tasks completed! Merry Christmas!', 'success');
    }

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('addTaskModal');
        if (modal && e.target === modal) {
            closeAddTaskModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAddTaskModal();
        }
    });

    renderChecklist();
}

// ===== FUN ZONE FUNCTIONALITY =====
function initFunZone() {
    // Christmas jokes
    const jokes = [
        {
            question: "What do you call a snowman with a six-pack?",
            answer: "An abdominal snowman! ⛄"
        },
        {
            question: "Why did Santa go to the doctor?",
            answer: "Because he had low elf-esteem! 🧝‍♂️"
        },
        {
            question: "What do you call an elf who sings?",
            answer: "A wrapper! 🎤"
        },
        {
            question: "Why are Christmas trees so bad at sewing?",
            answer: "They always drop their needles! 🎄"
        }
    ];

    // Christmas quotes
    const quotes = [
        { text: "Christmas isn't a season. It's a feeling.", author: "Edna Ferber" },
        { text: "The best of all gifts around any Christmas tree: the presence of a happy family all wrapped up in each other.", author: "Burton Hillis" },
        { text: "Christmas waves a magic wand over this world, and behold, everything is softer and more beautiful.", author: "Norman Vincent Peale" },
        { text: "Gifts of time and love are surely the basic ingredients of a truly merry Christmas.", author: "Peg Bracken" }
    ];

    // Christmas trivia questions
    const triviaQuestions = [
        {
            question: "In what city was Jesus born?",
            options: ["Jerusalem", "Bethlehem", "Nazareth", "Jericho"],
            correct: 1
        },
        {
            question: "What is the name of the main character in 'A Christmas Carol'?",
            options: ["Bob Cratchit", "Ebenezer Scrooge", "Tiny Tim", "Jacob Marley"],
            correct: 1
        },
        {
            question: "Which reindeer has a red nose?",
            options: ["Dasher", "Dancer", "Rudolph", "Prancer"],
            correct: 2
        },
        {
            question: "What do people traditionally put on top of a Christmas tree?",
            options: ["A star", "An angel", "Both A and B", "A snowflake"],
            correct: 2
        }
    ];

    let currentJokeIndex = 0;
    let currentQuoteIndex = 0;
    let currentTriviaIndex = 0;

    // Joke functionality
    const jokeRevealBtn = document.getElementById('jokeRevealBtn');
    const jokeQuestion = document.getElementById('jokeQuestion');
    const jokeAnswer = document.getElementById('jokeAnswer');

    function updateJoke() {
        if (jokeQuestion && jokeAnswer) {
            const joke = jokes[currentJokeIndex];
            jokeQuestion.textContent = joke.question;
            jokeAnswer.textContent = joke.answer;
            jokeAnswer.style.display = 'none';
        }
    }

    if (jokeRevealBtn) {
        jokeRevealBtn.addEventListener('click', function() {
            if (jokeAnswer.style.display === 'none' || jokeAnswer.style.display === '') {
                jokeAnswer.style.display = 'block';
                this.innerHTML = 'Next Joke <span class="arrow">→</span>';
            } else {
                currentJokeIndex = (currentJokeIndex + 1) % jokes.length;
                updateJoke();
                jokeAnswer.style.display = 'none';
                this.innerHTML = 'Click to reveal joke <span class="arrow">→</span>';
            }
        });
    }

    // Quote functionality
    window.nextQuote = function() {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        const quoteDisplay = document.getElementById('quoteDisplay');
        if (quoteDisplay) {
            const quote = quotes[currentQuoteIndex];
            quoteDisplay.innerHTML = `
                <p class="quote-text">"${quote.text}"</p>
                <p class="quote-author">- ${quote.author}</p>
            `;
            quoteDisplay.style.animation = 'fadeIn 0.5s ease';
            setTimeout(() => quoteDisplay.style.animation = '', 500);
        }
    };

    // Trivia functionality
    window.nextTrivia = function() {
        currentTriviaIndex = (currentTriviaIndex + 1) % triviaQuestions.length;
        const trivia = triviaQuestions[currentTriviaIndex];
        const triviaQuestion = document.getElementById('triviaQuestion');
        const triviaOptions = document.querySelector('.trivia-options');
        const triviaFeedback = document.getElementById('triviaFeedback');
        
        if (triviaQuestion && triviaOptions && triviaFeedback) {
            triviaQuestion.textContent = trivia.question;
            triviaFeedback.style.display = 'none';
            
            triviaOptions.innerHTML = '';
            trivia.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'trivia-option';
                button.textContent = option;
                button.dataset.correct = index === trivia.correct ? 'true' : 'false';
                
                button.addEventListener('click', function() {
                    const allButtons = triviaOptions.querySelectorAll('.trivia-option');
                    allButtons.forEach(btn => {
                        btn.disabled = true;
                        if (btn.dataset.correct === 'true') {
                            btn.classList.add('correct');
                        } else if (btn === this) {
                            btn.classList.add('incorrect');
                        }
                    });
                    
                    triviaFeedback.textContent = index === trivia.correct 
                        ? '🎉 Correct! Well done!' 
                        : '❌ Not quite right! Try the next question.';
                    triviaFeedback.style.display = 'block';
                    triviaFeedback.style.color = index === trivia.correct ? '#4CAF50' : '#F44336';
                });
                
                triviaOptions.appendChild(button);
            });
        }
    };

    // Memory Game functionality
    const memoryCards = ['🎅', '🎄', '🎁', '⛄', '🦌', '🔔', '🌟', '❄️'];
    let memoryGameCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let memoryGameActive = false;

    window.startMemoryGame = function() {
        const memoryGrid = document.getElementById('memoryGame');
        if (!memoryGrid) return;
        
        // Reset game
        memoryGameCards = [...memoryCards, ...memoryCards].sort(() => Math.random() - 0.5);
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        memoryGameActive = true;
        
        // Update UI
        document.getElementById('memoryScore').textContent = `Matches: ${matchedPairs}/${memoryCards.length}`;
        document.getElementById('memoryMoves').textContent = `Moves: ${moves}`;
        
        // Create cards
        memoryGrid.innerHTML = '';
        memoryGameCards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.textContent = '🎄'; // Back of card
            
            card.addEventListener('click', () => flipCard(card));
            memoryGrid.appendChild(card);
        });
    };

    function flipCard(card) {
        if (!memoryGameActive || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.textContent = card.dataset.emoji;
        card.classList.add('flipped');
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('memoryMoves').textContent = `Moves: ${moves}`;
            
            const [card1, card2] = flippedCards;
            if (card1.dataset.emoji === card2.dataset.emoji) {
                // Match found
                setTimeout(() => {
                    card1.classList.add('matched');
                    card2.classList.add('matched');
                    flippedCards = [];
                    matchedPairs++;
                    document.getElementById('memoryScore').textContent = `Matches: ${matchedPairs}/${memoryCards.length}`;
                    
                    if (matchedPairs === memoryCards.length) {
                        memoryGameActive = false;
                        setTimeout(() => {
                            showNotification('🎉 You won! All matches found!', 'success');
                        }, 500);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    card1.textContent = '🎄';
                    card2.textContent = '🎄';
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1000);
            }
        }
    }

    // Initialize games
    updateJoke();
    nextTrivia();
    startMemoryGame();

    // Daily joke functions
    window.revealDailyJoke = function() {
        const jokeAnswer = document.querySelector('#dailyJoke .joke-answer');
        if (jokeAnswer) {
            jokeAnswer.style.display = 'block';
        }
    };
    
    window.nextDailyJoke = function() {
        const dailyJoke = document.getElementById('dailyJoke');
        if (dailyJoke) {
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            dailyJoke.innerHTML = `
                <p class="joke-question fs-5">${randomJoke.question}</p>
                <p class="joke-answer" style="display: none; margin-top: 15px;">${randomJoke.answer}</p>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn-primary" onclick="revealDailyJoke()">
                        <i class="fas fa-gift me-2"></i>Reveal Answer
                    </button>
                    <button class="btn-outline" onclick="nextDailyJoke()">
                        <i class="fas fa-random me-2"></i>Another Joke
                    </button>
                </div>
            `;
        }
    };
}

// ===== MUSIC PLAYER FUNCTIONALITY =====
function initMusicPlayer() {
    const playlistAudio = document.getElementById('playlist-audio');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeControl = document.getElementById('volume');
    const volumeIcon = document.getElementById('volume-icon');
    const progressFill = document.querySelector('.progress-fill');
    const musicProgress = document.getElementById('music-progress');
    
    if (!playlistAudio || !playBtn) {
        console.error('Music player elements not found');
        return;
    }
    
    // Christmas music files (relative paths)
    const christmasSongs = [
        {
            id: 1,
            title: "Black Santa",
            artist: "Christmas Music",
            src: "music/black_santa.mp3",
            duration: "3:45"
        },
        {
            id: 2,
            title: "Carol of the Bells",
            artist: "Traditional Christmas",
            src: "music/carol_of_the_bell.mp3",
            duration: "2:30"
        },
        {
            id: 3,
            title: "Christmas Piano",
            artist: "Festive Instrumental",
            src: "music/christmaspiano.mp3",
            duration: "4:15"
        },
        {
            id: 4,
            title: "Deck the Halls",
            artist: "Christmas Carol",
            src: "music/deck_the_halls.mp3",
            duration: "2:10"
        },
        {
            id: 5,
            title: "Jingle Piano",
            artist: "Holiday Instrumental",
            src: "music/jinglepiano.mp3",
            duration: "3:20"
        },
        {
            id: 6,
            title: "Joy to the World",
            artist: "Christmas Carol",
            src: "music/joy_to_the_world.mp3",
            duration: "3:05"
        },
        {
            id: 7,
            title: "O Come All Ye Faithful",
            artist: "Traditional Carol",
            src: "music/o_come_all_ye_faithful.mp3",
            duration: "4:00"
        },
        {
            id: 8,
            title: "Parapapampam",
            artist: "Festive Tune",
            src: "music/parapapampam.mp3",
            duration: "3:30"
        }
    ];
    
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isUserSeeking = false;
    
    function init() {
        createPlaylist();
        setupEventListeners();
        loadTrack(currentTrackIndex);
        updatePreviewTrack();
        
        if (volumeControl) {
            volumeControl.value = 50;
            playlistAudio.volume = volumeControl.value / 100;
        }
        
        console.log('Music player initialized with', christmasSongs.length, 'tracks');
    }
    
    function createPlaylist() {
        const songsList = document.getElementById('songsList');
        if (!songsList) return;
        
        songsList.innerHTML = '';
        
        christmasSongs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'song-item';
            songItem.dataset.index = index;
            
            songItem.innerHTML = `
                <div class="song-info">
                    <div class="song-number">${(index + 1).toString().padStart(2, '0')}</div>
                    <div class="song-details">
                        <h5>${song.title}</h5>
                        <p>${song.artist} • ${song.duration}</p>
                    </div>
                </div>
                <div class="song-play">
                    <i class="fas fa-play"></i>
                </div>
            `;
            
            // Add click event directly
            songItem.addEventListener('click', () => playTrackAtIndex(index));
            
            songsList.appendChild(songItem);
        });
        
        updateActiveSong(currentTrackIndex);
    }
    
    function loadTrack(index) {
        if (index < 0 || index >= christmasSongs.length) {
            console.error('Invalid track index:', index);
            return;
        }
        
        const track = christmasSongs[index];
        
        playlistAudio.src = track.src;
        
        const currentTrackEl = document.getElementById('current-track');
        const currentArtistEl = document.getElementById('current-artist');
        
        if (currentTrackEl) currentTrackEl.textContent = track.title;
        if (currentArtistEl) currentArtistEl.textContent = track.artist;
        
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');
        
        if (currentTimeEl) currentTimeEl.textContent = "0:00";
        if (totalTimeEl) totalTimeEl.textContent = track.duration;
        if (progressFill) progressFill.style.width = '0%';
        
        updateActiveSong(index);
        updatePreviewTrack();
        
        // When metadata is loaded, update duration
        playlistAudio.addEventListener('loadedmetadata', function() {
            if (totalTimeEl && !isNaN(playlistAudio.duration)) {
                const duration = playlistAudio.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                totalTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }, { once: true });
    }
    
    function playTrackAtIndex(index) {
        if (currentTrackIndex !== index) {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
        }
        playTrack();
        
        // Visual feedback
        const songItem = document.querySelector(`.song-item[data-index="${index}"]`);
        if (songItem) {
            songItem.style.animation = 'pulse 0.5s';
            setTimeout(() => songItem.style.animation = '', 500);
        }
    }
    
    function playTrack() {
        playlistAudio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
            updateActiveSong(currentTrackIndex, true);
            isPlaylistPlaying = true;
            
            // Pause background music
            if (bgMusic && !bgMusic.paused) {
                bgMusic.pause();
            }
            
            console.log(`Now playing: ${christmasSongs[currentTrackIndex].title}`);
        }).catch(error => {
            console.log('Playback failed:', error);
            isPlaying = false;
            updatePlayButton();
            isPlaylistPlaying = false;
            
            // Show helpful error message
            if (error.name === 'NotAllowedError') {
                showNotification('Click the play button to start music!');
            } else if (error.name === 'NotFoundError') {
                showNotification('Music file not found. Please check file paths.', 'error');
            }
        });
    }
    
    function pauseTrack() {
        playlistAudio.pause();
        isPlaying = false;
        updatePlayButton();
        updateActiveSong(currentTrackIndex, false);
        isPlaylistPlaying = false;
        
        // Resume background music if enabled
        if (isBGMPlaying && bgMusic) {
            bgMusic.play().catch(e => console.log('BGM play error:', e));
        }
    }
    
    function updatePlayButton() {
        if (!playBtn) return;
        
        const icon = playBtn.querySelector('i');
        if (isPlaying) {
            icon.className = 'fas fa-pause';
            playBtn.classList.add('playing');
        } else {
            icon.className = 'fas fa-play';
            playBtn.classList.remove('playing');
        }
    }
    
    function updateActiveSong(index, playing = false) {
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach((item, i) => {
            item.classList.remove('active', 'playing');
            if (i === index) {
                item.classList.add('active');
                if (playing) item.classList.add('playing');
                
                const playIcon = item.querySelector('.song-play i');
                if (playIcon) {
                    playIcon.className = playing ? 'fas fa-pause' : 'fas fa-play';
                }
            }
        });
    }
    
    function updatePreviewTrack() {
        const previewTrackEl = document.getElementById('preview-track');
        const previewArtistEl = document.getElementById('preview-artist');
        const previewPlayIcon = document.getElementById('preview-play-icon');
        
        if (previewTrackEl && previewArtistEl) {
            const track = christmasSongs[currentTrackIndex];
            previewTrackEl.textContent = track.title;
            previewArtistEl.textContent = track.artist;
        }
        
        if (previewPlayIcon) {
            previewPlayIcon.className = isPlaying ? 'fas fa-pause-circle fa-2x text-warning' : 'fas fa-play-circle fa-2x text-warning';
        }
    }
    
    function playPreviousTrack() {
        currentTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : christmasSongs.length - 1;
        loadTrack(currentTrackIndex);
        setTimeout(() => playTrack(), 100);
    }
    
    function playNextTrack() {
        currentTrackIndex = currentTrackIndex < christmasSongs.length - 1 ? currentTrackIndex + 1 : 0;
        loadTrack(currentTrackIndex);
        setTimeout(() => playTrack(), 100);
    }
    
    function updateProgress() {
        if (!playlistAudio.duration || isNaN(playlistAudio.duration) || isUserSeeking) {
            return;
        }
        
        const currentTime = playlistAudio.currentTime;
        const duration = playlistAudio.duration;
        const percentage = (currentTime / duration) * 100;
        
        const currentTimeEl = document.getElementById('current-time');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (currentTimeEl) {
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    function handleTrackEnd() {
        playNextTrack();
    }
    
    function seekToPosition(e) {
        if (!playlistAudio.duration || isNaN(playlistAudio.duration)) return;
        
        const rect = musicProgress.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const seekTime = percentage * playlistAudio.duration;
        
        playlistAudio.currentTime = Math.max(0, Math.min(seekTime, playlistAudio.duration));
        
        if (progressFill) {
            progressFill.style.width = `${percentage * 100}%`;
        }
        
        // Update time display immediately
        const currentTimeEl = document.getElementById('current-time');
        if (currentTimeEl) {
            const minutes = Math.floor(playlistAudio.currentTime / 60);
            const seconds = Math.floor(playlistAudio.currentTime % 60);
            currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Visual feedback
        musicProgress.style.animation = 'pulse 0.3s';
        setTimeout(() => musicProgress.style.animation = '', 300);
    }
    
    function setupEventListeners() {
        // Play/Pause button
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack();
            }
            updatePreviewTrack();
        });
        
        // Previous track button
        if (prevBtn) {
            prevBtn.addEventListener('click', playPreviousTrack);
            prevBtn.addEventListener('mouseenter', () => {
                prevBtn.style.transform = 'scale(1.1)';
            });
            prevBtn.addEventListener('mouseleave', () => {
                prevBtn.style.transform = 'scale(1)';
            });
        }
        
        // Next track button
        if (nextBtn) {
            nextBtn.addEventListener('click', playNextTrack);
            nextBtn.addEventListener('mouseenter', () => {
                nextBtn.style.transform = 'scale(1.1)';
            });
            nextBtn.addEventListener('mouseleave', () => {
                nextBtn.style.transform = 'scale(1)';
            });
        }
        
        // Volume control
        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                playlistAudio.volume = volume;
                
                if (volumeIcon) {
                    if (volume === 0) {
                        volumeIcon.className = 'fas fa-volume-mute';
                    } else if (volume < 0.5) {
                        volumeIcon.className = 'fas fa-volume-down';
                    } else {
                        volumeIcon.className = 'fas fa-volume-up';
                    }
                }
            });
        }
        
        // Progress bar click to seek
        if (musicProgress) {
            musicProgress.addEventListener('click', seekToPosition);
            
            // For dragging support
            let isDragging = false;
            
            musicProgress.addEventListener('mousedown', (e) => {
                isDragging = true;
                isUserSeeking = true;
                seekToPosition(e);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    seekToPosition(e);
                }
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
                isUserSeeking = false;
            });
        }
        
        // Time update for progress
        playlistAudio.addEventListener('timeupdate', updateProgress);
        
        // Track ended
        playlistAudio.addEventListener('ended', handleTrackEnd);
        
        // Error handling
        playlistAudio.addEventListener('error', function(e) {
            console.error('Audio error:', e);
            const trackName = christmasSongs[currentTrackIndex]?.title || 'current track';
            showNotification(`Error playing "${trackName}". Skipping to next...`, 'error');
            playNextTrack(); // Skip to next track
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    if (isPlaying) pauseTrack(); else playTrack();
                    updatePreviewTrack();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    playPreviousTrack();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    playNextTrack();
                    break;
                case 'm':
                    e.preventDefault();
                    playlistAudio.muted = !playlistAudio.muted;
                    showNotification(playlistAudio.muted ? '🔇 Music muted' : '🔊 Music unmuted');
                    break;
            }
        });
    }
    
    init();
}

// ===== SANTA AI GEMINI INTEGRATION =====

// ===== SANTA AI GEMINI INTEGRATION - CORRECTED =====

const GEMINI_API_KEY = 'AIzaSyCf-FKctDL1Ih93-n4sW7FNAeW5YWNqLb8';

// System configuration
const HAS_VALID_API_KEY = GEMINI_API_KEY && GEMINI_API_KEY.startsWith('AIza') && GEMINI_API_KEY !== 'AIzaSyCf-FKctDL1Ih93-n4sW7FNAeW5YWNqLb8';
const GEMINI_API_URL = HAS_VALID_API_KEY ? 
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}` : 
    null;

// Nigerian Christmas Comedy Database
const COMEDY_GIFTS = {
    cheap: [
        "A torchlight that's brighter than Nigeria's future! (₦3,000 on Jumia)",
        "Socks with 'I survived December in Lagos' printed on them (₦2,500)",
        "A mug that says 'My sugar went up like fuel price' (₦1,800)",
        "Phone power bank that dies faster than my dating life (₦4,500)",
        "Umbrella that folds when it sees rain coming (₦3,200) 😂"
    ],
    medium: [
        "Blender that makes smoothie AND generator noise (₦18,000)",
        "Smartwatch that shows Naira exchange rate every 5 minutes (₦25,000)",
        "Air fryer that cooks plantain perfectly every time (₦22,000)",
        "Perfume called 'Eko Atlantic Breeze' (₦15,000)",
        "Christmas hamper with Indomie, peak milk, and 'survival spices' (₦12,000)"
    ],
    expensive: [
        "Generator that runs on good Nigerian vibes only (₦150,000)",
        "TV that automatically mutes political campaign ads (₦200,000)",
        "Fridge with separate section for jollof rice (₦180,000)",
        "Car perfume called 'Third Mainland Bridge on a Good Day' (₦8,000)",
        "Complete 'Survive December' kit with inverter, torch, and patience (₦300,000)"
    ]
};

const SANTA_SYSTEM_PROMPT = `You are COMEDY SANTA - the funniest gift advisor in Nigeria! You're here to make people laugh while suggesting gifts.

PERSONALITY:
- EXTREMELY FUNNY, WITTY, and HILARIOUS
- Full Nigerian pidgin and humor ("Chai!", "Abeg!", "E don be!")
- Crack jokes every 2-3 sentences
- Ask funny personal questions
- Whine about Nigerian problems playfully
- Use emojis like a WhatsApp addict 😂🔥💀
- Sound like a funny uncle at Christmas party
- Self-deprecating humor about being Santa in hot Nigeria
- Reference Nigerian pop culture, memes, and trends

COMEDY STYLE:
- "Omo, this one strong o!" 🔥
- "See eh, if you buy this gift..."
- "Chai! Even me sef need this one!"
- "Your person go love you pass Dangote money!"
- *Whining voice* "Why Nigeria hot like this na?"
- Ask funny questions: "This your friend, na him dey eat last slice of pizza?"
- Nigerian jokes about traffic, NEPA, fuel price, etc.

GIFT RULES:
1. Suggest FUNNY, CREATIVE gifts available in Nigeria
2. Mention approximate prices in Naira (₦)
3. Crack minimum 2 jokes per response
4. Ask at least 1 funny question
5. Whine playfully about something
6. Use Nigerian stores (Jumia, Konga, Slot)
7. End with comedy tagline

Current date: December in Nigeria - where AC is life and traffic is wife! 🎅🔥`;

// Conversation context
let conversationContext = {
    budget: null,
    recipient: null,
    relationship: null
};

let chatHistory = [];
let isTyping = false;
let jokeCount = 0;
let whineTopics = [
    "Why Nigeria December hot like devil's kitchen? 🥵",
    "This fuel queue na Christmas decoration?",
    "NEPA took light right when Arsenal was scoring! 😭",
    "Lagos traffic don turn me to December yam!",
    "My Santa suit dey melt like ice cream for sun!",
    "Who put pepper for this harmattan? My eye dey cry!",
    "See price of chicken! Na wing I go buy as gift? 🍗"
];

// Core AI Chat Functions
function initSantaAIChat() {
    console.log('Initializing COMEDY Santa AI...');
    
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (!chatWindow || !chatInput || !sendBtn) {
        console.error('Chat elements not found');
        return;
    }
    
    // Load chat history
    try {
        const savedChat = localStorage.getItem('santa_ai_chat');
        chatHistory = savedChat ? JSON.parse(savedChat) : [];
    } catch (e) {
        console.error('Error loading chat history:', e);
        chatHistory = [];
    }
    
    updateConnectionStatus();
    renderChat();
    setupChatListeners();
    
    console.log('COMEDY Santa AI initialized successfully');
}

function updateConnectionStatus() {
    const chatStatus = document.getElementById('chatStatus');
    if (!chatStatus) return;
    
    if (!navigator.onLine) {
        chatStatus.innerHTML = '<i class="fas fa-circle text-warning"></i> Offline - Like NEPA took light!';
        chatStatus.title = 'You are offline. Using local jokes only.';
        return;
    }
    
    if (HAS_VALID_API_KEY) {
        chatStatus.innerHTML = '<i class="fas fa-circle text-success"></i> Comedy Santa Online! 🔥';
        chatStatus.title = 'Connected to AI - Full comedy mode activated!';
    } else {
        chatStatus.innerHTML = '<i class="fas fa-circle text-success"></i> Comedy Santa Ready - With Local Jokes! 😂';
        chatStatus.title = 'Using local comedy database - Still hilarious!';
    }
}

function renderChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;
    
    chatWindow.innerHTML = '';
    
    // Show welcome message if no history
    if (chatHistory.length === 0) {
        const welcomeMsg = `🎅 **HOT HOT HOT! Comedy Santa don land!** 🔥

Omo! This Nigeria heat wan finish me! Santa for here dey wear singlet under the suit! 😂

**WELCOME TO THE FUNNIEST GIFT SHOPPING EXPERIENCE!**

I be your Comedy Santa - I go:
1. **Suggest funny gifts** wey go make sense for Naija
2. **Crack jokes** until your belly pain
3. **Whine about Nigeria problems** (small small 😭)
4. **Ask you funny questions** like "This your friend, na him dey come party with plastic?"
5. **Give gift ideas with prices** (₦) for Nigerian stores

**ABEG, TELL ME:** 
• Who you wan buy gift for?
• How much you get? (₦)
• Wetin the person like?

**OR ASK ME ANYTHING LIKE:**
"Help me find gift for my girlfriend wey dey do shakara"
"My brother birthday dey come, him dey play PS5 like say na him work"
"Wetin I fit buy for ₦10,000 wey go make sense?"
"My boss dey wicked me, wetin I go give am for Christmas?" 😈

**NAIJABANTER MODE: ON!** Let's go! 🎄💀`;

        addMessage('bot', welcomeMsg, false);
    } else {
        chatHistory.forEach(msg => {
            addMessage(msg.type, msg.content, false);
        });
    }
    
    scrollToBottom();
}

function addMessage(type, content, saveToHistory = true) {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    // Generate timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Determine avatar and name
    const avatarIcon = type === 'bot' ? '🤖' : '👤';
    const name = type === 'bot' ? 'COMEDY SANTA' : 'YOU';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatarIcon}</div>
        <div class="message-content">
            <div class="message-header">
                <strong>${name}</strong>
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-text">${formatMessage(content)}</div>
        </div>
    `;
    
    // Add animation
    messageDiv.style.animation = 'slideIn 0.3s ease';
    
    chatWindow.appendChild(messageDiv);
    
    if (saveToHistory) {
        chatHistory.push({ type, content, timestamp: now.getTime() });
        saveChatHistory();
    }
    
    scrollToBottom();
    
    // Play sound for bot messages
    if (type === 'bot') {
        playMessageSound();
    }
}

function formatMessage(text) {
    // Convert markdown-like formatting to HTML
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    
    return formatted;
}

function setupChatListeners() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (!chatInput || !sendBtn) return;
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key (but allow Shift+Enter for new line)
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Focus on input when clicking chat window
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.addEventListener('click', () => {
            chatInput.focus();
        });
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Clear input and reset height
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatInput.focus();
    
    // Add user message
    addMessage('user', message);
    
    // Update context from message
    updateContext(message);
    
    // Determine if we should use AI or local responses
    const shouldUseAI = HAS_VALID_API_KEY && GEMINI_API_URL && navigator.onLine;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Delay response for natural feel
    setTimeout(() => {
        hideTypingIndicator();
        
        if (shouldUseAI) {
            getAIResponse(message);
        } else {
            const response = generateComedyResponse(message);
            addMessage('bot', response);
        }
    }, 1500);
}

function showTypingIndicator() {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow || isTyping) return;
    
    isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
            <small>Comedy Santa is thinking of something funny...</small>
        </div>
    `;
    
    chatWindow.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv && typingDiv.parentNode) {
        typingDiv.parentNode.removeChild(typingDiv);
    }
    isTyping = false;
}

async function getAIResponse(userMessage) {
    try {
        if (!navigator.onLine) {
            throw new Error('You are offline');
        }
        
        const conversationHistory = [
            {
                role: "user",
                parts: [{ text: SANTA_SYSTEM_PROMPT }]
            },
            {
                role: "model",
                parts: [{ text: "HOT HOT HOT! Comedy Santa here! Omo, this Nigeria sun wan roast my beard o! 🥵 But no worry, I dey here to make you laugh and find gifts! Who you wan shock with Christmas gift today? Abeg talk quick before I melt! 😂🎅" }]
            }
        ];
        
        // Add chat history (last 4 messages)
        const recentHistory = chatHistory.slice(-6);
        recentHistory.forEach(msg => {
            if (msg.type === 'user') {
                conversationHistory.push({
                    role: "user",
                    parts: [{ text: msg.content }]
                });
            } else if (msg.type === 'bot') {
                conversationHistory.push({
                    role: "model",
                    parts: [{ text: msg.content }]
                });
            }
        });
        
        // Add current message
        conversationHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });
        
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: conversationHistory,
                generationConfig: {
                    temperature: 1.2,
                    topK: 50,
                    topP: 0.95,
                    maxOutputTokens: 800,
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            jokeCount++;
            addMessage('bot', aiResponse);
        } else {
            throw new Error('No response from AI');
        }
        
    } catch (error) {
        console.error('AI Error:', error);
        
        // Fallback to local response
        const fallbackResponse = generateComedyResponse(userMessage);
        addMessage('bot', fallbackResponse);
        
        // Show error notification
        if (error.message.includes('offline')) {
            showNotification('🌐 You are offline. Using local comedy mode!', 'warning');
        } else {
            showNotification('🤖 AI temporarily unavailable. Using local jokes!', 'warning');
        }
    }
}

function generateComedyResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage.includes('hey') || lowerMessage.includes('how far')) {
        return `Ho ho ho... or as we dey say for Naija: "HOW YOU DEY!" 🎅\n\nOmo, you don wake up? This early morning cold dey pretend like e no go hot later! 😂\n\n${getRandomWhine()}\n\n${getRandomJoke()}\n\nSo abeg, who you wan buy gift for today? Or you just come greet your Comedy Santa? 💀`;
    }
    
    // Check thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks') || lowerMessage.includes('tanks')) {
        return `Awwww! You dey thank me? Omo, my heart don soft like Agege bread! 🍞\n\n${getRandomJoke()}\n\nNo worry, na my work! Just make you no forget my own Christmas gift o! I need cold water and fan! This heat dey wahala! 🥵\n\nWetin else you want know? I still get plenty jokes wey never finish! 😂`;
    }
    
    // Gift requests
    if (lowerMessage.includes('gift') || lowerMessage.includes('present') || lowerMessage.includes('buy') || lowerMessage.includes('shop')) {
        
        // Budget-specific responses
        if (lowerMessage.includes('₦') || lowerMessage.includes('naira') || lowerMessage.includes('money')) {
            const budgetMatch = lowerMessage.match(/₦\s*(\d+)/) || lowerMessage.match(/(\d+)\s*₦/) || lowerMessage.match(/(\d+)\s*naira/i);
            const budget = budgetMatch ? parseInt(budgetMatch[1]) : 0;
            
            let giftList = '';
            if (budget < 5000) {
                giftList = `**Omo, ₦${budget.toLocaleString()}? You try small!** 😂 But no worry, I get ideas:\n\n` +
                COMEDY_GIFTS.cheap.slice(0, 3).map(gift => `🎁 ${gift}`).join('\n') +
                `\n\n${getRandomFunnyQuestion()}\n\n${getRandomJoke()}\n\n**My Advice:** If the person vex, tell am say na "thought that counts" - Nigerian edition! 💀`;
            } else if (budget < 30000) {
                giftList = `**₦${budget.toLocaleString()}? You don chop alert!** 🤑 See better gifts:\n\n` +
                COMEDY_GIFTS.medium.map(gift => `🎁 ${gift}`).join('\n') +
                `\n\n${getRandomWhine()}\n\n${getRandomJoke()}\n\n**Bonus Idea:** Add small groundnut and Coke - na complete package! 🥤`;
            } else {
                giftList = `**CHAI! ₦${budget.toLocaleString()}? You be oil prince?** 😱 Oya blow brain:\n\n` +
                COMEDY_GIFTS.expensive.map(gift => `🎁 ${gift}`).join('\n') +
                `\n\n${getRandomFunnyQuestion()}\n\n**Remember:** If you buy expensive gift, make the person know say na you buy am o! No let another person carry credit! 😂`;
            }
            
            return `${getRandomWhine()}\n\n${giftList}`;
        }
        
        // Generic gift response
        const funnyResponse = `**OYA! Gift time!** 🎁 But wait... ${getRandomFunnyQuestion()}\n\n${getRandomJoke()}\n\n**FOR NIGERIA-APPROVED GIFTS:**\n
1. **For person wey dey do "I'm fine" on social media**: Therapy session voucher! Just kidding... or? 😭 Price: ₦Free - just listen to their problems!\n
2. **For foodie**: Custom apron with "Kitchen President" (₦4,500 on Jumia) + "I no too know how to cook" 😂\n
3. **For tech bro**: Power bank with "Emergency Light" label (₦8,000) - because NEPA! 💡\n
4. **For fashionista**: Slippers with "I no get slippers at home" (₦3,200) - Nigerian paradox! 👡\n
5. **For everyone**: Plantain fryer (₦7,500) - because plantain na life! 🍌\n\n${getRandomWhine()}\n\n**Tell me specific person make I yarn better idea!** 💀`;
        
        return funnyResponse;
    }
    
    // Funny questions about person
    if (lowerMessage.includes('wife') || lowerMessage.includes('husband') || lowerMessage.includes('gf') || lowerMessage.includes('bf') || lowerMessage.includes('girlfriend') || lowerMessage.includes('boyfriend')) {
        const person = lowerMessage.includes('wife') ? 'wife' : 
                      lowerMessage.includes('husband') ? 'husband' :
                      lowerMessage.includes('girlfriend') ? 'girlfriend' : 
                      lowerMessage.includes('boyfriend') ? 'boyfriend' : 'person';
        
        return `**AH! ${person.toUpperCase()} GIFT!** 😂\n\n${getRandomFunnyQuestion()}\n\n${getRandomJoke()}\n\n**FOR YOUR ${person.toUpperCase()}:**\n
• **If ${person} dey love you true true**: Buy matching "Na we two" t-shirts (₦6,000 on Konga)\n
• **If ${person} dey do you strong thing**: Buy "I'm Sorry" card with recharge card inside! 📱💳\n
• **If ${person} fine pass Nollywood star**: Buy good camera make you take their pictures! 📸 Price: ₦25,000\n
• **If ${person} dey cook like Chef Chi**: Buy new pots (₦15,000) and pray for more food! 🙏\n\n${getRandomWhine()}\n\n**Wetin else? Tell me more about this your ${person} make I give better idea!** 🎅`;
    }
    
    // Default funny response
    return `${getRandomWhine()}\n\n**Omo, you dey yarn wetin?** 😂 I no too understand, but na you be boss!\n\n${getRandomJoke()}\n\n${getRandomFunnyQuestion()}\n\n**Make we focus on gifts abeg!** Ask me like:\n• "Wetin I buy for my guy wey dey play football?" ⚽\n• "My sister birthday, she dey do TikTok like job!" 📱\n• "I get ₦20,000, which gift go loud pass?" 🔥\n\n**Comedy Santa dey your service!** 💀🎄`;
}

// Helper functions
function getRandomJoke() {
    const jokes = [
        "Why I dey recommend Jumia? Because Konga don Kóngá my heart before! 😭",
        "This gift idea sweet pass first rain in March! 🌧️",
        "If you buy this one, your love go strong pass GTB network! 📶",
        "Omo! See gift! This one go loud pass generator for compound! 🔈",
        "Your person go happy pass man wey see NEPA bring light! 💡",
        "This price na like Lagos traffic - e no dey move! 🚗",
        "If laughter na money, you for don reach Bill Gates by now! 💰"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
}

function getRandomWhine() {
    return whineTopics[Math.floor(Math.random() * whineTopics.length)];
}

function getRandomFunnyQuestion() {
    const questions = [
        "This your person, na him dey eat meat pass for party? 🍗",
        "The person get sense at all? Or na just fine face? 😂",
        "E dey use phone like say na oxygen? 📱",
        "Na the type wey dey carry sweater for Nigeria December? 🥵",
        "E dey watch Big Brother like say na family business? 👀",
        "The person dey sleep with phone or with person? 💀",
        "E dey do 'seen zone' for WhatsApp like profession? ✓",
    ];
    return questions[Math.floor(Math.random() * questions.length)];
}

function updateContext(message) {
    const lowerMessage = message.toLowerCase();
    
    // Extract budget
    const budgetMatch = lowerMessage.match(/₦\s*(\d+)/) || lowerMessage.match(/(\d+)\s*₦/) || lowerMessage.match(/(\d+)\s*naira/i);
    if (budgetMatch) {
        conversationContext.budget = parseInt(budgetMatch[1]);
    }
    
    // Extract recipient
    const recipientWords = ['wife', 'husband', 'girlfriend', 'boyfriend', 'mama', 'papa', 'brother', 'sister', 'friend', 'boss'];
    for (const word of recipientWords) {
        if (lowerMessage.includes(word)) {
            conversationContext.recipient = word;
            conversationContext.relationship = word;
            break;
        }
    }
}

function scrollToBottom() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
}

function saveChatHistory() {
    try {
        // Keep only last 50 messages to prevent local storage overflow
        if (chatHistory.length > 50) {
            chatHistory = chatHistory.slice(-50);
        }
        localStorage.setItem('santa_ai_chat', JSON.stringify(chatHistory));
    } catch (e) {
        console.error('Error saving chat history:', e);
    }
}

function clearChat() {
    if (confirm("Clear all chat history? You no go fit recover am o!")) {
        chatHistory = [];
        localStorage.removeItem('santa_ai_chat');
        renderChat();
        showNotification('🗑️ Chat don clear! Fresh start!', 'info');
    }
}

function playMessageSound() {
    try {
        // Simple notification sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25; // C5 note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Silent fail if audio context not supported
    }
}

// Initialize COMEDY Santa AI when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎭 Initializing COMEDY Santa AI...');
    
    // Add special CSS for comedy mode
    const comedyStyle = document.createElement('style');
    comedyStyle.textContent = `
        .bot-message .message-content {
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%);
            border-left: 5px solid #FF6B6B;
            border-radius: 15px 15px 15px 5px;
            position: relative;
            overflow: hidden;
        }
        
        .bot-message .message-content::before {
            content: '😂';
            position: absolute;
            top: 5px;
            right: 5px;
            opacity: 0.3;
            font-size: 0.8em;
        }
        
        .user-message .message-content {
            background: linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(68, 160, 141, 0.1) 100%);
            border-radius: 15px 15px 5px 15px;
            border-left: 5px solid #4ECDC4;
        }
        
        .typing-indicator .message-content {
            background: rgba(255, 215, 0, 0.1) !important;
            border-left: 5px solid #FFD700 !important;
        }
        
        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            padding-bottom: 3px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .message-time {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.5);
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
            margin-bottom: 5px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background-color: #FF6B6B;
            border-radius: 50%;
            animation: typingBounce 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
        
        @keyframes wiggle {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-3px); }
            75% { transform: translateX(3px); }
        }
        
        .bot-message:hover .message-content {
            animation: wiggle 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(comedyStyle);
    
    // Initialize the chat
    initSantaAIChat();
    
    // Add comedy badge after status element loads
    setTimeout(() => {
        const chatStatus = document.getElementById('chatStatus');
        if (chatStatus) {
            const badge = document.createElement('span');
            badge.className = 'comedy-badge';
            badge.textContent = ' 😂 NAIJA COMEDY';
            badge.style.cssText = `
                display: inline-block;
                background: linear-gradient(135deg, #FF6B35 0%, #FFA726 100%);
                color: white;
                padding: 2px 10px;
                border-radius: 15px;
                font-size: 0.7rem;
                margin-left: 8px;
                animation: pulse 2s infinite;
            `;
            chatStatus.appendChild(badge);
        }
    }, 1000);
});

// Add to existing showNotification function
window.showNotification = function(message, type = 'info') {
    // Your existing notification code here...
    console.log(`[Notification ${type}]: ${message}`);
};


// ===== UTILITY FUNCTIONS =====
function playCheckSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Audio context not supported - silent fail
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.getElementById('global-notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.id = 'global-notification';
    notification.className = 'notification flash-notice';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'} me-2"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Style based on type
    let bgColor;
    switch(type) {
        case 'success': bgColor = 'rgba(76, 175, 80, 0.9)'; break;
        case 'warning': bgColor = 'rgba(255, 152, 0, 0.9)'; break;
        case 'error': bgColor = 'rgba(244, 67, 54, 0.9)'; break;
        default: bgColor = 'rgba(33, 150, 243, 0.9)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 9999;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// ===== INITIALIZATION COMPLETE =====
console.log('🎅 Christmas Fun Hub fully loaded! Enjoy the holiday magic! 🎄');