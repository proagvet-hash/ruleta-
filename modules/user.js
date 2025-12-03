import { Utils } from './utils.js';

export const User = {
    currentUser: null,

    init() {
        let savedUser = sessionStorage.getItem('currentUser');
        if (!savedUser) {
            // Auto-login as Guest
            const users = Utils.storage.get('users', {});
            if (!users['Guest']) {
                users['Guest'] = {
                    balance: 1000,
                    history: [],
                    created: new Date().toISOString()
                };
                Utils.storage.set('users', users);
            }
            this.currentUser = { username: 'Guest' };
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            this.currentUser = JSON.parse(savedUser);
        }
        this.loadUserData();
    },

    login(username) {
        const users = Utils.storage.get('users', {});
        if (users[username]) {
            this.currentUser = { username };
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.loadUserData();
            return { success: true };
        }
        return { success: false, message: 'Usuario no encontrado' };
    },

    register(username) {
        const users = Utils.storage.get('users', {});
        if (users[username]) {
            return { success: false, message: 'El usuario ya existe' };
        }

        // Initial state
        users[username] = {
            balance: 1000, // Welcome bonus
            history: [],
            created: new Date().toISOString()
        };

        Utils.storage.set('users', users);
        return this.login(username);
    },

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
    },

    loadUserData() {
        if (!this.currentUser) return;
        const users = Utils.storage.get('users', {});
        const userData = users[this.currentUser.username];
        this.currentUser.balance = userData.balance;
        this.currentUser.history = userData.history || [];
    },

    getBalance() {
        return this.currentUser ? this.currentUser.balance : 0;
    },

    updateBalance(amount) {
        if (!this.currentUser) return;
        const users = Utils.storage.get('users', {});
        users[this.currentUser.username].balance += amount;
        this.currentUser.balance = users[this.currentUser.username].balance;
        Utils.storage.set('users', users);
        return this.currentUser.balance;
    },

    addHistory(record) {
        if (!this.currentUser) return;
        const users = Utils.storage.get('users', {});
        const userHistory = users[this.currentUser.username].history || [];

        // Keep last 50 records
        userHistory.unshift(record);
        if (userHistory.length > 50) userHistory.pop();

        users[this.currentUser.username].history = userHistory;
        Utils.storage.set('users', users);
        this.currentUser.history = userHistory;
    }
};
