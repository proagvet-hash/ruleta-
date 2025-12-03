import { User } from './modules/user.js';
import { Roulette } from './modules/roulette.js';
import { Bets } from './modules/bets.js';
import { Jackpots } from './modules/jackpots.js';
import { Utils } from './modules/utils.js';
import { BotManager } from './modules/bots.js';
import { Chat } from './modules/chat.js';

class App {
    constructor() {
        this.selectedChipValue = 10;
        this.roundTimer = null;
        this.roundTimeTotal = 20; // Faster rounds for online feel
        this.timeLeft = this.roundTimeTotal;
        this.isSpinning = false;
        this.currentRotation = 0;
        this.bots = [];
        this.currentRoom = 'standard';

        this.init();
    }

    init() {
        User.init();
        Jackpots.init();
        this.cacheDOM();
        this.bindEvents();

        // Initial Render
        this.renderRouletteWheel();
        this.renderBettingBoard();

        // Don't start game until lobby join
    }

    cacheDOM() {
        this.dom = {
            app: document.getElementById('app'),
            lobbyScreen: document.getElementById('lobby-screen'),
            registrationScreen: document.getElementById('registration-screen'),
            dashboardScreen: document.getElementById('dashboard-screen'),

            playerNameInput: document.getElementById('player-name-input'),
            joinGameBtn: document.getElementById('join-game-btn'),
            goToRegisterBtn: document.getElementById('go-to-register-btn'),

            // Registration Form
            registrationForm: document.getElementById('registration-form'),
            cancelRegisterBtn: document.getElementById('cancel-register-btn'),

            roomCards: document.querySelectorAll('.room-card'),

            displayUsername: document.getElementById('display-username'),
            displayBalance: document.getElementById('display-balance'),
            roomNameDisplay: document.getElementById('room-name-display'),

            rouletteWheel: document.getElementById('roulette-wheel'),
            boardNumbers: document.getElementById('board-numbers'),
            chipSelector: document.getElementById('chip-selector'),
            totalBetDisplay: document.getElementById('total-bet'),

            clearBetsBtn: document.getElementById('clear-bets'),
            spinNowBtn: document.getElementById('spin-now-btn'),

            timerDisplay: document.getElementById('round-timer'),
            roundIdDisplay: document.getElementById('round-id'),

            jpMini: document.getElementById('jp-mini'),
            jpMajor: document.getElementById('jp-major'),
            jpMega: document.getElementById('jp-mega'),

            playersList: document.getElementById('players-list'),
            chatBox: document.getElementById('chat-box'),
            chatInput: document.getElementById('chat-input'),
            chatSend: document.getElementById('chat-send'),

            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modal-title'),
            modalMessage: document.getElementById('modal-message'),
            modalClose: document.getElementById('modal-close'),
            lastResults: document.getElementById('last-results')
        };
    }

    bindEvents() {
        // Lobby Room Selection
        this.dom.roomCards.forEach(card => {
            card.addEventListener('click', () => {
                this.dom.roomCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.currentRoom = card.dataset.room;
            });
        });

        // Go to Register
        this.dom.goToRegisterBtn.addEventListener('click', () => {
            this.dom.lobbyScreen.classList.remove('active');
            this.dom.lobbyScreen.classList.add('hidden');
            this.dom.registrationScreen.classList.remove('hidden');
            this.dom.registrationScreen.classList.add('active');
        });

        // Cancel Register
        this.dom.cancelRegisterBtn.addEventListener('click', () => {
            this.dom.registrationScreen.classList.remove('active');
            this.dom.registrationScreen.classList.add('hidden');
            this.dom.lobbyScreen.classList.remove('hidden');
            this.dom.lobbyScreen.classList.add('active');
        });

        // Register Form Submit
        this.dom.registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;

            // Get form data
            const formData = new FormData(this.dom.registrationForm);

            // Send to Formspree using XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://formspree.io/f/movogeyq');
            xhr.setRequestHeader('Accept', 'application/json');

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    // Register user locally regardless of Formspree response
                    const result = User.register(username);
                    if (result.success) {
                        User.login(username);
                        this.dom.registrationScreen.classList.remove('active');
                        this.dom.registrationScreen.classList.add('hidden');

                        if (xhr.status === 200) {
                            this.showModal('¡Registro Exitoso!', 'Tu información ha sido enviada. ¡Bienvenido a Apostemos!');
                            setTimeout(() => {
                                this.dom.modal.classList.add('hidden');
                                this.enterGame();
                            }, 2000);
                        } else {
                            // Still enter game even if Formspree fails
                            this.enterGame();
                        }
                    } else {
                        alert('Error en el registro: ' + result.message);
                    }
                }
            };

            xhr.send(formData);
        });

        // Join Game
        this.dom.joinGameBtn.addEventListener('click', () => {
            const name = this.dom.playerNameInput.value.trim() || 'Guest';

            // Try to login first
            let result = User.login(name);

            // If user doesn't exist, register them automatically
            if (!result.success) {
                result = User.register(name);
            }

            if (result.success) {
                this.enterGame();
            } else {
                console.error("Login error:", result.message);
            }
        });

        // Spin Now
        this.dom.spinNowBtn.addEventListener('click', () => {
            if (this.isSpinning) return;
            clearInterval(this.roundTimer);
            this.spinRoulette();
        });

        // Betting
        this.dom.chipSelector.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedChipValue = parseInt(e.target.dataset.value);
            }
        });

        this.dom.clearBetsBtn.addEventListener('click', () => {
            if (this.isSpinning) return;
            Bets.clearBets();
            this.updateBetsUI();
        });

        this.dom.modalClose.addEventListener('click', () => this.dom.modal.classList.add('hidden'));

        // Chat
        this.dom.chatSend.addEventListener('click', () => this.sendChatMessage());
        this.dom.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }

    enterGame() {
        this.dom.lobbyScreen.classList.add('hidden');
        this.dom.lobbyScreen.classList.remove('active');
        this.dom.dashboardScreen.classList.remove('hidden');
        this.dom.dashboardScreen.classList.add('active');

        // Setup Room
        this.dom.roomNameDisplay.textContent = this.currentRoom === 'vip' ? 'Sala VIP' : 'Mesa Estándar';

        // Init Bots
        this.bots = BotManager.generateBots(this.currentRoom === 'vip' ? 3 : 5);
        this.updatePlayersList();

        // Init Chat
        Chat.init(this.dom.chatBox);
        Chat.addMessage('System', `Bienvenido a la ${this.dom.roomNameDisplay.textContent}.`, true);

        this.updateUI();
        this.startRoundTimer();
    }

    sendChatMessage() {
        const text = this.dom.chatInput.value.trim();
        if (!text) return;

        Chat.addMessage(User.currentUser.username, text);
        this.dom.chatInput.value = '';
    }

    updatePlayersList() {
        this.dom.playersList.innerHTML = '';

        // Add User
        const userItem = this.createPlayerItem(User.currentUser.username, '👤', User.getBalance(), true);
        this.dom.playersList.appendChild(userItem);

        // Add Bots
        this.bots.forEach(bot => {
            const botItem = this.createPlayerItem(bot.name, bot.avatar, bot.balance);
            this.dom.playersList.appendChild(botItem);
        });
    }

    createPlayerItem(name, avatar, balance, isUser = false) {
        const div = document.createElement('div');
        div.className = 'player-item';
        if (isUser) div.style.background = 'rgba(255, 215, 0, 0.1)';

        div.innerHTML = `
            <div class="player-avatar">${avatar}</div>
            <div class="player-info">
                <span class="player-name">${name}</span>
                <span class="player-balance">${Utils.formatCurrency(balance)}</span>
            </div>
        `;
        return div;
    }

    updateUI() {
        if (!User.currentUser) return;
        this.dom.displayUsername.textContent = User.currentUser.username;
        this.dom.displayBalance.textContent = Utils.formatCurrency(User.getBalance());

        const jackpots = Jackpots.getValues();
        this.dom.jpMini.textContent = Utils.formatCurrency(jackpots.mini);
        this.dom.jpMajor.textContent = Utils.formatCurrency(jackpots.major);
        this.dom.jpMega.textContent = Utils.formatCurrency(jackpots.mega);

        this.updateBetsUI();
    }

    updateBetsUI() {
        this.dom.totalBetDisplay.textContent = Utils.formatCurrency(Bets.getTotalBetAmount());

        // Clear chips
        document.querySelectorAll('.chip-on-board').forEach(el => el.remove());

        // Render User Bets
        Bets.currentBets.forEach(bet => this.renderChip(bet, 'gold'));

        // Render Bot Bets (Simulated visual only)
        this.bots.forEach(bot => {
            bot.currentBets.forEach(bet => this.renderChip(bet, 'blue')); // Bots have blue chips
        });
    }

    renderChip(bet, colorType) {
        let selector = '';
        if (bet.type === 'number') {
            if (bet.value === '0') selector = `.bet-spot[data-bet="0"]`;
            else if (bet.value === '00') selector = `.bet-spot[data-bet="00"]`;
            else selector = `.bet-spot[data-num="${bet.value}"]`;
        } else {
            selector = `.bet-spot[data-bet="${bet.value}"]`;
        }

        const spot = document.querySelector(selector);
        if (spot) {
            const chip = document.createElement('div');
            chip.className = 'chip-on-board';
            chip.textContent = bet.amount;
            if (colorType === 'blue') {
                chip.style.background = '#1976d2';
                chip.style.borderColor = '#90caf9';
            }

            const rect = spot.getBoundingClientRect();
            const offsetX = Utils.getRandomInt(-10, 10);
            const offsetY = Utils.getRandomInt(-10, 10);

            chip.style.left = `calc(50% + ${offsetX}px)`;
            chip.style.top = `calc(50% + ${offsetY}px)`;
            chip.style.transform = 'translate(-50%, -50%) translateZ(10px)';

            spot.appendChild(chip);
        }
    }

    renderRouletteWheel() {
        const wheel = this.dom.rouletteWheel;
        wheel.innerHTML = '';
        const numbers = Roulette.numbers;
        const sliceDeg = 360 / numbers.length;
        let gradientParts = [];

        numbers.forEach((num, i) => {
            const colorCode = Roulette.getColor(num);
            let color = '#333';
            if (colorCode === 'red') color = '#c92a2a';
            else if (colorCode === 'black') color = '#111';
            else if (colorCode === 'green') color = '#2b8a3e';

            const startDeg = (i * sliceDeg) - (sliceDeg / 2);
            const endDeg = (i * sliceDeg) + (sliceDeg / 2);
            gradientParts.push(`${color} ${startDeg}deg ${endDeg}deg`);

            const slot = document.createElement('div');
            slot.className = 'wheel-slot';

            // Add green-pocket class for 0 and 00
            if (colorCode === 'green') {
                slot.classList.add('green-pocket');
            }

            slot.style.transform = `rotate(${i * sliceDeg}deg)`;
            slot.style.position = 'absolute';
            slot.style.top = '0';
            slot.style.left = '50%';
            slot.style.height = '50%';
            slot.style.transformOrigin = 'bottom center';
            slot.style.paddingTop = '10px';
            slot.style.color = 'white';
            slot.style.fontWeight = 'bold';
            slot.style.fontSize = '12px';
            slot.innerHTML = `<span>${num}</span>`;

            wheel.appendChild(slot);
        });
        wheel.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    }

    renderBettingBoard() {
        const container = this.dom.boardNumbers;
        container.innerHTML = '';
        const rows = [
            [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
            [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
            [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
        ];

        rows.forEach((rowNums, rowIndex) => {
            rowNums.forEach((num, colIndex) => {
                const spot = document.createElement('div');
                spot.className = `bet-spot ${Roulette.isRed(num) ? 'red-num' : 'black-num'}`;
                spot.textContent = num;
                spot.dataset.num = num;
                spot.dataset.type = 'number';
                spot.style.gridColumn = colIndex + 2;
                spot.style.gridRow = rowIndex + 1;
                spot.addEventListener('click', () => this.handleBetClick('number', num));
                container.appendChild(spot);
            });
        });

        document.querySelectorAll('.bet-spot').forEach(spot => {
            if (!spot.dataset.num) {
                spot.addEventListener('click', () => {
                    const betType = spot.dataset.bet;
                    let type = 'unknown';
                    if (['0', '00'].includes(betType)) type = 'number';
                    else if (['red', 'black'].includes(betType)) type = 'color';
                    else if (['even', 'odd'].includes(betType)) type = 'parity';
                    else if (['1-18', '19-36'].includes(betType)) type = 'range';
                    else if (betType.includes('12')) type = 'dozen';
                    else if (betType.includes('col')) type = 'column';
                    this.handleBetClick(type, betType);
                });
            }
        });
    }

    handleBetClick(type, value) {
        if (this.isSpinning) return;
        const amount = this.selectedChipValue;
        if (User.getBalance() < Bets.getTotalBetAmount() + amount) {
            this.showModal('Saldo Insuficiente', 'Recarga tu cuenta para seguir jugando.');
            return;
        }
        Bets.placeBet({ type, value, amount, id: Utils.generateId() });
        this.updateBetsUI();
    }

    startRoundTimer() {
        if (this.roundTimer) clearInterval(this.roundTimer);
        this.timeLeft = this.roundTimeTotal;
        this.dom.roundIdDisplay.textContent = Utils.generateId().substring(0, 8).toUpperCase();

        this.roundTimer = setInterval(() => {
            this.timeLeft--;
            const mins = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
            const secs = (this.timeLeft % 60).toString().padStart(2, '0');
            this.dom.timerDisplay.textContent = `${mins}:${secs}`;

            // Bot Actions every second
            this.processBotActions();

            if (this.timeLeft <= 0) {
                clearInterval(this.roundTimer);
                this.spinRoulette();
            }
        }, 1000);
    }

    processBotActions() {
        // Bots place bets randomly during countdown
        this.bots.forEach(bot => {
            const bet = bot.placeBet();
            if (bet) {
                // Visual update for bot bet
                this.updateBetsUI();
                // Chat chance
                if (Math.random() < 0.05) {
                    Chat.addMessage(bot.name, Chat.getRandomMessage());
                }
            }
        });
        this.updatePlayersList(); // Update balances if they bet
    }

    spinRoulette() {
        this.isSpinning = true;
        const totalBet = Bets.getTotalBetAmount();
        if (totalBet > 0) {
            User.updateBalance(-totalBet);
            Jackpots.increment(totalBet);
        }
        this.updateUI();

        const result = Roulette.spin();

        // Rotation Logic
        const segmentAngle = 360 / 38;
        const spins = 5;
        const targetIndexAngle = result.index * segmentAngle;
        const currentMod = this.currentRotation % 360;
        let diff = targetIndexAngle - currentMod;
        if (diff < 0) diff += 360;
        const rotationToAdd = (360 * spins) + diff;
        this.currentRotation += rotationToAdd;

        this.dom.rouletteWheel.style.transform = `rotate(-${this.currentRotation}deg)`;

        setTimeout(() => {
            this.handleRoundEnd(result, totalBet);
        }, 5000);
    }

    handleRoundEnd(result, totalBet) {
        this.isSpinning = false;
        const winnings = Bets.calculateWinnings(result.number);

        // Bot Winnings (Simulation)
        this.bots.forEach(bot => {
            // Simple simulation: random win/loss based on luck for bots to keep balances moving
            // Or we could calculate real winnings if we stored their bet types properly.
            // For now, let's just give them random fluctuations or clear their bets.
            bot.reset();
        });

        if (winnings > 0) {
            User.updateBalance(winnings);
            this.showModal('¡GANASTE!', `Número: ${result.number} (${result.color})\nPremio: ${Utils.formatCurrency(winnings)}`);
            Chat.addMessage(User.currentUser.username, "¡Siii! He ganado 😎");
        } else if (totalBet > 0) {
            Chat.addMessage(User.currentUser.username, "Mala suerte...");
        }

        // History
        const histItem = document.createElement('span');
        histItem.className = `result-badge ${result.color}`;
        histItem.textContent = result.number;
        histItem.style.display = 'inline-block';
        histItem.style.width = '30px';
        histItem.style.height = '30px';
        histItem.style.borderRadius = '50%';
        histItem.style.textAlign = 'center';
        histItem.style.lineHeight = '30px';
        histItem.style.margin = '2px';
        histItem.style.background = result.color === 'red' ? '#d32f2f' : (result.color === 'black' ? '#222' : '#388e3c');

        this.dom.lastResults.prepend(histItem);

        Bets.clearBets();
        this.updateUI();
        this.startRoundTimer();
    }

    showModal(title, message) {
        this.dom.modalTitle.textContent = title;
        this.dom.modalMessage.textContent = message;
        this.dom.modal.classList.remove('hidden');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new App();
});
