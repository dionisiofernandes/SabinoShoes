let products = [];
let cart = JSON.parse(localStorage.getItem('sabino-cart')) || [];
let searchQuery = '';
let selectedProduct = null;
let selectedSize = null;
let selectedColor = null;

const WHATSAPP_NUMBER = '351961234567';

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        renderProducts();
        updateCartUI();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filtered = searchQuery === ''
        ? products
        : products.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.brand.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery) ||
            p.colors.some(c => c.toLowerCase().includes(searchQuery))
          );

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-cart" style="grid-column: 1/-1;">Nenhum sapato encontrado</div>';
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" onclick="openProductModal('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-image"
                 onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27300%27%3E%3Crect width=%27400%27 height=%27300%27 fill=%27%23f5f5f5%27/%3E%3Ctext x=%27200%27 y=%27150%27 text-anchor=%27middle%27 font-family=%27Arial%27 font-size=%2716%27 fill=%27%23999%27%3ESabinoShoes%3C/text%3E%3C/svg%3E';">
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">€${product.price.toFixed(2)}</div>
                <div class="product-stock ${getStockClass(product.stock)}">
                    ${getStockText(product.stock)}
                </div>
            </div>
        </div>
    `).join('');
}

function getStockClass(stock) {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 5) return 'low-stock';
    return 'in-stock';
}

function getStockText(stock) {
    if (stock === 0) return 'Esgotado';
    if (stock <= 5) return `Últimas ${stock} unidades`;
    return `${stock} em stock`;
}

function searchProducts() {
    const input = document.getElementById('search-input');
    searchQuery = input.value.toLowerCase().trim();
    renderProducts();
}

function openProductModal(productId) {
    selectedProduct = products.find(p => p.id === productId);
    selectedSize = null;
    selectedColor = null;

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <img src="${selectedProduct.image}" alt="${selectedProduct.name}" class="modal-image"
             onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27600%27 height=%27300%27%3E%3Crect width=%27600%27 height=%27300%27 fill=%27%23f5f5f5%27/%3E%3Ctext x=%27300%27 y=%27150%27 text-anchor=%27middle%27 font-family=%27Arial%27 font-size=%2724%27 fill=%27%23999%27%3ESabinoShoes%3C/text%3E%3C/svg%3E';">
        <div class="modal-details">
            <div class="modal-brand">${selectedProduct.brand}</div>
            <h2>${selectedProduct.name}</h2>
            <div class="modal-price">€${selectedProduct.price.toFixed(2)}</div>
            <p class="modal-description">${selectedProduct.description}</p>

            <div class="size-selector">
                <h3>Tamanho:</h3>
                <div class="size-options">
                    ${selectedProduct.sizes.map(size => `
                        <div class="size-option" onclick="selectSize(${size}, event)">${size}</div>
                    `).join('')}
                </div>
            </div>

            <div class="color-selector">
                <h3>Cor:</h3>
                <div class="color-options">
                    ${selectedProduct.colors.map(color => `
                        <div class="color-option" onclick="selectColor('${color}', event)">${color}</div>
                    `).join('')}
                </div>
            </div>

            <button class="add-to-cart-modal" id="modal-add-btn" onclick="addToCartFromModal()" disabled>
                Seleciona tamanho e cor
            </button>
        </div>
    `;

    modal.classList.add('open');
}

function selectSize(size, event) {
    event.stopPropagation();
    selectedSize = size;
    document.querySelectorAll('.size-option').forEach(el => {
        el.classList.toggle('selected', parseInt(el.textContent) === size);
    });
    updateAddButton();
}

function selectColor(color, event) {
    event.stopPropagation();
    selectedColor = color;
    document.querySelectorAll('.color-option').forEach(el => {
        el.classList.toggle('selected', el.textContent === color);
    });
    updateAddButton();
}

function updateAddButton() {
    const btn = document.getElementById('modal-add-btn');
    if (selectedSize && selectedColor) {
        btn.disabled = false;
        btn.textContent = 'Adicionar ao Carrinho';
    } else {
        btn.disabled = true;
        btn.textContent = 'Seleciona tamanho e cor';
    }
}

function addToCartFromModal() {
    if (!selectedSize || !selectedColor) {
        alert('Por favor seleciona o tamanho e a cor');
        return;
    }

    addToCart(selectedProduct, selectedSize, selectedColor);
    closeModal();
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('open');
}

function addToCart(product, size, color, quantity = 1) {
    const existingItem = cart.find(item =>
        item.id === product.id &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            size: size,
            color: color,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('sabino-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;

    const itemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    if (cart.length === 0) {
        itemsDiv.innerHTML = '<div class="empty-cart">O carrinho está vazio</div>';
        totalSpan.textContent = '0.00';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    itemsDiv.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2760%27 height=%2760%27%3E%3Crect width=%2760%27 height=%2760%27 fill=%27%23f5f5f5%27/%3E%3Ctext x=%2730%27 y=%2730%27 text-anchor=%27middle%27 font-family=%27Arial%27 font-size=%278%27 fill=%27%23999%27%3EShoe%3C/text%3E%3C/svg%3E';">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <small>${item.brand} | Tamanho: ${item.size} | Cor: ${item.color}</small>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${index})">Remover</button>
                </div>
                <strong>€${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
        </div>
    `).join('');

    totalSpan.textContent = total.toFixed(2);
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('O carrinho está vazio');
        return;
    }

    const phone = document.getElementById('customer-phone').value;
    if (!phone || !/^9[1236][0-9]{7}$/.test(phone)) {
        alert('Por favor insere um número válido de telemóvel (ex: 961234567)');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let message = `*Novo Pedido - SabinoShoes*\n\n`;
    message += `*Itens:*\n`;
    cart.forEach(item => {
        message += `• ${item.name} (${item.brand})\n`;
        message += `  Tamanho: ${item.size} | Cor: ${item.color}\n`;
        message += `  Qtd: ${item.quantity} x €${item.price.toFixed(2)} = €${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    message += `\n*Total: €${total.toFixed(2)}*\n`;
    message += `\n*Meu número para MB WAY:* ${phone}`;
    message += `\n\nPor favor confirma a disponibilidade e envia o pedido de pagamento MB WAY. Obrigado!`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    clearCart();
    toggleCart();
}

loadProducts();
