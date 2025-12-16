import { Utils } from './utils.js';

export const Roulette = {
    // American Roulette Sequence
    numbers: [
        0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1,
        '00', 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
    ],

    colors: {
        0: 'green', '00': 'green',
        1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black',
        7: 'red', 8: 'black', 9: 'red', 10: 'black', 11: 'black', 12: 'red',
        13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red',
        19: 'red', 20: 'black', 21: 'red', 22: 'black', 23: 'red', 24: 'black',
        25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red',
        31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red'
    },

    spin(forcedNumber = null) {
        let winningNumber;
        let randomIndex;

        if (forcedNumber !== null && forcedNumber !== undefined) {
            // Convert string number to integer/string matching the array
            // Check if forcedNumber is '00' or '0' or regular number
            const target = forcedNumber.toString() === '00' ? '00' : parseInt(forcedNumber);

            randomIndex = this.numbers.findIndex(n => n === target);
            if (randomIndex === -1) {
                console.warn(`Forced number ${forcedNumber} not found in wheel. Using random.`);
                randomIndex = Utils.getSecureRandomInt(0, this.numbers.length - 1);
            }
        } else {
            randomIndex = Utils.getSecureRandomInt(0, this.numbers.length - 1);
        }

        winningNumber = this.numbers[randomIndex];

        // Calculate angle
        // Each segment is 360 / 38 degrees
        // We want to land on the center of the segment
        const segmentAngle = 360 / 38;
        // The wheel rotates counter-clockwise usually, or we rotate the wheel container.
        // If index 0 is at 0 degrees (top), then index 1 is at -segmentAngle, etc.
        // We add extra rotations for effect (e.g. 5 full spins)
        const baseRotation = 360 * 5;
        const targetRotation = baseRotation + (randomIndex * segmentAngle);

        return {
            number: winningNumber,
            color: this.colors[winningNumber],
            rotation: targetRotation, // Degrees to rotate the wheel element
            index: randomIndex
        };
    },

    getColor(number) {
        return this.colors[number];
    },

    isRed(number) { return this.colors[number] === 'red'; },
    isBlack(number) { return this.colors[number] === 'black'; },
    isEven(number) { return typeof number === 'number' && number !== 0 && number % 2 === 0; },
    isOdd(number) { return typeof number === 'number' && number !== 0 && number % 2 !== 0; },
    isHigh(number) { return typeof number === 'number' && number >= 19 && number <= 36; },
    isLow(number) { return typeof number === 'number' && number >= 1 && number <= 18; }
};
