// ============= GLOBAL STATE =============
let currentUser = null;
let currentToken = localStorage.getItem('token');
let cart = [];
let products = [];

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in
    if (currentToken) {
        loadUserProfile();
    } else {
        updateAuthUI();
    }
    
    // Load products
    loadProducts();
}

// ============= NAVIGATION FUNCTIONS =============
function showHome() {
    hideAllPages();
    document.getElementById('homePage').classList.remove('hidden');
}

function showProducts() {
    hideAllPages();
    document.getElementById('productsPage').classList.remove('hidden');
}

function showCart() {
    if (!currentToken) {
        showMessage('कृपया पहिले लॉगइन करा', 'error');
        showAuth();
        return;
    }
    hideAllPages();
    displayCart();
    document.getElementById('cartPage').classList.remove('hidden');
}

function showCheckout() {
    hideAllPages();
    displayCheckoutSummary();
    document.getElementById('checkoutPage').classList.remove('hidden');
}

function showProfile() {
    if (!currentToken) {
        showMessage('कृपया पहिले लॉगइन करा', 'error');
        showAuth();
        return;
    }
    hideAllPages();
    loadUserProfile();
    displayUserOrders();
    document.getElementById('profilePage').classList.remove('hidden');
}

function showAdmin() {
    hideAllPages();
    loadAdminOrders();
    document.getElementById('adminPage').classList.remove('hidden');
}

function showAuth() {
    hideAllPages();
    document.getElementById('authPage').classList.remove('hidden');
    document.getElementById('loginBox').classList.remove('hidden');
    document.getElementById('signupBox').classList.add('hidden');
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
}

function toggleAuth() {
    document.getElementById('loginBox').classList.toggle('hidden');
    document.getElementById('signupBox').classList.toggle('hidden');
}

// ============= AUTHENTICATION FUNCTIONS =============
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentToken = data.token;
            currentUser = data.user;
            showMessage('साइन अप यशस्वी! आपण लॉगइन आहात', 'success');
            updateAuthUI();
            showHome();
        } else {
            showMessage(data.error || 'साइन अप अयशस्वी', 'error');
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentToken = data.token;
            currentUser = data.user;
            showMessage('लॉगइन यशस्वी!', 'success');
            updateAuthUI();
            showHome();
        } else {
            showMessage(data.error || 'लॉगइन अयशस्वी', 'error');
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

function logout() {
    localStorage.removeItem('token');
    currentToken = null;
    currentUser = null;
    cart = [];
    updateAuthUI();
    showMessage('आप लॉगआउट झाले आहात', 'success');
    showHome();
}

function updateAuthUI() {
    const authLink = document.getElementById('authLink');
    
    if (currentToken && currentUser) {
        authLink.innerHTML = `${currentUser.name} - <a href="#" onclick="logout()">लॉगआउट</a>`;
        authLink.style.cursor = 'default';
    } else {
        authLink.textContent = 'लॉगइन';
        authLink.onclick = () => showAuth();
    }
}

// ============= PRODUCTS FUNCTIONS =============
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts();
    } catch (error) {
        showMessage('उत्पाद लोड करणे अयशस्वी', 'error');
    }
}

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image || '🐛'}</div>
            <div class="product-content">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">₹${product.price}</div>
                <div class="product-quantity">
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="${product.quantity}">
                    <span>उपलब्ध: ${product.quantity}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">कार्टमध्ये जोडा</button>
                    <button class="btn btn-secondary btn-small" onclick="addToCart(${product.id}, true)">आणि कार्टवर जा</button>
                </div>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

// ============= CART FUNCTIONS =============
async function addToCart(productId, goToCart = false) {
    if (!currentToken) {
        showMessage('कृपया पहिले लॉगइन करा', 'error');
        showAuth();
        return;
    }

    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    const product = products.find(p => p.id === productId);

    if (quantity > product.quantity) {
        showMessage('अनुरोधित प्रमाण उपलब्ध नाही', 'error');
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ product_id: productId, quantity })
        });

        if (response.ok) {
            showMessage('कार्टमध्ये यशस्वीरित्या जोडले गेले', 'success');
            updateCartCount();
            
            if (goToCart) {
                setTimeout(() => showCart(), 500);
            }
        } else {
            showMessage('कार्टमध्ये जोडणे अयशस्वी', 'error');
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

async function loadCart() {
    try {
        const response = await fetch('/api/cart', {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.ok) {
            cart = await response.json();
            updateCartCount();
            return cart;
        }
    } catch (error) {
        showMessage('कार्ट लोड करणे अयशस्वी', 'error');
    }
    return [];
}

async function updateCartCount() {
    const cart = await loadCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

async function displayCart() {
    const cart = await loadCart();
    const cartContent = document.getElementById('cartContent');

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <p>आपला कार्ट रिक्त आहे</p>
                <button class="btn btn-primary" onclick="showProducts()">उत्पाद पहा</button>
            </div>
        `;
        return;
    }

    const cartHTML = `
        <div class="cart-container">
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-quantity">प्रमाण: ${item.quantity}</div>
                        </div>
                        <div class="cart-item-price">₹${(item.quantity * item.price).toLocaleString('en-IN')}</div>
                        <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.id})">हटवा</button>
                    </div>
                `).join('')}
            </div>

            <div class="cart-summary">
                <div class="summary-row">
                    <span>कुल वस्तू:</span>
                    <span>${cart.length}</span>
                </div>
                <div class="summary-row">
                    <span>कुल प्रमाण:</span>
                    <span>${cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div class="summary-row summary-total">
                    <span>कुल रुपये:</span>
                    <span>₹${cart.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString('en-IN')}</span>
                </div>
            </div>

            <div class="cart-actions">
                <button class="btn btn-secondary" onclick="showProducts()">खरेदी सुरू ठेवा</button>
                <button class="btn btn-primary" onclick="showCheckout()">चेकआउट करा</button>
            </div>
        </div>
    `;

    cartContent.innerHTML = cartHTML;
}

async function removeFromCart(itemId) {
    try {
        const response = await fetch(`/api/cart/${itemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.ok) {
            showMessage('कार्टमधून हटवले गेले', 'success');
            displayCart();
            updateCartCount();
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

// ============= CHECKOUT FUNCTIONS =============
async function displayCheckoutSummary() {
    const cart = await loadCart();
    const total = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    const summary = document.getElementById('orderSummary');
    summary.innerHTML = `
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 5px;">
            ${cart.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.name} x${item.quantity}</span>
                    <span>₹${(item.quantity * item.price).toLocaleString('en-IN')}</span>
                </div>
            `).join('')}
            <hr style="margin: 1rem 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
                <span>कुल:</span>
                <span>₹${total.toLocaleString('en-IN')}</span>
            </div>
        </div>
    `;
}

async function handleCheckout(event) {
    event.preventDefault();

    const shipping_address = document.getElementById('shippingAddress').value;
    const city = document.getElementById('shippingCity').value;
    const state = document.getElementById('shippingState').value;
    const pincode = document.getElementById('shippingPincode').value;

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ shipping_address, city, state, pincode })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(`ऑर्डर यशस्वीरित्या प्लेस झाला! ऑर्डर ID: ${data.orderId}`, 'success');
            cart = [];
            updateCartCount();
            setTimeout(() => showProfile(), 1000);
        } else {
            showMessage(data.error || 'ऑर्डर प्लेस करणे अयशस्वी', 'error');
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

// ============= PROFILE FUNCTIONS =============
async function loadUserProfile() {
    try {
        const response = await fetch('/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.ok) {
            const profile = await response.json();
            document.getElementById('profileName').value = profile.name || '';
            document.getElementById('profilePhone').value = profile.phone || '';
            document.getElementById('profileAddress').value = profile.address || '';
            document.getElementById('profileCity').value = profile.city || '';
            document.getElementById('profileState').value = profile.state || '';
            document.getElementById('profilePincode').value = profile.pincode || '';
        }
    } catch (error) {
        showMessage('प्रोफाइल लोड करणे अयशस्वी', 'error');
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();

    const name = document.getElementById('profileName').value;
    const phone = document.getElementById('profilePhone').value;
    const address = document.getElementById('profileAddress').value;
    const city = document.getElementById('profileCity').value;
    const state = document.getElementById('profileState').value;
    const pincode = document.getElementById('profilePincode').value;

    try {
        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({ name, phone, address, city, state, pincode })
        });

        if (response.ok) {
            showMessage('प्रोफाइल यशस्वीरित्या अपडेट झाले', 'success');
        } else {
            showMessage('प्रोफाइल अपडेट अयशस्वी', 'error');
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

async function displayUserOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.ok) {
            const orders = await response.json();
            const ordersContainer = document.getElementById('userOrders');

            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p>अद्याप कोणताही ऑर्डर नाही</p>';
                return;
            }

            ordersContainer.innerHTML = orders.map(order => `
                <div class="order-card">
                    <h4>ऑर्डर #${order.id}</h4>
                    <div class="order-info">
                        <div><strong>तारीख:</strong> ${new Date(order.created_at).toLocaleDateString('mr-IN')}</div>
                        <div><strong>कुल:</strong> ₹${order.total.toLocaleString('en-IN')}</div>
                        <div><strong>पता:</strong> ${order.shipping_address}, ${order.city}</div>
                        <div>
                            <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        showMessage('ऑर्डर लोड करणे अयशस्वी', 'error');
    }
}

function getStatusLabel(status) {
    const statusLabels = {
        'pending': 'प्रलंबित',
        'confirmed': 'पुष्ट',
        'shipped': 'पाठविले गेले',
        'delivered': 'वितरित'
    };
    return statusLabels[status] || status;
}

// ============= ADMIN FUNCTIONS =============
async function loadAdminOrders() {
    try {
        const response = await fetch('/api/admin/orders');
        const orders = await response.json();
        displayAdminOrders(orders);
    } catch (error) {
        showMessage('ऑर्डर लोड करणे अयशस्वी', 'error');
    }
}

function displayAdminOrders(orders) {
    const tbody = document.getElementById('adminOrdersBody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.name} (${order.phone})</td>
            <td>₹${order.total.toLocaleString('en-IN')}</td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, this.value, '${order.payment_status}')">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>प्रलंबित</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>पुष्ट</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>पाठविले गेले</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>वितरित</option>
                </select>
            </td>
            <td>
                <select onchange="updateOrderStatus(${order.id}, '${order.status}', this.value)">
                    <option value="pending" ${order.payment_status === 'pending' ? 'selected' : ''}>प्रलंबित</option>
                    <option value="paid" ${order.payment_status === 'paid' ? 'selected' : ''}>भुगतान केले</option>
                </select>
            </td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteOrder(${order.id})">हटवा</button>
            </td>
        </tr>
    `).join('');
}

async function updateOrderStatus(orderId, status, paymentStatus) {
    try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, payment_status: paymentStatus })
        });

        if (response.ok) {
            showMessage('ऑर्डर अपडेट झाला', 'success');
            loadAdminOrders();
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('या ऑर्डरला हटवायचे आहे?')) return;

    try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('ऑर्डर हटवला गेला', 'success');
            loadAdminOrders();
        }
    } catch (error) {
        showMessage('त्रुटी: ' + error.message, 'error');
    }
}

// ============= MESSAGE DISPLAY =============
function showMessage(message, type = 'success') {
    const messageEl = document.getElementById(type === 'success' ? 'successMessage' : 'errorMessage');
    messageEl.textContent = message;
    messageEl.classList.remove('hidden');

    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}

// ============= EVENT LISTENERS =============
document.getElementById('cartLink').addEventListener('click', (e) => {
    e.preventDefault();
    showCart();
});
