// Background Music Manager
class MusicManager {
    constructor() {
        this.tracks = [
            'https://cdn.pixabay.com/download/audio/2022/03/10/audio_4a3b9a8c6e.mp3',
            'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
            'https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3',
            'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c6b3f7e0.mp3',
            'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1718ab41b.mp3'
        ];
        this.currentTrackIndex = 0;
        this.audio = null;
        this.isPlaying = false;
        this.musicButton = null;
        this.musicIcon = null;
        this.hasInteracted = false;

        this.init();
    }

    init() {
        // Create audio element
        this.audio = document.createElement('audio');
        this.audio.id = 'bg-music';
        this.audio.volume = 0.3;
        this.audio.preload = 'auto';
        document.body.appendChild(this.audio);

        // Create music control button
        this.musicButton = document.createElement('button');
        this.musicButton.id = 'music-toggle';
        this.musicButton.className = 'music-control';
        this.musicButton.innerHTML = '<span id="music-icon">🎵</span>';
        this.musicButton.title = 'Click para activar música';
        document.body.appendChild(this.musicButton);

        this.musicIcon = document.getElementById('music-icon');

        // Event listeners
        this.musicButton.addEventListener('click', () => this.toggle());
        this.audio.addEventListener('ended', () => this.playNext());
        this.audio.addEventListener('error', () => this.playNext());

        // Load first track
        this.loadTrack(0);

        // Enable on first interaction
        const enableOnInteraction = () => {
            if (!this.hasInteracted) {
                this.hasInteracted = true;
                this.musicButton.title = 'Click para reproducir música';
            }
        };

        document.addEventListener('click', enableOnInteraction, { once: true });
    }

    loadTrack(index) {
        this.currentTrackIndex = index % this.tracks.length;
        this.audio.src = this.tracks[this.currentTrackIndex];
        this.audio.load();
    }

    play() {
        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.musicIcon.textContent = '🔊';
                this.musicButton.title = 'Click para pausar música';
            }).catch(err => {
                console.log('Error reproduciendo:', err);
                this.musicIcon.textContent = '❌';
                this.isPlaying = false;
            });
        }
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.musicIcon.textContent = '🔇';
        this.musicButton.title = 'Click para reproducir música';
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    playNext() {
        this.loadTrack(this.currentTrackIndex + 1);
        if (this.isPlaying) {
            setTimeout(() => this.play(), 100);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.musicManager = new MusicManager();
});
