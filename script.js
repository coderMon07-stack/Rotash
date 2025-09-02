document.addEventListener('DOMContentLoaded', () => {
    
    const products = [
        { id: 1, name: 'Natural Greek Yogurt', price: 3.50, image: 'https://images.pexels.com/photos/3730949/pexels-photo-3730949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
        { id: 2, name: 'Rich Chocolate Pudding', price: 2.75, image: 'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
        { id: 3, name: 'Farm Fresh Milk (1L)', price: 1.80, image: 'https://images.pexels.com/photos/2449658/pexels-photo-2449658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
        { id: 4, name: 'Artisanal Feta Cheese', price: 5.20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFz_7QhTT_xn7aXdGGSq010glQnNBJmtREsA&s' },
    ];
    let cart = [];

    // --- Mobile Navigation ---
    const hamburger = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    hamburger.addEventListener('click', () => { mobileNav.classList.toggle('active'); });
    mobileNavLinks.forEach(link => { link.addEventListener('click', () => { mobileNav.classList.remove('active'); }); });

    // --- THEME SWITCHER ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark-theme') {
        document.body.classList.add('dark-theme');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = '';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark-theme';
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        localStorage.setItem('theme', theme);
    });

    // --- Product Loading ---
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = products.map(product => `<div class="product-card reveal"><img src="${product.image}" alt="${product.name}"><div class="product-info"><h3>${product.name}</h3><p class="price">$${product.price.toFixed(2)}</p><button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button></div></div>`).join('');
    
    // --- Cart Management ---
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const whatsappBtn = document.getElementById('whatsapp-order');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    window.addToCart = (productId) => { const p = products.find(pr => pr.id === productId), c = cart.find(i => i.id === productId); c ? c.quantity++ : cart.push({ ...p, quantity: 1 }); updateCart(); };
    window.changeQuantity = (productId, amount) => { const c = cart.find(i => i.id === productId); if (c) { c.quantity += amount; if (c.quantity <= 0) { cart = cart.filter(i => i.id !== productId); } } updateCart(); };
    window.clearCart = () => { cart = []; updateCart(); };

    function updateCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p>Your cart is currently empty.</p>';
            cartTotalEl.innerHTML = '';
            whatsappBtn.classList.add('disabled');
            clearCartBtn.style.display = 'none';
        } else {
            cartItemsEl.innerHTML = cart.map(item => `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div class="item-details" style="flex-grow:1;"><strong>${item.name}</strong><div>$${item.price.toFixed(2)}</div></div><div class="item-controls"><button onclick="changeQuantity(${item.id}, -1)">-</button> <span>${item.quantity}</span> <button onclick="changeQuantity(${item.id}, 1)">+</button></div></div>`).join('');
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotalEl.innerHTML = `<strong>Total:</strong> $${totalPrice.toFixed(2)}`;
            whatsappBtn.classList.remove('disabled');
            clearCartBtn.style.display = 'block';
        }
    }
    
    window.toggleCart = () => { const modal = document.getElementById('cart-modal'); if (modal.style.display === 'flex') { modal.style.display = 'none'; } else { modal.style.display = 'flex'; } };

    whatsappBtn.addEventListener('click', () => { if (cart.length === 0) return; const phoneNumber = '9647507544111'; let message = 'Hello Rotash, I would like to place the following order:\n\n'; cart.forEach(item => { message += `- ${item.name} (x${item.quantity})\n`; }); const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2); message += `\n*Total: $${total}*`; const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`; window.open(whatsappUrl, '_blank'); });

    // --- On-Scroll Animations ---
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('show'); } }); }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => { observer.observe(el); });

    updateCart();
});