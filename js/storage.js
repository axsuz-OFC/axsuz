// ===== ImgBB API Key =====
const IMGBB_API_KEY = 'YOUR_IMGBB_KEY_HERE';

const AxsuzStorage = {
    getUsers: () => JSON.parse(localStorage.getItem('axsuz_users') || '[]'),
    saveUsers: (users) => localStorage.setItem('axsuz_users', JSON.stringify(users)),
    
    register: (username, email, password) => {
        const users = AxsuzStorage.getUsers();
        if (users.find(u => u.email === email)) return { success: false, message: 'Email already exists!' };
        const user = { id: Date.now(), username, email, password, createdAt: new Date().toISOString() };
        users.push(user);
        AxsuzStorage.saveUsers(users);
        return { success: true, user };
    },
    
    login: (email, password) => {
        const users = AxsuzStorage.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('axsuz_user', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid email or password!' };
    },
    
    logout: () => localStorage.removeItem('axsuz_user'),
    getUser: () => JSON.parse(localStorage.getItem('axsuz_user') || 'null'),
    isLoggedIn: () => !!localStorage.getItem('axsuz_user'),
    
    getPins: () => JSON.parse(localStorage.getItem('axsuz_pins') || '[]'),
    savePins: (pins) => localStorage.setItem('axsuz_pins', JSON.stringify(pins)),
    
    addPin: (title, description, imageUrl, deleteUrl = '') => {
        const user = AxsuzStorage.getUser();
        if (!user) return { success: false, message: 'Please login first!' };
        const pins = AxsuzStorage.getPins();
        const pin = { id: Date.now(), userId: user.id, username: user.username, title, description, image: imageUrl, deleteUrl, likes: 0, likedBy: [], createdAt: new Date().toISOString() };
        pins.unshift(pin);
        AxsuzStorage.savePins(pins);
        return { success: true, pin };
    },
    
    deletePin: (pinId) => {
        const user = AxsuzStorage.getUser();
        if (!user) return false;
        let pins = AxsuzStorage.getPins();
        pins = pins.filter(p => !(p.id === pinId && p.userId === user.id));
        AxsuzStorage.savePins(pins);
        return true;
    },
    
    toggleLike: (pinId) => {
        const user = AxsuzStorage.getUser();
        if (!user) return false;
        const pins = AxsuzStorage.getPins();
        const pin = pins.find(p => p.id === pinId);
        if (!pin) return false;
        pin.likedBy = pin.likedBy || [];
        const idx = pin.likedBy.indexOf(user.id);
        if (idx > -1) { pin.likedBy.splice(idx, 1); pin.likes = Math.max(0, pin.likes - 1); }
        else { pin.likedBy.push(user.id); pin.likes++; }
        AxsuzStorage.savePins(pins);
        return true;
    },
    
    getSaved: () => JSON.parse(localStorage.getItem('axsuz_saved') || '[]'),
    toggleSave: (pinId) => {
        const user = AxsuzStorage.getUser();
        if (!user) return false;
        let saved = AxsuzStorage.getSaved();
        const idx = saved.indexOf(pinId);
        if (idx > -1) saved.splice(idx, 1);
        else saved.push(pinId);
        localStorage.setItem('axsuz_saved', JSON.stringify(saved));
        return true;
    },
    
    getLogo: () => localStorage.getItem('axsuz_logo') || 'images/logo.jpg',
    saveLogo: (base64) => localStorage.setItem('axsuz_logo', base64),
    resetLogo: () => localStorage.removeItem('axsuz_logo'),
    
    uploadToImgBB: async (file) => {
        try {
            const base64 = await fileToBase64(file);
            const base64Clean = base64.split(',')[1];
            const formData = new FormData();
            formData.append('key', IMGBB_API_KEY);
            formData.append('image', base64Clean);
            const response = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.success) return { success: true, url: data.data.url, deleteUrl: data.data.delete_url };
            return { success: false, message: data.error?.message || 'Upload failed' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};