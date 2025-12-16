export const Camera = {
    modelURL: 'https://teachablemachine.withgoogle.com/models/WZ8-07ZN6/',
    model: null,
    webcam: null,
    maxPredictions: 0,
    isReady: false,
    containerId: 'webcam-container',
    labelId: 'prediction-label',
    lockedPrediction: null,

    // Valid classes must match the Teachable Machine model class names exactly
    validClasses: [
        '#00', '#0', '#1', '#2', '#3', '#4', '#5', '#6', '#7', '#8', '#9', '#10',
        '#11', '#12', '#13', '#14', '#15', '#16', '#17', '#18', '#19', '#20',
        '#21', '#22', '#23', '#24', '#25', '#26', '#27', '#28', '#29', '#30',
        '#31', '#32', '#33', '#34', '#35', '#36'
    ],

    async init() {
        try {
            if (typeof tmImage === 'undefined') {
                console.error("TeachableMachine library not loaded");
                return;
            }

            const modelURL = this.modelURL + "model.json";
            const metadataURL = this.modelURL + "metadata.json";

            this.model = await tmImage.load(modelURL, metadataURL);
            this.maxPredictions = this.model.getTotalClasses();

            const flip = true;
            this.webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
            await this.webcam.setup();
            await this.webcam.play();
            window.requestAnimationFrame(() => this.loop());

            // Append to DOM
            const container = document.getElementById(this.containerId);
            if (container) {
                container.innerHTML = '';
                container.appendChild(this.webcam.canvas);
            }
            this.isReady = true;
            console.log("Camera Model Loaded");
        } catch (error) {
            console.error("Camera initialization failed:", error);
            const container = document.getElementById(this.containerId);
            if (container) {
                container.innerHTML = '<p style="color:white; padding:10px;">Cámara no disponible</p>';
            }
        }
    },

    async loop() {
        if (this.webcam) {
            this.webcam.update();
            // Perform prediction for UI feedback
            if (this.isReady && this.model) {
                await this.updateLabel();
            }
            window.requestAnimationFrame(() => this.loop());
        }
    },

    streakCount: 0,
    lastDetectedClass: null,

    async updateLabel() {
        if (!this.model || !this.webcam) return;

        try {
            const prediction = await this.model.predict(this.webcam.canvas);
            let highest = { className: "", probability: 0 };

            for (let i = 0; i < this.maxPredictions; i++) {
                // Numeric Comparator for Probability
                if (prediction[i].probability > highest.probability) {
                    highest = prediction[i];
                }
            }

            const labelDiv = document.getElementById(this.labelId);
            if (!labelDiv) return;

            // 1. Clean String Format
            const rawClass = highest.className;
            const cleanNumberStr = rawClass.replace('#', '');

            // 2. Numeric Validation (0-36 or 00)
            let isNumericallyValid = false;
            if (cleanNumberStr === '00') {
                isNumericallyValid = true;
            } else {
                const num = parseInt(cleanNumberStr, 10);
                // Check if it is a number and within roulette range [0, 36]
                if (!isNaN(num) && num >= 0 && num <= 36) {
                    isNumericallyValid = true;
                }
            }

            // 3. Stricter Probability Comparator (Lowered to > 0.80 for speed)
            const isHighConfidence = highest.probability > 0.80;

            if (isNumericallyValid && isHighConfidence) {
                // Check Streak
                if (this.lastDetectedClass === cleanNumberStr) {
                    this.streakCount++;
                } else {
                    // New potential number detected
                    this.lastDetectedClass = cleanNumberStr;
                    this.streakCount = 1;
                }
            } else {
                // Lost tracking or low confidence - Decay streak slowly? 
                // Or reset immediately for strictness? Let's reset.
                this.streakCount = 0;
                // Keep lastDetectedClass for reference until new one takes over
            }

            // 4. Update UI based on Streak
            const percentage = (highest.probability * 100).toFixed(1);

            // Lock IMMEDIATELY if we have a valid high confidence detection (Streak >= 1)
            if (this.streakCount >= 1) {
                this.lockedPrediction = this.lastDetectedClass;

                labelDiv.style.color = '#4caf50'; // Green
                labelDiv.textContent = `DETECTADO: ${this.lockedPrediction} (CONFIRMADO)`;
            }
            else if (this.lockedPrediction) {
                // Already locked memory
                labelDiv.style.color = '#29b6f6'; // Blue
                labelDiv.textContent = `MEMORIA: ${this.lockedPrediction}`;
            }
            else {
                // Searching
                labelDiv.style.color = '#ff9800';
                labelDiv.textContent = `Buscando...`;
            }

        } catch (e) {
            // prediction error
        }
    },

    async getPrediction() {
        // Return the locked prediction if available
        if (this.lockedPrediction) {
            return this.lockedPrediction;
        }
        return null;
    },

    reset() {
        this.lockedPrediction = null;
        this.predictionBuffer = []; // Clear buffer
        const labelDiv = document.getElementById(this.labelId);
        if (labelDiv) labelDiv.textContent = "Esperando...";

        // Restore video feed if it was hidden
        const container = document.getElementById(this.containerId);
        if (container && this.webcam && this.webcam.canvas) {
            container.innerHTML = '';
            container.appendChild(this.webcam.canvas);
        }
    },

    showResult(number) {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Determine color for style
        // We know colors from Roulette module but simpler to just pass it or deduce.
        // Let's make it gold/generic or red/black if we want. 
        // For "Elegant", Gold is best.

        container.innerHTML = `
            <div class="result-overlay">
                <div class="result-number-big">${number}</div>
                <div class="result-text-small">GANADOR</div>
            </div>
        `;
    }
};
