// Default password
const ADMIN_PASSWORD = 'admin';

// Check if logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdminPanel();
    }
}

// Login
function login() {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
    } else {
        alert('Невірний пароль!');
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Global data variable
let siteData = null;

// Show admin panel
async function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    await loadAdminData();
}

// Load data from data.json or localStorage
async function loadData() {
    if (!siteData) {
        // First check localStorage for any unsaved changes
        const localData = localStorage.getItem('paintyardData');
        if (localData) {
            siteData = JSON.parse(localData);
            return siteData;
        }
        
        // If no local data, load from data.json
        try {
            const response = await fetch('data.json');
            siteData = await response.json();
            // Save to localStorage for future use
            localStorage.setItem('paintyardData', JSON.stringify(siteData));
        } catch (error) {
            console.error('Error loading data.json:', error);
            siteData = {
                logo: '',
                address: '',
                phones: [],
                aboutText: '',
                brands: [],
                articles: [],
                colors: { headerBg: '#2c3e50', mainBg: '#f4f4f4' }
            };
        }
    }
    return siteData;
}

// Save data - updates the in-memory copy AND localStorage for auto-save
function saveData(data) {
    siteData = data;
    // Also save to localStorage for immediate persistence
    localStorage.setItem('paintyardData', JSON.stringify(data));
    // Auto-download reminder
    showSaveNotification();
}

// Show save notification
function showSaveNotification() {
    const existingNotif = document.getElementById('save-notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notif = document.createElement('div');
    notif.id = 'save-notification';
    notif.className = 'save-notification';
    notif.innerHTML = '✓ Зміни збережено! Не забудьте завантажити data.json для синхронізації.';
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Download data.json file
function downloadDataJson() {
    const data = siteData || JSON.parse(localStorage.getItem('paintyardData'));
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
    URL.revokeObjectURL(url);
    alert('Файл data.json завантажено! Тепер закомітьте його в репозиторій GitHub.');
}

// Convert image file to base64
function convertImageToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Upload image helper
function uploadImage(inputElement, callback) {
    const file = inputElement.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Будь ласка, виберіть файл зображення');
        return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Розмір файлу не повинен перевищувати 2MB');
        return;
    }
    
    convertImageToBase64(file, callback);
}

// Load admin data into form
async function loadAdminData() {
    const data = await loadData();

    // Page background color
    document.getElementById('page-bg-color').value = data.pageBgColor || data.colors.mainBg || '#e6e6e6';

    // Logo
    document.getElementById('logo-input').value = data.logo || '';
    if (data.logoSize) {
        document.getElementById('logo-width').value = data.logoSize.width || 'auto';
        document.getElementById('logo-height').value = data.logoSize.height || '50px';
    }

    // Header settings
    document.getElementById('header-top-height').value = data.headerSizes?.headerTopHeight || '15px';
    document.getElementById('header-color').value = data.colors.headerBg || '#efc3c3';
    document.getElementById('menu-font-size').value = data.menuFontSize || '14px';
    document.getElementById('text-menu-color').value = data.textColors?.menu || '#ffffff';
    document.getElementById('button-font-size').value = data.buttonFontSize || '14px';
    document.getElementById('button-text-color').value = data.buttonTextColor || '#ffffff';

    // About section
    document.getElementById('about-input').value = data.aboutText || '';
    document.getElementById('text-about-color').value = data.textColors?.about || '#333333';

    // Brands section
    document.getElementById('text-brands-color').value = data.textColors?.brands || '#333333';

    // Articles section
    document.getElementById('text-articles-color').value = data.textColors?.articles || '#333333';

    // Footer settings
    document.getElementById('address-input').value = data.address || '';
    document.getElementById('address-font-size').value = data.footerSettings?.addressFontSize || '14px';
    document.getElementById('address-color').value = data.footerSettings?.addressColor || '#666666';
    document.getElementById('phones-input').value = data.phones.join('\n');
    document.getElementById('phones-font-size').value = data.footerSettings?.phonesFontSize || '14px';
    document.getElementById('phones-color').value = data.footerSettings?.phonesColor || '#333333';
    document.getElementById('footer-bg-color').value = data.footerSettings?.bgColor || '#2c3e50';
    
    // Show logo preview if exists
    if (data.logo) {
        showImagePreview('logo-preview', data.logo);
    }
    
    // Load section backgrounds
    if (data.sectionBackgrounds) {
        ['about', 'brands', 'articles'].forEach(section => {
            const bgData = data.sectionBackgrounds[section];
            if (bgData) {
                const input = document.getElementById(`${section}-bg-input`);
                const opacity = document.getElementById(`${section}-bg-opacity`);
                const opacityValue = document.getElementById(`${section}-opacity-value`);
                const scale = document.getElementById(`${section}-bg-scale`);
                const scaleValue = document.getElementById(`${section}-scale-value`);
                const posX = document.getElementById(`${section}-bg-posX`);
                const posXValue = document.getElementById(`${section}-posX-value`);
                const posY = document.getElementById(`${section}-bg-posY`);
                const posYValue = document.getElementById(`${section}-posY-value`);
                
                if (input) input.value = bgData.image || '';
                if (opacity) opacity.value = bgData.opacity || 100;
                if (opacityValue) opacityValue.textContent = (bgData.opacity || 100) + '%';
                
                // Load scale and position values
                if (scale) scale.value = bgData.scale || 100;
                if (scaleValue) scaleValue.textContent = (bgData.scale || 100) + '%';
                if (posX) posX.value = bgData.posX || 50;
                if (posXValue) posXValue.textContent = (bgData.posX || 50) + '%';
                if (posY) posY.value = bgData.posY || 50;
                if (posYValue) posYValue.textContent = (bgData.posY || 50) + '%';
                
                if (bgData.image) {
                    updateBackgroundPreview(section);
                }
            }
        });
    }

    renderBrandsList(data.brands);
    renderArticlesList(data.articles);
}

// Image upload handlers
function handleLogoUpload(input) {
    uploadImage(input, (base64) => {
        document.getElementById('logo-input').value = base64;
        showImagePreview('logo-preview', base64);
    });
}

function handleBrandImageUpload(input) {
    uploadImage(input, (base64) => {
        document.getElementById('brand-image').value = base64;
        showImagePreview('brand-image-preview', base64);
    });
}

function handleArticleImageUpload(input) {
    uploadImage(input, (base64) => {
        document.getElementById('article-image').value = base64;
        showImagePreview('article-image-preview', base64);
    });
}

// Handle section background upload
function handleSectionBgUpload(input, section) {
    uploadImage(input, (base64) => {
        document.getElementById(`${section}-bg-input`).value = base64;
        updateBackgroundPreview(section);
    });
}

// Update opacity value display
function updateOpacityValue(section) {
    const opacity = document.getElementById(`${section}-bg-opacity`).value;
    document.getElementById(`${section}-opacity-value`).textContent = opacity + '%';
    updateBackgroundPreview(section);
}

// Download section image with standard name
function downloadSectionImage(section) {
    const imageData = document.getElementById(`${section}-bg-input`).value;
    if (!imageData) {
        alert('Спочатку завантажте зображення!');
        return;
    }
    
    // Detect file type from base64 data
    let extension = 'jpg';
    if (imageData.startsWith('data:image/')) {
        const match = imageData.match(/data:image\/(\w+);/);
        if (match) {
            extension = match[1] === 'jpeg' ? 'jpg' : match[1];
        }
    }
    
    const filename = `${section}-bg.${extension}`;
    
    if (imageData.startsWith('data:')) {
        // It's base64
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename;
        link.click();
        alert(`Файл ${filename} завантажено! Завантажте його в папку images/backgrounds/ на GitHub.`);
    } else {
        alert('Завантажте зображення через кнопку "📤 Завантажити фон" для автоматичного перейменування файлу.');
    }
}

// Update section background
async function updateSectionBackground(section) {
    const data = await loadData();
    if (!data.sectionBackgrounds) {
        data.sectionBackgrounds = {};
    }
    if (!data.sectionBackgrounds[section]) {
        data.sectionBackgrounds[section] = {};
    }
    
    const image = document.getElementById(`${section}-bg-input`).value;
    const opacity = parseInt(document.getElementById(`${section}-bg-opacity`).value);
    const scale = parseInt(document.getElementById(`${section}-bg-scale`)?.value || 100);
    const posX = parseInt(document.getElementById(`${section}-bg-posX`)?.value || 50);
    const posY = parseInt(document.getElementById(`${section}-bg-posY`)?.value || 50);
    
    data.sectionBackgrounds[section].image = image;
    data.sectionBackgrounds[section].opacity = opacity;
    data.sectionBackgrounds[section].scale = scale;
    data.sectionBackgrounds[section].posX = posX;
    data.sectionBackgrounds[section].posY = posY;
    
    saveData(data);
}

// Show image preview
function showImagePreview(elementId, imageSrc) {
    const preview = document.getElementById(elementId);
    if (imageSrc) {
        preview.innerHTML = `<img src="${imageSrc}" alt="Preview">`;
        preview.style.display = 'block';
    } else {
        preview.innerHTML = '';
        preview.style.display = 'none';
    }
}

// Save All Settings - Single button to save everything
async function saveAllSettings() {
    const data = await loadData();
    
    // Page background color
    data.pageBgColor = document.getElementById('page-bg-color').value;
    data.colors.mainBg = data.pageBgColor; // Keep compatibility
    
    // Logo settings
    data.logo = document.getElementById('logo-input').value;
    if (!data.logoSize) data.logoSize = {};
    data.logoSize.width = document.getElementById('logo-width').value || 'auto';
    data.logoSize.height = document.getElementById('logo-height').value || '50px';
    
    // Header settings
    data.colors.headerBg = document.getElementById('header-color').value;
    if (!data.headerSizes) data.headerSizes = {};
    data.headerSizes.headerTopHeight = document.getElementById('header-top-height').value || '15px';
    
    // Menu settings
    data.menuFontSize = document.getElementById('menu-font-size').value || '14px';
    if (!data.textColors) data.textColors = {};
    data.textColors.menu = document.getElementById('text-menu-color').value;
    
    // Button settings
    data.buttonFontSize = document.getElementById('button-font-size').value || '14px';
    data.buttonTextColor = document.getElementById('button-text-color').value;
    
    // About section
    data.aboutText = document.getElementById('about-input').value;
    data.textColors.about = document.getElementById('text-about-color').value;
    
    // About background
    if (!data.sectionBackgrounds) data.sectionBackgrounds = {};
    if (!data.sectionBackgrounds.about) data.sectionBackgrounds.about = {};
    data.sectionBackgrounds.about.image = document.getElementById('about-bg-input').value;
    data.sectionBackgrounds.about.opacity = parseInt(document.getElementById('about-bg-opacity').value);
    data.sectionBackgrounds.about.scale = parseInt(document.getElementById('about-bg-scale')?.value || 100);
    data.sectionBackgrounds.about.posX = parseInt(document.getElementById('about-bg-posX')?.value || 50);
    data.sectionBackgrounds.about.posY = parseInt(document.getElementById('about-bg-posY')?.value || 50);
    
    // Brands section
    data.textColors.brands = document.getElementById('text-brands-color').value;
    
    // Brands background
    if (!data.sectionBackgrounds.brands) data.sectionBackgrounds.brands = {};
    data.sectionBackgrounds.brands.image = document.getElementById('brands-bg-input').value;
    data.sectionBackgrounds.brands.opacity = parseInt(document.getElementById('brands-bg-opacity').value);
    data.sectionBackgrounds.brands.scale = parseInt(document.getElementById('brands-bg-scale')?.value || 100);
    data.sectionBackgrounds.brands.posX = parseInt(document.getElementById('brands-bg-posX')?.value || 50);
    data.sectionBackgrounds.brands.posY = parseInt(document.getElementById('brands-bg-posY')?.value || 50);
    
    // Articles section
    data.textColors.articles = document.getElementById('text-articles-color').value;
    
    // Articles background
    if (!data.sectionBackgrounds.articles) data.sectionBackgrounds.articles = {};
    data.sectionBackgrounds.articles.image = document.getElementById('articles-bg-input').value;
    data.sectionBackgrounds.articles.opacity = parseInt(document.getElementById('articles-bg-opacity').value);
    data.sectionBackgrounds.articles.scale = parseInt(document.getElementById('articles-bg-scale')?.value || 100);
    data.sectionBackgrounds.articles.posX = parseInt(document.getElementById('articles-bg-posX')?.value || 50);
    data.sectionBackgrounds.articles.posY = parseInt(document.getElementById('articles-bg-posY')?.value || 50);
    
    // Footer settings
    data.address = document.getElementById('address-input').value;
    const phonesText = document.getElementById('phones-input').value;
    data.phones = phonesText.split('\n').filter(p => p.trim() !== '');
    
    if (!data.footerSettings) data.footerSettings = {};
    data.footerSettings.addressFontSize = document.getElementById('address-font-size').value || '14px';
    data.footerSettings.addressColor = document.getElementById('address-color').value;
    data.footerSettings.phonesFontSize = document.getElementById('phones-font-size').value || '14px';
    data.footerSettings.phonesColor = document.getElementById('phones-color').value;
    data.footerSettings.bgColor = document.getElementById('footer-bg-color').value;
    
    saveData(data);
    alert('✓ Всі налаштування збережено! Не забудьте завантажити data.json та закомітити його в GitHub.');
}

// Update functions (kept for backwards compatibility and individual updates)
async function updateLogo() {
    const data = await loadData();
    data.logo = document.getElementById('logo-input').value;
    saveData(data);
}

async function updateLogoSize() {
    const data = await loadData();
    if (!data.logoSize) {
        data.logoSize = {};
    }
    data.logoSize.width = document.getElementById('logo-width').value || 'auto';
    data.logoSize.height = document.getElementById('logo-height').value || '50px';
    saveData(data);
}

async function updateAddress() {
    const data = await loadData();
    data.address = document.getElementById('address-input').value;
    saveData(data);
}

async function updatePhones() {
    const data = await loadData();
    const phonesText = document.getElementById('phones-input').value;
    data.phones = phonesText.split('\n').filter(p => p.trim() !== '');
    saveData(data);
}

async function updateAbout() {
    const data = await loadData();
    data.aboutText = document.getElementById('about-input').value;
    saveData(data);
}

async function updateColors() {
    const data = await loadData();
    data.colors.headerBg = document.getElementById('header-color').value;
    data.colors.mainBg = document.getElementById('main-color').value;
    data.colors.menuBg = document.getElementById('menu-color').value;
    saveData(data);
}

async function updateTextColors() {
    const data = await loadData();
    if (!data.textColors) {
        data.textColors = {};
    }
    data.textColors.header = document.getElementById('text-header-color').value;
    data.textColors.menu = document.getElementById('text-menu-color').value;
    data.textColors.about = document.getElementById('text-about-color').value;
    data.textColors.brands = document.getElementById('text-brands-color').value;
    data.textColors.articles = document.getElementById('text-articles-color').value;
    data.textColors.footer = document.getElementById('text-footer-color').value;
    saveData(data);
}

async function updateContactColors() {
    const data = await loadData();
    if (!data.contactColors) {
        data.contactColors = {};
    }
    data.contactColors.phones = document.getElementById('contact-phones-color').value || '#333333';
    data.contactColors.address = document.getElementById('contact-address-color').value || '#666666';
    saveData(data);
}

async function updateHeaderSizes() {
    const data = await loadData();
    if (!data.headerSizes) {
        data.headerSizes = {};
    }
    data.headerSizes.headerTopHeight = document.getElementById('header-top-height').value || '15px';
    data.headerSizes.menuHeight = document.getElementById('menu-height').value || '18px';
    data.headerSizes.logoHeightNormal = document.getElementById('logo-height-normal').value || '50px';
    data.headerSizes.logoHeightShrink = document.getElementById('logo-height-shrink').value || '35px';
    data.headerSizes.footerHeight = document.getElementById('footer-height').value || '30px';
    saveData(data);
}


// Brands management
function renderBrandsList(brands) {
    const container = document.getElementById('brands-list');
    container.innerHTML = brands.map(brand => `
        <div class="brand-item">
            <h4>${brand.name} <span class="item-id">(ID: ${brand.id})</span></h4>
            <p>${brand.description}</p>
            <div class="item-actions">
                <button class="edit-btn" onclick="editBrand(${brand.id})">Редагувати</button>
                <button class="delete-btn" onclick="deleteBrand(${brand.id})">Видалити</button>
            </div>
        </div>
    `).join('');
}

function showAddBrandForm() {
    document.getElementById('brand-modal-title').textContent = 'Додати бренд';
    document.getElementById('brand-id').value = '';
    document.getElementById('brand-name').value = '';
    document.getElementById('brand-description').value = '';
    document.getElementById('brand-image').value = '';
    document.getElementById('brand-modal').style.display = 'block';
}

async function editBrand(id) {
    const data = await loadData();
    const brand = data.brands.find(b => b.id === id);
    if (brand) {
        document.getElementById('brand-modal-title').textContent = 'Редагувати бренд';
        document.getElementById('brand-id').value = brand.id;
        document.getElementById('brand-name').value = brand.name;
        document.getElementById('brand-description').value = brand.description;
        document.getElementById('brand-image').value = brand.image;
        if (brand.image) {
            showImagePreview('brand-image-preview', brand.image);
        }
        document.getElementById('brand-modal').style.display = 'block';
    }
}

async function saveBrand() {
    const data = await loadData();
    const id = document.getElementById('brand-id').value;
    const name = document.getElementById('brand-name').value;
    const description = document.getElementById('brand-description').value;
    const image = document.getElementById('brand-image').value;

    if (!name || !description) {
        alert('Заповніть всі обов\'язкові поля!');
        return;
    }

    if (id) {
        // Edit existing
        const index = data.brands.findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
            data.brands[index] = { id: parseInt(id), name, description, image };
        }
    } else {
        // Add new
        const newId = data.brands.length > 0 ? Math.max(...data.brands.map(b => b.id)) + 1 : 1;
        data.brands.push({ id: newId, name, description, image });
    }

    saveData(data);
    renderBrandsList(data.brands);
    closeBrandModal();
    alert('Бренд збережено!');
}

async function deleteBrand(id) {
    if (confirm('Ви впевнені, що хочете видалити цей бренд?')) {
        const data = await loadData();
        data.brands = data.brands.filter(b => b.id !== id);
        saveData(data);
        renderBrandsList(data.brands);
    }
}

function closeBrandModal() {
    document.getElementById('brand-modal').style.display = 'none';
}

// Articles management
function renderArticlesList(articles) {
    const container = document.getElementById('articles-list');
    container.innerHTML = articles.map(article => `
        <div class="article-item">
            <h4>${article.name} <span class="item-id">(ID: ${article.id})</span></h4>
            <p>${article.excerpt}</p>
            <p class="hint">Зображення: images/articles/${article.id}.jpg</p>
            <div class="item-actions">
                <button class="edit-btn" onclick="editArticle(${article.id})">Редагувати</button>
                <button class="delete-btn" onclick="deleteArticle(${article.id})">Видалити</button>
            </div>
        </div>
    `).join('');
}

function showAddArticleForm() {
    document.getElementById('article-modal-title').textContent = 'Додати статтю';
    document.getElementById('article-id').value = '';
    document.getElementById('article-name').value = '';
    document.getElementById('article-excerpt').value = '';
    document.getElementById('article-image').value = '';
    document.getElementById('article-content').value = '';
    document.getElementById('article-modal').style.display = 'block';
}

async function editArticle(id) {
    const data = await loadData();
    const article = data.articles.find(a => a.id === id);
    if (article) {
        document.getElementById('article-modal-title').textContent = 'Редагувати статтю';
        document.getElementById('article-id').value = article.id;
        document.getElementById('article-name').value = article.name;
        document.getElementById('article-excerpt').value = article.excerpt;
        document.getElementById('article-image').value = article.image;
        document.getElementById('article-content').value = article.content;
        if (article.image) {
            showImagePreview('article-image-preview', article.image);
        }
        document.getElementById('article-modal').style.display = 'block';
    }
}

async function saveArticle() {
    const data = await loadData();
    const id = document.getElementById('article-id').value;
    const name = document.getElementById('article-name').value;
    const excerpt = document.getElementById('article-excerpt').value;
    const image = document.getElementById('article-image').value;
    const content = document.getElementById('article-content').value;

    if (!name || !excerpt || !content) {
        alert('Заповніть всі обов\'язкові поля!');
        return;
    }

    if (id) {
        // Edit existing
        const index = data.articles.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            data.articles[index] = { id: parseInt(id), name, excerpt, image, content };
        }
    } else {
        // Add new
        const newId = data.articles.length > 0 ? Math.max(...data.articles.map(a => a.id)) + 1 : 1;
        data.articles.push({ id: newId, name, excerpt, image, content });
    }

    saveData(data);
    renderArticlesList(data.articles);
    closeArticleModal();
    alert('Статтю збережено!');
}

async function deleteArticle(id) {
    if (confirm('Ви впевнені, що хочете видалити цю статтю?')) {
        const data = await loadData();
        data.articles = data.articles.filter(a => a.id !== id);
        saveData(data);
        renderArticlesList(data.articles);
    }
}

function closeArticleModal() {
    document.getElementById('article-modal').style.display = 'none';
}

// New slider update functions for background controls
function updateScaleValue(section) {
    const scale = document.getElementById(`${section}-bg-scale`).value;
    document.getElementById(`${section}-scale-value`).textContent = scale + '%';
    updateBackgroundPreview(section);
}

function updatePosXValue(section) {
    const posX = document.getElementById(`${section}-bg-posX`).value;
    document.getElementById(`${section}-posX-value`).textContent = posX + '%';
    updateBackgroundPreview(section);
}

function updatePosYValue(section) {
    const posY = document.getElementById(`${section}-bg-posY`).value;
    document.getElementById(`${section}-posY-value`).textContent = posY + '%';
    updateBackgroundPreview(section);
}

// Update background preview dynamically
function updateBackgroundPreview(section) {
    const imageUrl = document.getElementById(`${section}-bg-input`)?.value;
    const opacity = parseInt(document.getElementById(`${section}-bg-opacity`)?.value || 100);
    const scale = parseInt(document.getElementById(`${section}-bg-scale`)?.value || 100);
    const posX = parseInt(document.getElementById(`${section}-bg-posX`)?.value || 50);
    const posY = parseInt(document.getElementById(`${section}-bg-posY`)?.value || 50);
    
    const preview = document.getElementById(`${section}-bg-preview`);
    if (!preview) return;
    
    if (imageUrl) {
        preview.innerHTML = `
            <div style="position: relative; width: 100%; height: 150px; background: #f0f0f0; border-radius: 8px; overflow: hidden;">
                <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: url('${imageUrl.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}');
                    background-size: ${scale}%;
                    background-position: ${posX}% ${posY}%;
                    background-repeat: no-repeat;
                    opacity: ${opacity / 100};
                "></div>
            </div>
        `;
        preview.style.display = 'block';
    } else {
        preview.innerHTML = '';
        preview.style.display = 'none';
    }
}

// Consolidated update functions for each section
async function updateHeaderSettings() {
    const data = await loadData();
    
    // Update colors
    data.colors.headerBg = document.getElementById('header-color').value;
    if (!data.textColors) data.textColors = {};
    data.textColors.header = document.getElementById('text-header-color').value;
    if (!data.contactColors) data.contactColors = {};
    data.contactColors.phones = document.getElementById('contact-phones-color').value;
    data.contactColors.address = document.getElementById('contact-address-color').value;
    
    // Update sizes
    if (!data.headerSizes) data.headerSizes = {};
    data.headerSizes.headerTopHeight = document.getElementById('header-top-height').value || '15px';
    data.headerSizes.logoHeightNormal = document.getElementById('logo-height-normal').value || '50px';
    data.headerSizes.logoHeightShrink = document.getElementById('logo-height-shrink').value || '35px';
    
    // Update background
    if (!data.sectionBackgrounds) data.sectionBackgrounds = {};
    if (!data.sectionBackgrounds.header) data.sectionBackgrounds.header = {};
    const scale = parseInt(document.getElementById('header-bg-scale')?.value || 100);
    const posX = parseInt(document.getElementById('header-bg-posX')?.value || 50);
    const posY = parseInt(document.getElementById('header-bg-posY')?.value || 50);
    data.sectionBackgrounds.header.scale = scale;
    data.sectionBackgrounds.header.posX = posX;
    data.sectionBackgrounds.header.posY = posY;
    
    saveData(data);
}

async function updateMenuSettings() {
    const data = await loadData();
    data.colors.menuBg = document.getElementById('menu-color').value;
    if (!data.textColors) data.textColors = {};
    data.textColors.menu = document.getElementById('text-menu-color').value;
    if (!data.headerSizes) data.headerSizes = {};
    data.headerSizes.menuHeight = document.getElementById('menu-height').value || '18px';
    saveData(data);
}

async function updateAboutSettings() {
    const data = await loadData();
    if (!data.textColors) data.textColors = {};
    data.textColors.about = document.getElementById('text-about-color').value;
    
    // Update background
    if (!data.sectionBackgrounds) data.sectionBackgrounds = {};
    if (!data.sectionBackgrounds.about) data.sectionBackgrounds.about = {};
    const scale = parseInt(document.getElementById('about-bg-scale')?.value || 100);
    const posX = parseInt(document.getElementById('about-bg-posX')?.value || 50);
    const posY = parseInt(document.getElementById('about-bg-posY')?.value || 50);
    data.sectionBackgrounds.about.scale = scale;
    data.sectionBackgrounds.about.posX = posX;
    data.sectionBackgrounds.about.posY = posY;
    
    saveData(data);
}

async function updateBrandsSettings() {
    const data = await loadData();
    if (!data.textColors) data.textColors = {};
    data.textColors.brands = document.getElementById('text-brands-color').value;
    
    // Update background
    if (!data.sectionBackgrounds) data.sectionBackgrounds = {};
    if (!data.sectionBackgrounds.brands) data.sectionBackgrounds.brands = {};
    const scale = parseInt(document.getElementById('brands-bg-scale')?.value || 100);
    const posX = parseInt(document.getElementById('brands-bg-posX')?.value || 50);
    const posY = parseInt(document.getElementById('brands-bg-posY')?.value || 50);
    data.sectionBackgrounds.brands.scale = scale;
    data.sectionBackgrounds.brands.posX = posX;
    data.sectionBackgrounds.brands.posY = posY;
    
    saveData(data);
}

async function updateArticlesSettings() {
    const data = await loadData();
    if (!data.textColors) data.textColors = {};
    data.textColors.articles = document.getElementById('text-articles-color').value;
    
    // Update background
    if (!data.sectionBackgrounds) data.sectionBackgrounds = {};
    if (!data.sectionBackgrounds.articles) data.sectionBackgrounds.articles = {};
    const scale = parseInt(document.getElementById('articles-bg-scale')?.value || 100);
    const posX = parseInt(document.getElementById('articles-bg-posX')?.value || 50);
    const posY = parseInt(document.getElementById('articles-bg-posY')?.value || 50);
    data.sectionBackgrounds.articles.scale = scale;
    data.sectionBackgrounds.articles.posX = posX;
    data.sectionBackgrounds.articles.posY = posY;
    
    saveData(data);
}

async function updateFooterSettings() {
    const data = await loadData();
    if (!data.textColors) data.textColors = {};
    data.textColors.footer = document.getElementById('text-footer-color').value;
    if (!data.headerSizes) data.headerSizes = {};
    data.headerSizes.footerHeight = document.getElementById('footer-height').value || '30px';
    
    // Update background
    if (!data.sectionBackgrounds) data.sectionBackgrounds = {};
    if (!data.sectionBackgrounds.footer) data.sectionBackgrounds.footer = {};
    const scale = parseInt(document.getElementById('footer-bg-scale')?.value || 100);
    const posX = parseInt(document.getElementById('footer-bg-posX')?.value || 50);
    const posY = parseInt(document.getElementById('footer-bg-posY')?.value || 50);
    data.sectionBackgrounds.footer.scale = scale;
    data.sectionBackgrounds.footer.posX = posX;
    data.sectionBackgrounds.footer.posY = posY;
    
    saveData(data);
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

// Initialize
checkAuth();
