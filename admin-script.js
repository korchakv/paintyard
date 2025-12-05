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

// Load data from data.json
async function loadData() {
    if (!siteData) {
        try {
            const response = await fetch('data.json');
            siteData = await response.json();
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

// Save data - updates the in-memory copy
function saveData(data) {
    siteData = data;
}

// Download data.json file
function downloadDataJson() {
    const data = siteData;
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

// Load admin data into form
async function loadAdminData() {
    const data = await loadData();

    document.getElementById('logo-input').value = data.logo || '';
    document.getElementById('address-input').value = data.address || '';
    document.getElementById('phones-input').value = data.phones.join('\n');
    document.getElementById('about-input').value = data.aboutText || '';
    document.getElementById('header-color').value = data.colors.headerBg;
    document.getElementById('main-color').value = data.colors.mainBg;

    renderProductsList(data.products);
    renderArticlesList(data.articles);
}

// Update functions
function updateLogo() {
    const data = loadData();
    data.logo = document.getElementById('logo-input').value;
    saveData(data);
    alert('Логотип оновлено!');
}

function updateAddress() {
    const data = loadData();
    data.address = document.getElementById('address-input').value;
    saveData(data);
    alert('Адресу оновлено!');
}

function updatePhones() {
    const data = loadData();
    const phonesText = document.getElementById('phones-input').value;
    data.phones = phonesText.split('\n').filter(p => p.trim() !== '');
    saveData(data);
    alert('Телефони оновлено!');
}

function updateAbout() {
    const data = loadData();
    data.aboutText = document.getElementById('about-input').value;
    saveData(data);
    alert('Текст "Про нас" оновлено!');
}

function updateColors() {
    const data = loadData();
    data.colors.headerBg = document.getElementById('header-color').value;
    data.colors.mainBg = document.getElementById('main-color').value;
    saveData(data);
    alert('Кольори оновлено!');
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

function editProduct(id) {
    const data = loadData();
    const product = data.products.find(p => p.id === id);
    if (product) {
        document.getElementById('product-modal-title').textContent = 'Редагувати товар';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-modal').style.display = 'block';
    }
}

function saveProduct() {
    const data = loadData();
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

function deleteProduct(id) {
    if (confirm('Ви впевнені, що хочете видалити цей товар?')) {
        const data = loadData();
        data.products = data.products.filter(p => p.id !== id);
        saveData(data);
        renderProductsList(data.products);
        alert('Товар видалено!');
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

function editArticle(id) {
    const data = loadData();
    const article = data.articles.find(a => a.id === id);
    if (article) {
        document.getElementById('article-modal-title').textContent = 'Редагувати статтю';
        document.getElementById('article-id').value = article.id;
        document.getElementById('article-name').value = article.name;
        document.getElementById('article-excerpt').value = article.excerpt;
        document.getElementById('article-image').value = article.image;
        document.getElementById('article-content').value = article.content;
        document.getElementById('article-modal').style.display = 'block';
    }
}

function saveArticle() {
    const data = loadData();
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

function deleteArticle(id) {
    if (confirm('Ви впевнені, що хочете видалити цю статтю?')) {
        const data = loadData();
        data.articles = data.articles.filter(a => a.id !== id);
        saveData(data);
        renderArticlesList(data.articles);
        alert('Статтю видалено!');
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
