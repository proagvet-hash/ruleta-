import { Roulette } from './roulette.js';

export const Bets = {
    currentBets: [],

    placeBet(betData) {
        // betData: { type, value, amount, chipValue }
        this.currentBets.push(betData);
    },

    clearBets() {
        this.currentBets = [];
    },

    undoLastBet() {
        this.currentBets.pop();
    },

    getTotalBetAmount() {
        return this.currentBets.reduce((sum, bet) => sum + bet.amount, 0);
    },

    calculateWinnings(winningNumber) {
        let totalWinnings = 0;
        const wn = winningNumber; // could be number or '00'

        this.currentBets.forEach(bet => {
            let win = false;
            let payoutMultiplier = 0;

            switch (bet.type) {
                case 'number':
                    if (String(bet.value) === String(wn)) {
                        win = true;
                        payoutMultiplier = 35;
                    }
                    break;
                case 'color':
                    if (bet.value === 'red' && Roulette.isRed(wn)) win = true;
                    if (bet.value === 'black' && Roulette.isBlack(wn)) win = true;
                    payoutMultiplier = 1;
                    break;
                case 'parity':
                    if (bet.value === 'even' && Roulette.isEven(wn)) win = true;
                    if (bet.value === 'odd' && Roulette.isOdd(wn)) win = true;
                    payoutMultiplier = 1;
                    break;
                case 'range':
                    if (bet.value === '1-18' && Roulette.isLow(wn)) win = true;
                    if (bet.value === '19-36' && Roulette.isHigh(wn)) win = true;
                    payoutMultiplier = 1;
                    break;
                case 'dozen':
                    if (typeof wn === 'number') {
                        if (bet.value === '1st-12' && wn >= 1 && wn <= 12) win = true;
                        if (bet.value === '2nd-12' && wn >= 13 && wn <= 24) win = true;
                        if (bet.value === '3rd-12' && wn >= 25 && wn <= 36) win = true;
                    }
                    payoutMultiplier = 2;
                    break;
                case 'column':
                    if (typeof wn === 'number' && wn !== 0) {
                        if (bet.value === 'col-1' && wn % 3 === 1) win = true;
                        if (bet.value === 'col-2' && wn % 3 === 2) win = true;
                        if (bet.value === 'col-3' && wn % 3 === 0) win = true;
                    }
                    payoutMultiplier = 2;
                    break;
            }

            if (win) {
                // Return original bet + winnings
                totalWinnings += bet.amount + (bet.amount * payoutMultiplier);
            }
        });

        return totalWinnings;
    }
};
