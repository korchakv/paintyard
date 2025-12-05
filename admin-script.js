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

// Show admin panel
function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadAdminData();
}

// Load data from localStorage
function loadData() {
    const storedData = localStorage.getItem('paintyardData');
    if (!storedData) {
        // Initialize with default data from script.js
        const defaultData = {
            logo: '',
            address: 'м. Київ, вул. Прикладна, 1',
            phones: ['+380 (44) 123-45-67', '+380 (50) 123-45-67'],
            aboutText: 'Наш магазин "Paintyard" пропонує широкий асортимент якісних фарб, лаків та будівельних матеріалів. Ми працюємо на ринку понад 10 років та допомагаємо нашим клієнтам втілити в життя найсміливіші дизайнерські рішення. У нас ви знайдете продукцію провідних виробників за найкращими цінами.',
            products: [
                {
                    id: 1,
                    name: 'Фарба інтер\'єрна біла',
                    description: 'Високоякісна фарба для внутрішніх робіт',
                    price: '450 грн',
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EФарба%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 2,
                    name: 'Емаль для дерева',
                    description: 'Захисна емаль для дерев\'яних поверхонь',
                    price: '380 грн',
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EЕмаль%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 3,
                    name: 'Лак для паркету',
                    description: 'Глянцевий лак для паркетних підлог',
                    price: '620 грн',
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16"%3EЛак%3C/text%3E%3C/svg%3E'
                }
            ],
            articles: [
                {
                    id: 1,
                    name: 'Як вибрати фарбу для стін',
                    excerpt: 'Поради професіоналів щодо вибору інтер\'єрної фарби',
                    content: '<h1>Як вибрати фарбу для стін</h1><p>При виборі фарби для стін потрібно враховувати декілька важливих факторів...</p><p>1. Тип приміщення - для вологих приміщень обирайте вологостійкі фарби</p><p>2. Тип поверхні - для різних матеріалів підходять різні типи фарб</p><p>3. Бажаний ефект - матовий, глянцевий або напівматовий</p>',
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EСтаття 1%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 2,
                    name: 'Підготовка поверхні перед фарбуванням',
                    excerpt: 'Важливі етапи підготовки для ідеального результату',
                    content: '<h1>Підготовка поверхні перед фарбуванням</h1><p>Якісна підготовка поверхні - запорука успіху...</p><p>Етапи підготовки:</p><ul><li>Очищення поверхні від старого покриття</li><li>Шпаклювання тріщин та нерівностей</li><li>Шліфування</li><li>Ґрунтування</li></ul>',
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EСтаття 2%3C/text%3E%3C/svg%3E'
                }
            ],
            colors: {
                headerBg: '#2c3e50',
                mainBg: '#f4f4f4'
            }
        };
        localStorage.setItem('paintyardData', JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(storedData);
}

// Save data to localStorage
function saveData(data) {
    localStorage.setItem('paintyardData', JSON.stringify(data));
}

// Load admin data into form
function loadAdminData() {
    const data = loadData();

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
