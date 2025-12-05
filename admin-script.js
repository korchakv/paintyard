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
    
    // Load logo size
    if (data.logoSize) {
        document.getElementById('logo-width').value = data.logoSize.width || 'auto';
        document.getElementById('logo-height').value = data.logoSize.height || '50px';
    }
    
    // Show logo preview if exists
    if (data.logo) {
        showImagePreview('logo-preview', data.logo);
    }
    
    // Load section backgrounds
    if (data.sectionBackgrounds) {
        ['header', 'about', 'products', 'articles', 'footer'].forEach(section => {
            const bgData = data.sectionBackgrounds[section];
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

    renderProductsList(data.products);
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
    
    // Convert to blob and download
    const filename = `${section}-bg.jpg`;
    
    if (imageData.startsWith('data:')) {
        // It's base64
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename;
        link.click();
    } else {
        alert('Використовуйте функцію завантаження файлу для автоматичного перейменування');
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
    saveData(data);
}

// Products management
function renderProductsList(products) {
    const container = document.getElementById('products-list');
    container.innerHTML = products.map(product => `
        <div class="item-card">
            <div class="item-info">
                <h3>${product.name}</h3>
                <p>${product.description} - ${product.price}</p>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editProduct(${product.id})">Редагувати</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">Видалити</button>
            </div>
        </div>
    `).join('');
}

function showAddProductForm() {
    document.getElementById('product-modal-title').textContent = 'Додати товар';
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-modal').style.display = 'block';
}

async function editProduct(id) {
    const data = await loadData();
    const product = data.products.find(p => p.id === id);
    if (product) {
        document.getElementById('product-modal-title').textContent = 'Редагувати товар';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
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
    const price = document.getElementById('product-price').value;
    const image = document.getElementById('product-image').value;

    if (!name || !description || !price) {
        alert('Заповніть всі обов\'язкові поля!');
        return;
    }

    if (id) {
        // Edit existing
        const index = data.products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            data.products[index] = { id: parseInt(id), name, description, price, image };
        }
    } else {
        // Add new
        const newId = data.products.length > 0 ? Math.max(...data.products.map(p => p.id)) + 1 : 1;
        data.products.push({ id: newId, name, description, price, image });
    }

    saveData(data);
    renderProductsList(data.products);
    closeProductModal();
    alert('Товар збережено!');
}

async function deleteProduct(id) {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
        const data = await loadData();
        data.products = data.products.filter(p => p.id !== id);
        saveData(data);
        renderProductsList(data.products);
    }
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Articles management
function renderArticlesList(articles) {
    const container = document.getElementById('articles-list');
    container.innerHTML = articles.map(article => `
        <div class="item-card">
            <div class="item-info">
                <h3>${article.name}</h3>
                <p>${article.excerpt}</p>
            </div>
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

// Initialize
checkAuth();
