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
                products: [],
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

    document.getElementById('logo-input').value = data.logo || '';
    document.getElementById('address-input').value = data.address || '';
    document.getElementById('phones-input').value = data.phones.join('\n');
    document.getElementById('about-input').value = data.aboutText || '';
    document.getElementById('header-color').value = data.colors.headerBg;
    document.getElementById('main-color').value = data.colors.mainBg;
    document.getElementById('menu-color').value = data.colors.menuBg || '#2c3e50';
    
    // Load text colors
    if (data.textColors) {
        document.getElementById('text-header-color').value = data.textColors.header || '#333333';
        document.getElementById('text-menu-color').value = data.textColors.menu || '#ffffff';
        document.getElementById('text-about-color').value = data.textColors.about || '#333333';
        document.getElementById('text-brands-color').value = data.textColors.brands || data.textColors.products || '#333333';
        document.getElementById('text-articles-color').value = data.textColors.articles || '#333333';
        document.getElementById('text-footer-color').value = data.textColors.footer || '#ffffff';
    }
    
    // Load contact colors
    if (data.contactColors) {
        document.getElementById('contact-phones-color').value = data.contactColors.phones || '#333333';
        document.getElementById('contact-address-color').value = data.contactColors.address || '#666666';
    }
    
    // Load font sizes
    if (data.fontSizes) {
        document.getElementById('font-size-header').value = data.fontSizes.header || '14px';
        document.getElementById('font-size-menu').value = data.fontSizes.menu || '16px';
        document.getElementById('font-size-about').value = data.fontSizes.about || '16px';
        document.getElementById('font-size-brands').value = data.fontSizes.brands || '16px';
        document.getElementById('font-size-articles').value = data.fontSizes.articles || '16px';
        document.getElementById('font-size-footer').value = data.fontSizes.footer || '14px';
    }
    
    // Load header sizes
    if (data.headerSizes) {
        document.getElementById('header-top-height').value = data.headerSizes.headerTopHeight || '15px';
        document.getElementById('menu-height').value = data.headerSizes.menuHeight || '18px';
        document.getElementById('logo-height-normal').value = data.headerSizes.logoHeightNormal || '50px';
        document.getElementById('logo-height-shrink').value = data.headerSizes.logoHeightShrink || '35px';
        document.getElementById('footer-height').value = data.headerSizes.footerHeight || '30px';
    }
    
    // Load logo size
    if (data.logoSize) {
        document.getElementById('logo-width').value = data.logoSize.width || 'auto';
        // Also load logo heights from logoSize if they don't exist in headerSizes
        if (!data.headerSizes || !data.headerSizes.logoHeightNormal) {
            document.getElementById('logo-height-normal').value = data.logoSize.height || '50px';
        }
    }
    
    // Ensure consistency: if headerSizes has logo heights, sync them to logoSize
    if (data.headerSizes && data.headerSizes.logoHeightNormal) {
        if (!data.logoSize) data.logoSize = {};
        if (data.logoSize.height !== data.headerSizes.logoHeightNormal) {
            data.logoSize.height = data.headerSizes.logoHeightNormal;
            saveData(data);
        }
    }
    
    // Show logo preview if exists
    if (data.logo) {
        showImagePreview('logo-preview', data.logo);
    }
    
    // Load section backgrounds (update to use 'brands' instead of 'products')
    if (data.sectionBackgrounds) {
        ['header', 'about', 'brands', 'articles', 'footer'].forEach(section => {
            const bgData = data.sectionBackgrounds[section] || data.sectionBackgrounds[section === 'brands' ? 'products' : section];
            if (bgData) {
                const input = document.getElementById(`${section}-bg-input`);
                const opacity = document.getElementById(`${section}-bg-opacity`);
                const opacityValue = document.getElementById(`${section}-opacity-value`);
                
                if (input) input.value = bgData.image || '';
                if (opacity) opacity.value = bgData.opacity || 100;
                if (opacityValue) opacityValue.textContent = (bgData.opacity || 100) + '%';
                
                if (bgData.image) {
                    showImagePreview(`${section}-bg-preview`, bgData.image);
                }
            }
        });
    }

    renderProductsList(data.brands || data.products || []);
    renderArticlesList(data.articles);
}

// Image upload handlers
function handleLogoUpload(input) {
    uploadImage(input, (base64) => {
        document.getElementById('logo-input').value = base64;
        showImagePreview('logo-preview', base64);
        updateLogo();
    });
}

function handleProductImageUpload(input) {
    uploadImage(input, (base64) => {
        document.getElementById('product-image').value = base64;
        showImagePreview('product-image-preview', base64);
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
        showImagePreview(`${section}-bg-preview`, base64);
    });
}

// Update opacity value display
function updateOpacityValue(section) {
    const opacity = document.getElementById(`${section}-bg-opacity`).value;
    document.getElementById(`${section}-opacity-value`).textContent = opacity + '%';
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
    
    data.sectionBackgrounds[section].image = image;
    data.sectionBackgrounds[section].opacity = opacity;
    
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

// Update functions
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
    if (!data.headerSizes) {
        data.headerSizes = {};
    }
    const width = document.getElementById('logo-width').value || 'auto';
    const heightNormal = document.getElementById('logo-height-normal').value || '50px';
    const heightShrink = document.getElementById('logo-height-shrink').value || '35px';
    
    data.logoSize.width = width;
    // Save both to logoSize for consistency and to headerSizes for shrinking behavior
    data.headerSizes.logoHeightNormal = heightNormal;
    data.headerSizes.logoHeightShrink = heightShrink;
    // Use normal height as the default logoSize.height
    data.logoSize.height = heightNormal;
    
    saveData(data);
    alert(`Розмір логотипу оновлено!\nШирина: ${width}\nВисота (звичайна): ${heightNormal}\nВисота (зменшена): ${heightShrink}`);
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

async function updateFontSizes() {
    const data = await loadData();
    if (!data.fontSizes) {
        data.fontSizes = {};
    }
    const headerSize = document.getElementById('font-size-header')?.value;
    const menuSize = document.getElementById('font-size-menu')?.value;
    const aboutSize = document.getElementById('font-size-about')?.value;
    const brandsSize = document.getElementById('font-size-brands')?.value;
    const articlesSize = document.getElementById('font-size-articles')?.value;
    const footerSize = document.getElementById('font-size-footer')?.value;
    
    if (headerSize) data.fontSizes.header = headerSize;
    if (menuSize) data.fontSizes.menu = menuSize;
    if (aboutSize) data.fontSizes.about = aboutSize;
    if (brandsSize) data.fontSizes.brands = brandsSize;
    if (articlesSize) data.fontSizes.articles = articlesSize;
    if (footerSize) data.fontSizes.footer = footerSize;
    
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
    data.headerSizes.footerHeight = document.getElementById('footer-height').value || '30px';
    saveData(data);
}


// Products management
function renderProductsList(products) {
    const container = document.getElementById('products-list');
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <h4>${product.name} <span class="item-id">(ID: ${product.id})</span></h4>
            <p>${product.description}</p>
            <p class="hint">Зображення: images/brands/${product.id}.jpg</p>
            <div class="item-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">Редагувати</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Видалити</button>
            </div>
        </div>
    `).join('');
}

function showAddProductForm() {
    document.getElementById('product-modal-title').textContent = 'Додати бренд';
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-image-preview').innerHTML = '';
    document.getElementById('product-modal').style.display = 'block';
}

async function editProduct(id) {
    const data = await loadData();
    const brands = data.brands || data.products || [];
    const product = brands.find(p => p.id === id);
    if (product) {
        document.getElementById('product-modal-title').textContent = 'Редагувати бренд';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image;
        if (product.image) {
            showImagePreview('product-image-preview', product.image);
        }
        document.getElementById('product-modal').style.display = 'block';
    }
}

async function saveProduct() {
    const data = await loadData();
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const image = document.getElementById('product-image').value;

    if (!name || !description) {
        alert('Заповніть всі обов\'язкові поля!');
        return;
    }

    // Ensure we're using brands, not products
    if (!data.brands) {
        data.brands = data.products || [];
        delete data.products;
    }

    if (id) {
        // Edit existing
        const index = data.brands.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            data.brands[index] = { id: parseInt(id), name, description, image };
        }
    } else {
        // Add new
        const newId = data.brands.length > 0 ? Math.max(...data.brands.map(p => p.id)) + 1 : 1;
        data.brands.push({ id: newId, name, description, image });
    }

    saveData(data);
    renderProductsList(data.brands);
    closeProductModal();
    alert('Бренд збережено!');
}

async function deleteProduct(id) {
    if (confirm('Ви впевнені, що хочете видалити цей бренд?')) {
        const data = await loadData();
        if (!data.brands) {
            data.brands = data.products || [];
            delete data.products;
        }
        data.brands = data.brands.filter(p => p.id !== id);
        saveData(data);
        renderProductsList(data.brands);
    }
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
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

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = 'none';
    }
}

// Background preview with logo positioning
function toggleBackgroundPreview(section) {
    const container = document.getElementById(`${section}-preview-container`);
    if (container.style.display === 'none') {
        container.style.display = 'block';
        renderBackgroundPreview(section);
    } else {
        container.style.display = 'none';
    }
}

async function renderBackgroundPreview(section) {
    const data = await loadData();
    const container = document.getElementById(`${section}-preview-container`);
    
    const logoUrl = data.logo || '';
    
    // Get all background images and opacities
    const headerBg = data.sectionBackgrounds?.header?.image || '';
    const headerBgOpacity = data.sectionBackgrounds?.header?.opacity || 100;
    const aboutBg = data.sectionBackgrounds?.about?.image || '';
    const aboutBgOpacity = data.sectionBackgrounds?.about?.opacity || 100;
    const brandsBg = data.sectionBackgrounds?.brands?.image || '';
    const brandsBgOpacity = data.sectionBackgrounds?.brands?.opacity || 100;
    const articlesBg = data.sectionBackgrounds?.articles?.image || '';
    const articlesBgOpacity = data.sectionBackgrounds?.articles?.opacity || 100;
    const footerBg = data.sectionBackgrounds?.footer?.image || '';
    const footerBgOpacity = data.sectionBackgrounds?.footer?.opacity || 100;
    
    // Get colors
    const headerColor = data.colors?.headerBg || '#2c3e50';
    const menuColor = data.colors?.menuBg || '#2c3e50';
    const mainColor = data.colors?.mainBg || '#f4f4f4';
    
    // Load saved logo position if exists for this section
    const savedPosition = data[`${section}LogoPosition`] || { scale: 100, x: 50, y: 50 };
    
    // Determine which section is being previewed and highlight it
    const getSectionStyle = (sectionName, bg, opacity, color) => {
        const isActive = sectionName === section;
        const borderStyle = isActive ? 'border: 3px solid #007bff;' : '';
        const bgStyle = bg ? `background-image: url('${bg}'); background-size: cover; background-position: center; opacity: ${opacity / 100};` : '';
        return `background-color: ${color}; position: relative; overflow: hidden; ${borderStyle}`;
    };
    
    container.innerHTML = `
        <div class="logo-controls">
            <label>Масштаб логотипу (для секції "${section}"):</label>
            <input type="range" id="${section}-logo-scale" min="20" max="200" value="${savedPosition.scale}" oninput="updateBackgroundLogoPreview('${section}')">
            <span id="${section}-logo-scale-value">${savedPosition.scale}%</span>
            
            <label style="margin-top: 10px;">Позиція по горизонталі:</label>
            <input type="range" id="${section}-logo-position-x" min="0" max="100" value="${savedPosition.x}" oninput="updateBackgroundLogoPreview('${section}')">
            <span id="${section}-logo-position-x-value">${savedPosition.x}%</span>
            
            <label style="margin-top: 10px;">Позиція по вертикалі:</label>
            <input type="range" id="${section}-logo-position-y" min="0" max="100" value="${savedPosition.y}" oninput="updateBackgroundLogoPreview('${section}')">
            <span id="${section}-logo-position-y-value">${savedPosition.y}%</span>
            
            <button onclick="saveBackgroundLogoPosition('${section}')" style="margin-top: 10px;">💾 Зберегти позицію та масштаб</button>
            <p class="hint" style="margin-top: 10px; font-size: 12px; color: #666;">Синя рамка показує секцію, що редагується</p>
        </div>
        <div id="${section}-bg-preview-frame" class="site-preview" style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <!-- Header Section -->
            <div class="preview-header" style="${getSectionStyle('header', headerBg, headerBgOpacity, headerColor)} padding: 15px;">
                ${headerBg && section === 'header' ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${headerBg}'); background-size: cover; background-position: center; opacity: ${headerBgOpacity / 100}; pointer-events: none;"></div>` : ''}
                <div class="preview-logo-container${section === 'header' ? '-active' : ''}" style="position: relative; z-index: 1; text-align: center;">
                    ${logoUrl && section === 'header' ? `<img id="${section}-preview-logo" src="${logoUrl}" alt="Logo" style="display: inline-block; max-width: 100px; height: auto;">` : (logoUrl ? `<img src="${logoUrl}" alt="Logo" style="display: inline-block; max-width: 100px; height: auto;">` : '<div style="padding: 10px; color: #999; font-size: 12px;">Логотип</div>')}
                </div>
            </div>
            
            <!-- Menu Section -->
            <div class="preview-menu" style="background-color: ${menuColor}; color: white; padding: 8px; text-align: center; font-size: 11px;">
                <span>Меню • Контакти • Про нас • Бренди • Статті</span>
            </div>
            
            <!-- About Section -->
            <div class="preview-about" style="${getSectionStyle('about', aboutBg, aboutBgOpacity, mainColor)} padding: 20px; min-height: 60px;">
                ${aboutBg && section === 'about' ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${aboutBg}'); background-size: cover; background-position: center; opacity: ${aboutBgOpacity / 100}; pointer-events: none;"></div>` : ''}
                <div class="preview-logo-container${section === 'about' ? '-active' : ''}" style="position: relative; z-index: 1; text-align: center;">
                    ${logoUrl && section === 'about' ? `<img id="${section}-preview-logo" src="${logoUrl}" alt="Logo" style="display: inline-block; max-width: 80px; height: auto;">` : '<div style="padding: 10px; color: #999; font-size: 11px;">Про нас</div>'}
                </div>
            </div>
            
            <!-- Brands Section -->
            <div class="preview-brands" style="${getSectionStyle('brands', brandsBg, brandsBgOpacity, mainColor)} padding: 20px; min-height: 60px;">
                ${brandsBg && section === 'brands' ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${brandsBg}'); background-size: cover; background-position: center; opacity: ${brandsBgOpacity / 100}; pointer-events: none;"></div>` : ''}
                <div class="preview-logo-container${section === 'brands' ? '-active' : ''}" style="position: relative; z-index: 1; text-align: center;">
                    ${logoUrl && section === 'brands' ? `<img id="${section}-preview-logo" src="${logoUrl}" alt="Logo" style="display: inline-block; max-width: 80px; height: auto;">` : '<div style="padding: 10px; color: #999; font-size: 11px;">Бренди</div>'}
                </div>
            </div>
            
            <!-- Articles Section -->
            <div class="preview-articles" style="${getSectionStyle('articles', articlesBg, articlesBgOpacity, mainColor)} padding: 20px; min-height: 60px;">
                ${articlesBg && section === 'articles' ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${articlesBg}'); background-size: cover; background-position: center; opacity: ${articlesBgOpacity / 100}; pointer-events: none;"></div>` : ''}
                <div class="preview-logo-container${section === 'articles' ? '-active' : ''}" style="position: relative; z-index: 1; text-align: center;">
                    ${logoUrl && section === 'articles' ? `<img id="${section}-preview-logo" src="${logoUrl}" alt="Logo" style="display: inline-block; max-width: 80px; height: auto;">` : '<div style="padding: 10px; color: #999; font-size: 11px;">Статті</div>'}
                </div>
            </div>
            
            <!-- Footer Section -->
            <div class="preview-footer" style="${getSectionStyle('footer', footerBg, footerBgOpacity, headerColor)} padding: 15px; text-align: center;">
                ${footerBg && section === 'footer' ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${footerBg}'); background-size: cover; background-position: center; opacity: ${footerBgOpacity / 100}; pointer-events: none;"></div>` : ''}
                <div class="preview-logo-container${section === 'footer' ? '-active' : ''}" style="position: relative; z-index: 1;">
                    ${logoUrl && section === 'footer' ? `<img id="${section}-preview-logo" src="${logoUrl}" alt="Logo" style="display: inline-block; max-width: 60px; height: auto;">` : '<div style="padding: 8px; color: #999; font-size: 10px;">Підвал</div>'}
                </div>
            </div>
        </div>
    `;
    
    updateBackgroundLogoPreview(section);
}

function updateBackgroundLogoPreview(section) {
    const logo = document.getElementById(`${section}-preview-logo`);
    if (!logo) return;
    
    const scale = document.getElementById(`${section}-logo-scale`).value;
    const posX = document.getElementById(`${section}-logo-position-x`).value;
    const posY = document.getElementById(`${section}-logo-position-y`).value;
    
    document.getElementById(`${section}-logo-scale-value`).textContent = scale + '%';
    document.getElementById(`${section}-logo-position-x-value`).textContent = posX + '%';
    document.getElementById(`${section}-logo-position-y-value`).textContent = posY + '%';
    
    const container = logo.parentElement;
    
    // Apply horizontal alignment
    if (posX < 33) {
        container.style.textAlign = 'left';
        logo.style.marginLeft = '0';
        logo.style.marginRight = 'auto';
    } else if (posX > 66) {
        container.style.textAlign = 'right';
        logo.style.marginLeft = 'auto';
        logo.style.marginRight = '0';
    } else {
        container.style.textAlign = 'center';
        logo.style.marginLeft = 'auto';
        logo.style.marginRight = 'auto';
    }
    
    // Apply vertical positioning with padding
    container.style.paddingTop = `${posY / 2}px`;
    container.style.paddingBottom = `${(100 - posY) / 2}px`;
    
    // Apply scale
    logo.style.transform = `scale(${scale / 100})`;
    logo.style.transformOrigin = posX < 33 ? 'left center' : posX > 66 ? 'right center' : 'center center';
}

async function saveBackgroundLogoPosition(section) {
    const data = await loadData();
    const positionKey = `${section}LogoPosition`;
    
    if (!data[positionKey]) {
        data[positionKey] = {};
    }
    
    data[positionKey].scale = parseInt(document.getElementById(`${section}-logo-scale`).value);
    data[positionKey].x = parseInt(document.getElementById(`${section}-logo-position-x`).value);
    data[positionKey].y = parseInt(document.getElementById(`${section}-logo-position-y`).value);
    
    saveData(data);
    alert('Позицію та масштаб логотипу збережено!');
}

// Site preview with logo positioning
function toggleSitePreview() {
    const container = document.getElementById('site-preview-container');
    if (container.style.display === 'none') {
        container.style.display = 'block';
        renderSitePreview();
    } else {
        container.style.display = 'none';
    }
}

async function renderSitePreview() {
    const data = await loadData();
    const preview = document.getElementById('site-preview');
    
    const logoUrl = data.logo || '';
    
    // Get all background images and opacities
    const headerBg = data.sectionBackgrounds?.header?.image || '';
    const headerBgOpacity = data.sectionBackgrounds?.header?.opacity || 100;
    const aboutBg = data.sectionBackgrounds?.about?.image || '';
    const aboutBgOpacity = data.sectionBackgrounds?.about?.opacity || 100;
    const brandsBg = data.sectionBackgrounds?.brands?.image || '';
    const brandsBgOpacity = data.sectionBackgrounds?.brands?.opacity || 100;
    const articlesBg = data.sectionBackgrounds?.articles?.image || '';
    const articlesBgOpacity = data.sectionBackgrounds?.articles?.opacity || 100;
    const footerBg = data.sectionBackgrounds?.footer?.image || '';
    const footerBgOpacity = data.sectionBackgrounds?.footer?.opacity || 100;
    
    // Get colors
    const headerColor = data.colors?.headerBg || '#2c3e50';
    const menuColor = data.colors?.menuBg || '#2c3e50';
    const mainColor = data.colors?.mainBg || '#f4f4f4';
    
    // Load saved logo position if exists
    if (data.logoPosition) {
        document.getElementById('logo-scale').value = data.logoPosition.scale || 100;
        document.getElementById('logo-scale-value').textContent = (data.logoPosition.scale || 100) + '%';
        document.getElementById('logo-position-x').value = data.logoPosition.x || 50;
        document.getElementById('logo-position-x-value').textContent = (data.logoPosition.x || 50) + '%';
        document.getElementById('logo-position-y').value = data.logoPosition.y || 50;
        document.getElementById('logo-position-y-value').textContent = (data.logoPosition.y || 50) + '%';
    }
    
    preview.innerHTML = `
        <!-- Header Section -->
        <div class="preview-header" style="background-color: ${headerColor}; position: relative; overflow: hidden; padding: 15px;">
            ${headerBg ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${headerBg}'); background-size: cover; background-position: center; opacity: ${headerBgOpacity / 100}; pointer-events: none;"></div>` : ''}
            <div class="preview-logo-container" style="position: relative; z-index: 1; text-align: center;">
                ${logoUrl ? `<img id="preview-logo" src="${logoUrl}" alt="Logo" style="display: inline-block; max-width: 100px; height: auto;">` : '<div style="padding: 10px; color: white;">Логотип не завантажено</div>'}
            </div>
        </div>
        
        <!-- Menu Section -->
        <div class="preview-menu" style="background-color: ${menuColor}; color: white; padding: 8px; text-align: center; font-size: 11px;">
            <span>Меню • Контакти • Про нас • Бренди • Статті</span>
        </div>
        
        <!-- About Section -->
        <div class="preview-about" style="background-color: ${mainColor}; position: relative; overflow: hidden; padding: 20px; min-height: 60px;">
            ${aboutBg ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${aboutBg}'); background-size: cover; background-position: center; opacity: ${aboutBgOpacity / 100}; pointer-events: none;"></div>` : ''}
            <div style="position: relative; z-index: 1; text-align: center; font-size: 11px; color: #666;">
                Про нас
            </div>
        </div>
        
        <!-- Brands Section -->
        <div class="preview-brands" style="background-color: ${mainColor}; position: relative; overflow: hidden; padding: 20px; min-height: 60px;">
            ${brandsBg ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${brandsBg}'); background-size: cover; background-position: center; opacity: ${brandsBgOpacity / 100}; pointer-events: none;"></div>` : ''}
            <div style="position: relative; z-index: 1; text-align: center; font-size: 11px; color: #666;">
                Бренди
            </div>
        </div>
        
        <!-- Articles Section -->
        <div class="preview-articles" style="background-color: ${mainColor}; position: relative; overflow: hidden; padding: 20px; min-height: 60px;">
            ${articlesBg ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${articlesBg}'); background-size: cover; background-position: center; opacity: ${articlesBgOpacity / 100}; pointer-events: none;"></div>` : ''}
            <div style="position: relative; z-index: 1; text-align: center; font-size: 11px; color: #666;">
                Статті
            </div>
        </div>
        
        <!-- Footer Section -->
        <div class="preview-footer" style="background-color: ${headerColor}; position: relative; overflow: hidden; padding: 15px; text-align: center;">
            ${footerBg ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${footerBg}'); background-size: cover; background-position: center; opacity: ${footerBgOpacity / 100}; pointer-events: none;"></div>` : ''}
            <div style="position: relative; z-index: 1; font-size: 10px; color: #999;">
                Підвал
            </div>
        </div>
    `;
    
    updateLogoPreview();
}

function updateLogoPreview() {
    const logo = document.getElementById('preview-logo');
    if (!logo) return;
    
    const scale = document.getElementById('logo-scale').value;
    const posX = document.getElementById('logo-position-x').value;
    const posY = document.getElementById('logo-position-y').value;
    
    document.getElementById('logo-scale-value').textContent = scale + '%';
    document.getElementById('logo-position-x-value').textContent = posX + '%';
    document.getElementById('logo-position-y-value').textContent = posY + '%';
    
    const container = logo.parentElement;
    container.style.textAlign = posX < 33 ? 'left' : posX > 66 ? 'right' : 'center';
    container.style.paddingTop = `${posY / 2}px`;
    container.style.paddingBottom = `${(100 - posY) / 2}px`;
    
    logo.style.transform = `scale(${scale / 100})`;
    logo.style.transformOrigin = posX < 33 ? 'left center' : posX > 66 ? 'right center' : 'center center';
}

async function saveLogoPosition() {
    const data = await loadData();
    if (!data.logoPosition) {
        data.logoPosition = {};
    }
    
    data.logoPosition.scale = parseInt(document.getElementById('logo-scale').value);
    data.logoPosition.x = parseInt(document.getElementById('logo-position-x').value);
    data.logoPosition.y = parseInt(document.getElementById('logo-position-y').value);
    
    saveData(data);
    alert('Позицію та масштаб логотипу збережено!');
}

// Initialize
checkAuth();
