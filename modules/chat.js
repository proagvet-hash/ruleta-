import { Utils } from './utils.js';

export const Chat = {
    messages: [
        "¡Vamos rojo!",
        "Hoy es mi día de suerte",
        "¿Alguien ha ganado el Jackpot?",
        "Buena suerte a todos",
        "Uff, casi gano",
        "El 7 es el número mágico",
        "Apostando todo al negro...",
        "¡Qué buena racha!",
        "Necesito recuperar mis fichas",
        "Jajaja, increíble"
    ],

    getRandomMessage() {
        return this.messages[Utils.getRandomInt(0, this.messages.length - 1)];
    },

    init(container) {
        this.container = container;
    },

    addMessage(name, text, isSystem = false) {
        if (!this.container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isSystem ? 'system' : ''}`;

        if (isSystem) {
            msgDiv.innerHTML = `<span class="msg-text">${text}</span>`;
        } else {
            msgDiv.innerHTML = `<span class="msg-author">${name}:</span> <span class="msg-text">${text}</span>`;
        }

        this.container.appendChild(msgDiv);
        this.container.scrollTop = this.container.scrollHeight;
    }
};
