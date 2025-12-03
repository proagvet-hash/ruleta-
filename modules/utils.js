export const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Secure random for game logic
    getSecureRandomInt(min, max) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const range = max - min + 1;
        return min + (array[0] % range);
    },

    storage: {
        get(key, defaultValue = null) {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : defaultValue;
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    },

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
