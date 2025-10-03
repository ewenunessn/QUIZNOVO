// Utilitário para reproduzir sons sintéticos simples e agradáveis
// Funciona tanto no mobile quanto na web

class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    // Inicializa o contexto de áudio (necessário para web)
    init() {
        if (this.initialized) return;

        try {
            // Verifica se está no ambiente web
            if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
            }
        } catch (error) {
            console.log('Audio context não disponível:', error);
        }
    }

    // Som de resposta correta - acorde ascendente agradável
    playCorrect() {
        this.init();
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Três notas ascendentes (C5, E5, G5 - acorde de Dó maior)
        const frequencies = [523.25, 659.25, 783.99];

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine'; // Som suave

            // Envelope ADSR suave
            const startTime = now + (index * 0.08);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    // Som de resposta incorreta - duas notas descendentes suaves
    playIncorrect() {
        this.init();
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;

        // Duas notas descendentes (E4, C4)
        const frequencies = [329.63, 261.63];

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine'; // Som suave

            // Envelope ADSR suave
            const startTime = now + (index * 0.12);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.35);
        });
    }

    // Som de clique suave para botões
    playClick() {
        this.init();
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }

    // Som de whoosh para ícone aparecendo
    playWhoosh() {
        try {
            this.init();
            if (!this.audioContext) return;

            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.2);

            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

            oscillator.start(now);
            oscillator.stop(now + 0.2);
        } catch (error) {
            console.log('Erro ao reproduzir whoosh:', error);
        }
    }

    // Som de ding para título
    playDing() {
        try {
            this.init();
            if (!this.audioContext) return;

            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = 880;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

            oscillator.start(now);
            oscillator.stop(now + 0.4);
        } catch (error) {
            console.log('Erro ao reproduzir ding:', error);
        }
    }

    // Som de sweep para barra de progresso
    playSweep() {
        try {
            this.init();
            if (!this.audioContext) return;

            const now = this.audioContext.currentTime;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.6);

            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.setValueAtTime(0.08, now + 0.5);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

            oscillator.start(now);
            oscillator.stop(now + 0.6);
        } catch (error) {
            console.log('Erro ao reproduzir sweep:', error);
        }
    }

    // Som de fanfarra para prêmio
    playFanfare() {
        try {
            this.init();
            if (!this.audioContext) return;

            const now = this.audioContext.currentTime;
            
            // Sequência de notas alegres (C5, E5, G5, C6)
            const frequencies = [523.25, 659.25, 783.99, 1046.50];

            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const startTime = now + (index * 0.1);
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

                oscillator.start(startTime);
                oscillator.stop(startTime + 0.3);
            });
        } catch (error) {
            console.log('Erro ao reproduzir fanfarra:', error);
        }
    }
}

// Exporta uma instância única
export default new SoundEffects();
