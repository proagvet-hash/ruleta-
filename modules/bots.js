import { Utils } from './utils.js';
import { Roulette } from './roulette.js';

export class Bot {
    constructor(id, name, avatar, balance, strategy) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.balance = balance;
        this.strategy = strategy; // 'random', 'safe', 'aggressive'
        this.currentBets = [];
    }

    placeBet() {
        // Simulate thinking time
        if (Math.random() > 0.7) return null; // Sometimes they don't bet this tick

        const betAmount = this.getBetAmount();
        if (betAmount > this.balance) return null;

        const betType = this.getBetType();

        this.balance -= betAmount;

        const bet = {
            playerId: this.id,
            type: betType.type,
            value: betType.value,
            amount: betAmount
        };

        this.currentBets.push(bet);
        return bet;
    }

    getBetAmount() {
        const base = [5, 10, 25, 50, 100];
        if (this.strategy === 'aggressive') return base[Utils.getRandomInt(2, 4)];
        if (this.strategy === 'safe') return base[Utils.getRandomInt(0, 2)];
        return base[Utils.getRandomInt(0, 4)];
    }

    getBetType() {
        const r = Math.random();
        if (this.strategy === 'safe') {
            // Mostly colors or even/odd
            if (r < 0.45) return { type: 'color', value: 'red' };
            if (r < 0.9) return { type: 'color', value: 'black' };
            return { type: 'number', value: Utils.getRandomInt(0, 36) };
        } else if (this.strategy === 'aggressive') {
            // Mostly numbers
            return { type: 'number', value: Utils.getRandomInt(0, 36) };
        } else {
            // Random mix
            if (r < 0.3) return { type: 'color', value: Math.random() > 0.5 ? 'red' : 'black' };
            if (r < 0.6) return { type: 'parity', value: Math.random() > 0.5 ? 'even' : 'odd' };
            return { type: 'number', value: Utils.getRandomInt(0, 36) };
        }
    }

    reset() {
        this.currentBets = [];
    }
}

export const BotManager = {
    names: ['Alex', 'Sofia', 'Marco', 'Elena', 'Viktor', 'Isabella', 'Chen', 'Sarah'],
    avatars: ['👨‍💻', '👩‍💼', '🕵️‍♂️', '👩‍🎤', '🧔', '👱‍♀️', '👨‍🦱', '👩‍🦰'],

    generateBots(count) {
        const bots = [];
        for (let i = 0; i < count; i++) {
            const name = this.names[Utils.getRandomInt(0, this.names.length - 1)];
            const avatar = this.avatars[Utils.getRandomInt(0, this.avatars.length - 1)];
            const balance = Utils.getRandomInt(500, 5000);
            const strategies = ['random', 'safe', 'aggressive'];
            const strategy = strategies[Utils.getRandomInt(0, 2)];

            bots.push(new Bot(`bot_${i}`, name, avatar, balance, strategy));
        }
        return bots;
    }
};
