function renderNavbar() {
    const user = AxsuzStorage.getUser();
    const logo = AxsuzStorage.getLogo();
    const nav = document.getElementById('navbar');
    if (!nav) return;
    nav.innerHTML = `
        <a href="home.html" class="logo">
            <img src="${logo}" alt="Axsuz" class="logo-img" onerror="this.src='images/logo.jpg'">
            <span class="logo-text">𝐀𝐗𝐒𝐔𝐙</span>
        </a>
        <div class="nav-links">
            ${user ? `
                <a href="upload.html">＋ 𝐂𝐫𝐞𝐚𝐭𝐞</a>
                <a href="profile.html">👤</a>
                <a href="#" onclick="handleLogout();return false;">𝐋𝐨𝐠𝐨𝐮𝐭</a>
            ` : `
                <a href="login.html">𝐋𝐨𝐠𝐢𝐧</a>
                <a href="register.html" class="btn-nav">𝐒𝐢𝐠𝐧 𝐔𝐩</a>
            `}
        </div>
    `;
}

function renderBottomNav() {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;
    const page = window.location.pathname.split('/').pop() || 'home.html';
    const items = [
        { href: 'home.html', icon: '🏠', label: '𝐇𝐨𝐦𝐞' },
        { href: 'search.html', icon: '🔍', label: '𝐒𝐞𝐚𝐫𝐜𝐡' },
        { href: 'saved.html', icon: '🔖', label: '𝐒𝐚𝐯𝐞𝐝' },
        { href: 'profile.html', icon: '👤', label: '𝐏𝐫𝐨𝐟𝐢𝐥𝐞' },
        { href: 'upload.html', icon: '➕', label: '𝐂𝐫𝐞𝐚𝐭𝐞' }
    ];
    nav.innerHTML = items.map(item => `
        <a href="${item.href}" class="nav-item ${page === item.href ? 'active' : ''}">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
        </a>
    `).join('');
}

function renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    footer.innerHTML = `
        <div class="bottom-footer">
            <p class="powered-by">© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀxsᴜᴢ ᴏꜰᴄ</p>
            <p class="server-status">🟢 ꜱᴇʀᴠᴇʀ ɪꜱ ᴏɴʟɪɴᴇ</p>
            <div class="owner-box">
                <p>Owner name : <span>Pramod Adithya</span></p>
                <p>Age : <span>18 years</span></p>
                <p>Contact : <span>+94704536039</span></p>
            </div>
        </div>
    `;
}

function initMusic() {
    const musicBar = document.getElementById('musicBar');
    if (!musicBar) return;
    const audio = document.createElement('audio');
    audio.id = 'bgMusic';
    audio.loop = true;
    audio.src = 'music/bg.mp3';
    document.body.appendChild(audio);
    
    const playBtn = document.getElementById('musicPlayBtn');
    const stopBtn = document.getElementById('musicStopBtn');
    const title = document.getElementById('musicTitle');
    const progress = document.querySelector('.music-progress');
    
    const wasPlaying = sessionStorage.getItem('axsuz_music_playing');
    const savedTime = sessionStorage.getItem('axsuz_music_time');
    if (savedTime) audio.currentTime = parseFloat(savedTime);
    
    if (wasPlaying === 'true') {
        audio.play().then(() => {
            playBtn.innerHTML = '❚❚';
            playBtn.classList.add('playing');
            progress.classList.add('playing');
            title.textContent = '🎵 𝐏𝐥𝐚𝐲𝐢𝐧𝐠';
        }).catch(() => {});
    }
    
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.innerHTML = '❚❚';
                playBtn.classList.add('playing');
                progress.classList.add('playing');
                title.textContent = '🎵 𝐏𝐥𝐚𝐲𝐢𝐧𝐠';
                sessionStorage.setItem('axsuz_music_playing', 'true');
            }).catch(() => alert('Music file not found! Add music/bg.mp3'));
        } else {
            audio.pause();
            playBtn.innerHTML = '▶';
            playBtn.classList.remove('playing');
            progress.classList.remove('playing');
            title.textContent = '⏸ 𝐏𝐚𝐮𝐬𝐞𝐝';
            sessionStorage.setItem('axsuz_music_playing', 'false');
        }
    });
    
    stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        playBtn.innerHTML = '▶';
        playBtn.classList.remove('playing');
        progress.classList.remove('playing');
        title.textContent = '⏹ 𝐒𝐭𝐨𝐩𝐩𝐞𝐝';
        sessionStorage.setItem('axsuz_music_playing', 'false');
        sessionStorage.setItem('axsuz_music_time', '0');
    });
    
    setInterval(() => {
        if (!audio.paused) sessionStorage.setItem('axsuz_music_time', audio.currentTime);
    }, 1000);
}

function handleLogout() {
    if (confirm('Logout?')) {
        AxsuzStorage.logout();
        window.location.href = 'index.html';
    }
}

function renderPins(containerId, pins) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (pins.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📸</div>
                <p>𝐍𝐨 𝐩𝐢𝐧𝐬 𝐲𝐞𝐭<br>
                <a href="upload.html" style="color:#ff0055;">Create the first one!</a></p>
            </div>`;
        return;
    }
    const user = AxsuzStorage.getUser();
    container.innerHTML = pins.map(pin => `
        <div class="pin" onclick="window.open('${pin.image}', '_blank')">
            <img src="${pin.image}" alt="" loading="lazy">
            <div class="pin-actions">
                <button onclick="event.stopPropagation(); likePin(${pin.id})">
                    ${pin.likedBy && user && pin.likedBy.includes(user.id) ? '❤️' : '🤍'} ${pin.likes || 0}
                </button>
                <button onclick="event.stopPropagation(); savePin(${pin.id})">💾</button>
                ${user && pin.userId === user.id ? `<button onclick="event.stopPropagation(); deletePin(${pin.id})" style="color:#ff4444;border-color:#ff4444;">🗑️</button>` : ''}
            </div>
            <div class="pin-info">
                <h4>${pin.title}</h4>
                <small>@${pin.username}</small>
            </div>
        </div>
    `).join('');
}

function likePin(id) {
    if (!AxsuzStorage.getUser()) { alert('Please login first!'); window.location.href = 'login.html'; return; }
    AxsuzStorage.toggleLike(id);
    location.reload();
}

function savePin(id) {
    if (!AxsuzStorage.getUser()) { alert('Please login first!'); window.location.href = 'login.html'; return; }
    AxsuzStorage.toggleSave(id);
    alert('Saved!');
}

function deletePin(id) {
    if (confirm('Delete this pin?')) {
        AxsuzStorage.deletePin(id);
        location.reload();
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderBottomNav();
    renderFooter();
    initMusic();
});