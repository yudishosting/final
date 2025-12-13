class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.playlistToggleBtn = document.getElementById('playlistToggleBtn');
        this.playlistPanel = document.getElementById('playlistPanel');
        this.songListElement = document.getElementById('songList');
        this.playlistBackdrop = document.getElementById('playlistBackdrop');
        this.progressBar = document.getElementById('progressBar');
        this.currentTimeDisplay = document.getElementById('currentTime');
        this.durationDisplay = document.getElementById('duration');
        this.songTitle = document.getElementById('songTitle');
        this.artist = document.getElementById('artist');
        this.albumArt = document.getElementById('albumArt');
        this.bgBlur1 = document.getElementById('backgroundBlur');
        this.bgBlur2 = document.getElementById('backgroundBlur2');
        this.activeBlur = 1;
        this.currentLyric = document.getElementById('currentLyric');
        this.nextLyric = document.getElementById('nextLyric');
        this.futureLyric = document.getElementById('futureLyric');
        this.headerTitle = document.querySelector('.header-title');
        this.playlistTitle = document.querySelector('.playlist-header h3');

        // Menu elements
        this.menuBtn = document.getElementById('menuBtn');
        this.menuPanel = document.getElementById('menuPanel');
        this.menuBackdrop = document.getElementById('menuBackdrop');
        this.closeMenuBtn = document.getElementById('closeMenuBtn');

        // Sleep Timer elements
        this.sleepTimerMenuItem = document.getElementById('sleepTimerMenuItem');
        this.sleepTimerModal = document.getElementById('sleepTimerModal');
        this.closeSleepTimer = document.getElementById('closeSleepTimer');
        this.timerButtons = document.querySelectorAll('.timer-btn');
        this.customMinutesInput = document.getElementById('customMinutes');
        this.setCustomTimerBtn = document.getElementById('setCustomTimer');
        this.timerStatus = document.getElementById('timerStatus');
        this.cancelTimerBtn = document.getElementById('cancelTimer');

        // About elements
        this.aboutMenuItem = document.getElementById('aboutMenuItem');
        this.aboutModal = document.getElementById('aboutModal');
        this.closeAbout = document.getElementById('closeAbout');

        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.originalPlaylist = [];
        this.playlist = [];
        this.isShuffled = false;
        this.lyrics = [];
        this.currentLyricIndex = 0;
        this.audio.volume = 1;
        
        // Sleep timer variables
        this.sleepTimerTimeout = null;
        this.sleepTimerEndTime = null;
        this.sleepTimerInterval = null;

        this.init();
    }

    async init() {
        await this.loadConfig();
        this.setupEventListeners();
        if (this.playlist.length > 0) {
            this.currentSongIndex = 0;
            this.loadSong(this.currentSongIndex);
            this.renderPlaylist();
            this.bgBlur1.style.backgroundImage = `url(${this.playlist[this.currentSongIndex].albumArt})`;
            this.bgBlur1.classList.add('active');
        } else {
            console.warn('Playlist kosong.');
        }
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            this.originalPlaylist = config.playlist || config.songs || [];
            this.playlist = [...this.originalPlaylist];
            if (config.playlistName && this.playlistTitle) {
                this.playlistTitle.textContent = config.playlistName;
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.originalPlaylist = [];
            this.playlist = [];
        }
    }

    setupEventListeners() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.playlistToggleBtn.addEventListener('click', () => this.togglePlaylistPanel());
        this.playlistBackdrop.addEventListener('click', () => this.togglePlaylistPanel());

        // Menu event listeners
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        this.closeMenuBtn.addEventListener('click', () => this.toggleMenu());
        this.menuBackdrop.addEventListener('click', () => this.toggleMenu());

        // Sleep Timer event listeners
        this.sleepTimerMenuItem.addEventListener('click', () => {
            this.toggleMenu();
            this.openSleepTimer();
        });
        this.closeSleepTimer.addEventListener('click', () => this.closeSleepTimerModal());
        this.sleepTimerModal.addEventListener('click', (e) => {
            if (e.target === this.sleepTimerModal) this.closeSleepTimerModal();
        });

        this.timerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const minutes = parseInt(btn.dataset.minutes);
                this.setSleepTimer(minutes);
            });
        });

        this.setCustomTimerBtn.addEventListener('click', () => {
            const minutes = parseInt(this.customMinutesInput.value);
            if (minutes && minutes > 0 && minutes <= 180) {
                this.setSleepTimer(minutes);
                this.customMinutesInput.value = '';
            } else {
                alert('Masukkan waktu antara 1-180 menit');
            }
        });

        this.cancelTimerBtn.addEventListener('click', () => this.cancelSleepTimer());

        // About event listeners
        this.aboutMenuItem.addEventListener('click', () => {
            this.toggleMenu();
            this.openAbout();
        });
        this.closeAbout.addEventListener('click', () => this.closeAboutModal());
        this.aboutModal.addEventListener('click', (e) => {
            if (e.target === this.aboutModal) this.closeAboutModal();
        });

        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.progressBar.addEventListener('input', () => this.seek());

        const startButton = document.getElementById('startButton');
        const welcomePanel = document.getElementById('welcomePanel');

        startButton.addEventListener('click', async () => {
            welcomePanel.style.display = 'none';
            try {
                await this.audio.play();
                this.isPlaying = true;
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } catch (err) {
                console.warn('Autoplay gagal, tunggu interaksi user.', err);
            }
        });

        document.addEventListener('click', async () => {
            if (!this.isPlaying && welcomePanel.style.display === 'none') {
                try {
                    await this.audio.play();
                    this.isPlaying = true;
                    this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } catch (err) {
                    // ignore
                }
            }
        }, { once: true });
    }

    // Menu methods
    toggleMenu() {
        this.menuPanel.classList.toggle('active');
        this.menuBackdrop.classList.toggle('active');
    }

    // Sleep Timer methods
    openSleepTimer() {
        this.sleepTimerModal.classList.add('active');
    }

    closeSleepTimerModal() {
        this.sleepTimerModal.classList.remove('active');
    }

    setSleepTimer(minutes) {
        this.cancelSleepTimer();
        
        const milliseconds = minutes * 60 * 1000;
        this.sleepTimerEndTime = Date.now() + milliseconds;
        
        this.sleepTimerTimeout = setTimeout(() => {
            this.audio.pause();
            this.isPlaying = false;
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.timerStatus.textContent = 'Sleep timer selesai - Musik dihentikan';
            this.cancelTimerBtn.style.display = 'none';
            
            setTimeout(() => {
                this.timerStatus.classList.remove('active');
            }, 5000);
        }, milliseconds);

        this.updateTimerDisplay();
        this.sleepTimerInterval = setInterval(() => this.updateTimerDisplay(), 1000);
        
        this.timerStatus.classList.add('active');
        this.cancelTimerBtn.style.display = 'block';
    }

    updateTimerDisplay() {
        if (!this.sleepTimerEndTime) return;
        
        const remaining = this.sleepTimerEndTime - Date.now();
        if (remaining <= 0) {
            this.cancelSleepTimer();
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        this.timerStatus.textContent = `Sleep timer aktif: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    cancelSleepTimer() {
        if (this.sleepTimerTimeout) {
            clearTimeout(this.sleepTimerTimeout);
            this.sleepTimerTimeout = null;
        }
        if (this.sleepTimerInterval) {
            clearInterval(this.sleepTimerInterval);
            this.sleepTimerInterval = null;
        }
        this.sleepTimerEndTime = null;
        this.timerStatus.classList.remove('active');
        this.cancelTimerBtn.style.display = 'none';
    }

    // About methods
    openAbout() {
        this.aboutModal.classList.add('active');
    }

    closeAboutModal() {
        this.aboutModal.classList.remove('active');
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);

        if (this.isShuffled) {
            const currentSong = this.playlist[this.currentSongIndex];
            const nonCurrentSongs = this.playlist.filter((_, index) => index !== this.currentSongIndex);
            this.playlist = [currentSong, ...this.shuffleArray(nonCurrentSongs)];
            this.currentSongIndex = 0;
        } else {
            const currentSong = this.playlist[this.currentSongIndex];
            this.playlist = [...this.originalPlaylist];
            this.currentSongIndex = this.playlist.findIndex(song => 
                song.title === currentSong.title && song.artist === currentSong.artist
            );
            if (this.currentSongIndex === -1) this.currentSongIndex = 0;
        }
        this.renderPlaylist();
    }

    handleSongEnd() {
        this.playNext();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    togglePlaylistPanel() {
        this.playlistPanel.classList.toggle('active');
        this.playlistBackdrop.classList.toggle('active');
    }

    renderPlaylist() {
        this.songListElement.innerHTML = '';
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.classList.add('song-item');
            if (index === this.currentSongIndex) {
                item.classList.add('active');
            }
            item.dataset.index = index;
            item.innerHTML = `
                <div class="song-info">
                    <div class="title">${song.title || 'Unknown Title'}</div>
                    <div class="artist">${song.artist || 'Unknown Artist'}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                this.selectSong(index);
                this.togglePlaylistPanel();
            });
            this.songListElement.appendChild(item);
        });
    }

    selectSong(index) {
        this.loadSong(index);
        this.renderPlaylist();
        if (!this.isPlaying) {
            this.togglePlay();
        }
    }

    loadSong(index) {
        if (!this.playlist || this.playlist.length === 0) return;

        this.currentSongIndex = ((index % this.playlist.length) + this.playlist.length) % this.playlist.length;
        const song = this.playlist[this.currentSongIndex];

        const path = song.path || song.mp3 || song.mp3Path || song.file || '';
        const title = song.title || 'Unknown Title';
        const artist = song.artist || 'Unknown Artist';
        const albumArt = song.albumArt || song.artistPhoto || song.cover || 'placeholder.jpg';
        const lyricsPath = song.lyricsPath || song.lyric || song.lyrics || song.lyricPath || '';

        this.audio.src = path;
        this.songTitle.textContent = title;
        this.artist.textContent = artist;
        this.albumArt.src = albumArt;

        if (this.headerTitle) {
            this.headerTitle.textContent = title;
        }

        if (this.activeBlur === 1) {
            this.bgBlur2.style.backgroundImage = `url(${albumArt})`;
            this.bgBlur2.classList.add('active');
            this.bgBlur1.classList.remove('active');
            this.activeBlur = 2;
        } else {
            this.bgBlur1.style.backgroundImage = `url(${albumArt})`;
            this.bgBlur1.classList.add('active');
            this.bgBlur2.classList.remove('active');
            this.activeBlur = 1;
        }

        this.lyrics = [];
        this.currentLyricIndex = 0;
        this.currentLyric.textContent = 'Memuat lirik...';
        this.nextLyric.textContent = '';
        this.futureLyric.textContent = '';

        this.renderPlaylist();

        this.loadLyrics(lyricsPath).catch(err => {
            console.error('loadLyrics error:', err);
            this.currentLyric.textContent = 'Lirik tidak tersedia.';
            this.nextLyric.textContent = '';
            this.futureLyric.textContent = '';
        });

        if (this.isPlaying) {
            this.audio.play().catch(() => {});
        }
    }

    async loadLyrics(lyricsPath) {
        if (!lyricsPath) {
            this.currentLyric.textContent = 'Lirik tidak tersedia.';
            this.nextLyric.textContent = '';
            this.futureLyric.textContent = '';
            return;
        }

        if (lyricsPath.trim().toLowerCase().endsWith('.js')) {
            try { delete window.__loaded_lyrics__; } catch (e) {}
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = lyricsPath;
                script.async = true;

                const hadLyrics = typeof window.lyrics !== 'undefined';
                const oldLyricsValue = window.lyrics;

                script.onload = () => {
                    try {
                        let loaded = window.lyrics || window.__loaded_lyrics__;
                        if (!loaded) {
                            reject(new Error('Variabel lirik tidak ditemukan.'));
                            return;
                        }
                        this.lyrics = Array.isArray(loaded) ? loaded.map(it => ({
                            time: Number(it.time),
                            text: String(it.text)
                        })) : [];
                        this.currentLyricIndex = 0;
                        this.updateLyrics();
                        if (!hadLyrics) {
                            try { delete window.lyrics; } catch (e) {}
                        } else {
                            window.lyrics = oldLyricsValue;
                        }
                        script.remove();
                        resolve();
                    } catch (err) {
                        this.clearLyricsDisplay();
                        reject(err);
                    }
                };
                script.onerror = () => {
                    reject(new Error('Gagal memuat file lyrics .js'));
                };
                document.body.appendChild(script);
            });
        } else {
            try {
                const response = await fetch(lyricsPath);
                const lrcText = await response.text();
                this.lyrics = this.parseLRC(lrcText);
                this.currentLyricIndex = 0;
                if (!this.lyrics || this.lyrics.length === 0) {
                    this.currentLyric.textContent = 'Lirik kosong.';
                } else {
                    this.updateLyrics();
                }
            } catch (err) {
                this.currentLyric.textContent = 'Error saat mengambil lirik.';
            }
        }
    }

    clearLyricsDisplay() {
        this.lyrics = [];
        this.currentLyric.textContent = 'Lirik tidak tersedia.';
        this.nextLyric.textContent = '';
        this.futureLyric.textContent = '';
    }

    parseLRC(lrcText) {
        const lines = lrcText.split(/\r?\n/);
        const lyrics = [];
        const timeTagRegex = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\](.*)/;
        
        for (let raw of lines) {
            raw = raw.trim();
            if (!raw) continue;
            
            let m = raw.match(timeTagRegex);
            if (m) {
                const minutes = parseInt(m[1], 10);
                const seconds = parseInt(m[2], 10);
                let ms = 0;
                if (m[3]) {
                    let part = m[3];
                    if (part.length === 1) part = part + "00";
                    else if (part.length === 2) part = part + "0";
                    else part = part.slice(0, 3);
                    ms = parseInt(part, 10);
                }
                const time = minutes * 60 + seconds + ms / 1000;
                const text = (m[4] || '').trim();
                lyrics.push({ time, text });
            }
        }
        return lyrics.sort((a, b) => a.time - b.time);
    }

    updateLyrics() {
        if (!this.lyrics || this.lyrics.length === 0) {
            this.currentLyric.textContent = 'Lirik tidak tersedia.';
            this.nextLyric.textContent = '';
            this.futureLyric.textContent = '';
            return;
        }
        
        const currentTime = this.audio.currentTime;
        let idx = 0;
        
        for (let i = 0; i < this.lyrics.length; i++) {
            if (this.lyrics[i].time <= currentTime) {
                idx = i;
            } else {
                break;
            }
        }
        
        if (idx !== this.currentLyricIndex || this.currentLyric.textContent === 'Memuat lirik...') {
            this.currentLyricIndex = idx;
            let currentText = this.lyrics[this.currentLyricIndex]?.text || '';
            
            if (this.currentLyricIndex === 0 && (currentText === '' || currentText === undefined) && this.lyrics.length > 0) {
                currentText = this.lyrics[0].text || '[Instrumental/Intro]';
            }
            
            this.currentLyric.textContent = currentText;
            this.nextLyric.textContent = this.lyrics[this.currentLyricIndex + 1]?.text || '';
            this.futureLyric.textContent = this.lyrics[this.currentLyricIndex + 2]?.text || '';
            this.currentLyric.className = 'active-lyric';
            this.nextLyric.className = 'upcoming-lyric';
            this.futureLyric.className = 'upcoming-lyric';
        }
    }

    togglePlay() {
        if (!this.playlist || this.playlist.length === 0) return;
        
        if (this.isPlaying) {
            this.audio.pause();
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audio.play().catch(() => {});
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        this.isPlaying = !this.isPlaying;
    }

    playPrevious() {
        if (!this.playlist || this.playlist.length === 0) return;
        
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            this.updateLyrics();
            return;
        }
        
        this.currentSongIndex = (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadSong(this.currentSongIndex);
    }

    playNext() {
        if (!this.playlist || this.playlist.length === 0) return;
        
        if (this.currentSongIndex === this.playlist.length - 1) {
            this.audio.currentTime = 0;
            this.progressBar.value = 0;
            if (this.isPlaying) {
                this.togglePlay();
            }
            return;
        }
        
        this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
        this.loadSong(this.currentSongIndex);
    }

    updateProgress() {
        if (!this.audio.duration || isNaN(this.audio.duration)) return;
        
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.value = isFinite(progress) ? progress : 0;
        this.currentTimeDisplay.textContent = this.formatTime(this.audio.currentTime);
        this.updateLyrics();
    }

    updateDuration() {
        if (!this.audio.duration || isNaN(this.audio.duration)) {
            this.durationDisplay.textContent = '0:00';
            return;
        }
        this.durationDisplay.textContent = this.formatTime(this.audio.duration);
    }

    seek() {
        if (!this.audio.duration || isNaN(this.audio.duration)) return;
        
        const time = (this.progressBar.value / 100) * this.audio.duration;
        this.audio.currentTime = time;
        this.updateLyrics();
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds) || seconds === Infinity) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});