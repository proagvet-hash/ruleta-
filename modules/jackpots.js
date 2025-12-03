import { Utils } from './utils.js';

export const Jackpots = {
    values: {
        mini: 500,
        major: 5000,
        mega: 50000
    },

    init() {
        const saved = Utils.storage.get('jackpots');
        if (saved) {
            this.values = saved;
        } else {
            Utils.storage.set('jackpots', this.values);
        }
    },

    getValues() {
        return this.values;
    },

    increment(totalBet) {
        // Increment jackpots based on a small percentage of bets
        this.values.mini += totalBet * 0.05;
        this.values.major += totalBet * 0.02;
        this.values.mega += totalBet * 0.01;
        Utils.storage.set('jackpots', this.values);
        return this.values;
    },

    checkWin(totalBet) {
        // Simple random logic for demo purposes
        // Chance increases slightly with higher bets, but is still rare
        const chance = Math.random();
        let win = null;

        // Probabilities (very simplified)
        if (chance < 0.0001) { // 0.01% chance
            win = { type: 'mega', amount: this.values.mega };
            this.values.mega = 50000; // Reset
        } else if (chance < 0.001) { // 0.1% chance
            win = { type: 'major', amount: this.values.major };
            this.values.major = 5000; // Reset
        } else if (chance < 0.01) { // 1% chance
            win = { type: 'mini', amount: this.values.mini };
            this.values.mini = 500; // Reset
        }

        if (win) {
            Utils.storage.set('jackpots', this.values);
        }

        return win;
    }
};
