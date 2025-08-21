const menuBtn = document.getElementById("menuIcon")
menuBtn.addEventListener('click', function () {
    console.log('Clicked');
    document.getElementById('filter-container').classList.toggle('show');

});

// Load product data
const productImagesContainer = document.getElementById('productImages');
const productNameElement = document.getElementById('product-name');
const productPriceElement = document.getElementById('product-price');
const productDescElement = document.getElementById('product-desc');
const detailsContent = document.getElementById('details');
const includesContent = document.getElementById('includes');
const stockAvailability = document.getElementById('stockAvailability');
let currentStock = 0;
const relatedProductsContainer = document.getElementById('relatedProducts');
let productsData = []; // This will store our loaded products

// Load product data from JSON file
async function loadProductData() {
    try {
        const response = await fetch('js/productInfo.json');
        if (!response.ok) {
            throw new Error('Failed to load products data');
        }
        const data = await response.json();
        productsData = data.products;
    } catch (error) {
        console.error('Error loading product data:', error);
        showAlert('danger', 'Failed to load product information');
    }
}

function loadProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) {
        showAlert('danger', 'Product not found');
        return;
    }

    // Update main product info
    productNameElement.textContent = product.name;
    productPriceElement.textContent = formatPrice(product.price);
    productDescElement.textContent = product.description;
    stockAvailability.textContent = `${product.stock} items available`;
    currentStock = product.stock;

    // Update images
    productImagesContainer.innerHTML = '';
    product.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = product.name;
        img.loading = 'lazy'; // Add lazy loading
        productImagesContainer.appendChild(img);
    });

    // Update details
    detailsContent.innerHTML = `
        <div>
            <img src="picture/productDetail/puzzle-piece.png" alt="puzzle" width="25px" height="25px">
            <span>Pieces: </span>
            <p>${product.details.pieces}</p>
        </div>
        <div>
            <img src="picture/productDetail/material.png" alt="material" width="25px" height="25px">
            <span>Materials: </span>
            <p>${product.details.material}</p>
        </div>
        <div>
            <img src="picture/productDetail/maximize.png" alt="maximise" width="25px" height="25px">
            <span>Size: </span>
            <p>${product.details.size}</p>
        </div>
    `;

    // Update includes
    includesContent.innerHTML = `
        <p><strong>The package includes</strong></p>
        <ul>
            ${product.includes.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;

    // Load related products (excluding current product)
    loadRelatedProducts(productId, product.category);
}

// Load related products
function loadRelatedProducts(currentProductId) {
    relatedProductsContainer.innerHTML = '';

    // Filter related products (same category, excluding current product)
    const relatedProducts = productsData.filter(product =>
        product.id !== currentProductId);

    // If no related products in same category, show other products
    const productsToShow = relatedProducts.length > 0 ? relatedProducts :
        productsData.filter(product => product.id !== currentProductId);

    // Create product elements
    productsToShow.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'related-product';
        productElement.innerHTML = `
            <img id="related-img" src="${product.images[0]}" alt="${product.name}" width="200" height="200" loading="lazy">
            <p id="related-productName">${product.name}</p>
            <p id="related-price">${formatPrice(product.price)}</p>
            <div id="related-details">
                <div>
                    <img src="picture/productDetail/puzzle-piece.png" alt="puzzle" width="25" height="25">
                    <span>Pieces: </span>
                    <p>${product.details.pieces}</p>
                </div>
                <div>
                    <img src="picture/productDetail/material.png" alt="material" width="25" height="25">
                    <span>Materials: </span>
                    <p>${product.details.material}</p>
                </div>
                <div>
                    <img src="picture/productDetail/maximize.png" alt="maximize" width="25" height="25">
                    <span>Size: </span>
                    <p>${product.details.size}</p>
                </div>
            </div>
        `;

        productElement.addEventListener('click', () => {
            window.scrollTo(0, 0);
            const productContainer = document.querySelector('.product-container-2');
            if (productContainer) productContainer.scrollTop = 0;

            window.history.pushState({}, '', `productDetail.html?id=${product.id}`);
            loadProduct(product.id);
        });

        relatedProductsContainer.appendChild(productElement);
    });

    setupRelatedList();
}

function setupRelatedList() {
    const container = document.querySelector('.related-container-2');
    if (!container) return;

    const leftArrow = document.querySelector('.arrowLeft');
    const rightArrow = document.querySelector('.arrowRight');

    if (container.children.length === 0) return;

    let scrollPos = 0;
    let autoScroll = true;
    let scrollInterval;

    function updateArrows() {
        const maxScroll = container.scrollWidth - container.clientWidth;
        leftArrow.style.visibility = scrollPos <= 0 ? 'hidden' : 'visible';
        rightArrow.style.visibility = scrollPos >= maxScroll - 5 ? 'hidden' : 'visible';
    }

    function scrollTo(position) {
        scrollPos = position;
        container.scrollTo({ left: position, behavior: 'smooth' });
        updateArrows();
    }

    // Auto-scroll logic - RIGHT ONLY with loop
    function startAutoScroll() {
        clearInterval(scrollInterval);
        scrollInterval = setInterval(() => {
            if (!autoScroll) return;

            const maxScroll = container.scrollWidth - container.clientWidth;
            if (scrollPos >= maxScroll) {
                // When reaching end, instantly reset to start (without animation)
                scrollPos = 0;
                container.scrollTo({ left: 0, behavior: 'instant' });
                updateArrows();
            } else {
                // Normal rightward scroll
                scrollTo(scrollPos + 1);
            }
        }, 50);
    }

    // Manual navigation
    leftArrow?.addEventListener('click', () => {
        autoScroll = false;
        scrollTo(Math.max(0, scrollPos - 300));
        setTimeout(() => autoScroll = true, 3000);
    });

    rightArrow?.addEventListener('click', () => {
        autoScroll = false;
        const maxScroll = container.scrollWidth - container.clientWidth;
        scrollTo(Math.min(maxScroll, scrollPos + 300));
        setTimeout(() => autoScroll = true, 3000);
    });

    container.addEventListener('scroll', () => {
        scrollPos = container.scrollLeft;
        updateArrows();
    });

    // Initialize
    updateArrows();
    startAutoScroll();
}
// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductData();
    const productId = getProductIdFromUrl();
    loadProduct(productId);

    document.getElementById('cartIcon')?.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
});

// Helper functions
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || productsData[0]?.id || 'animal12';
}

function formatPrice(price) {
    return `RM${price.toFixed(2)}`;
}

function showAlert(type, message) {
    // Implement your alert/notification system here
    console.log(`${type}: ${message}`);
}

// share and wishList
document.addEventListener("DOMContentLoaded", () => {
    const shareButton = document.querySelector(".share");

    shareButton.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent click from bubbling
        shareButton.classList.toggle("active");
    });

    // Optional: Click anywhere else to close
    document.addEventListener("click", () => {
        shareButton.classList.remove("active");
    });
});

const wishList = document.querySelector(".wishList");
let wish = false;
wishList.addEventListener('click', function () {
    wish = !wish; //false become true, true become false
    if (wish) {
        wishList.src = "picture/productDetail/redHeart.png";
    } else {
        wishList.src = "picture/productDetail/heart.png";
    }
    // Add animation
    wishList.classList.add('pop');

    // Remove animation class after it runs
    setTimeout(() => {
        wishList.classList.remove('pop');
    }, 300);

    //messeage
    const message = document.createElement("div");
    message.className = "wishlist-message";
    if (wish) {
        message.textContent = "Added to wish list";
    } else {
        message.textContent = "Removed from wish list";
    }
    document.body.appendChild(message);


    // Show & fade out
    setTimeout(() => {
        message.classList.add("show");
    }, 10); // small delay so CSS transition works

    setTimeout(() => {
        message.classList.remove("show");
        setTimeout(() => message.remove(), 300); // remove from DOM after fade
    }, 1500); // message stays for 1.5s
});
//product tab
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // Remove active from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active to clicked button and matching content
        btn.classList.add('active');
        tabContents[index].classList.add('active');
    });
});

//testing
const cartBtn = document.getElementById("cartIcon")
cartBtn.addEventListener('click', function () {
    console.log('Clicked');
    console.log(document.getElementById('signInUp')); // Should log the element
    console.log(document.getElementById('cart')); // Should log the element
    document.getElementById('signInUp').classList.toggle('hidden');
    document.getElementById('cart').classList.toggle('hidden');


});
const signInBtn = document.getElementById("signIn")
signInBtn.addEventListener('click', function () {
    console.log('Clicked');
    document.getElementById('signInUp').classList.toggle('hidden');
    document.getElementById('cart').classList.toggle('hidden');

});


const priceRange = document.querySelector('.price-range');
const sliderValue = document.querySelector('.slider-value')
priceRange.addEventListener('input', function () {
    sliderValue.textContent = this.value;
});

// Quantity control functionality
document.querySelector('.minus').addEventListener('click', function () {
    const input = document.querySelector('.quantity-input');
    let value = parseInt(input.value) || 1;
    if (value > 1) {
        input.value = value - 1;
    }
});

document.querySelector('.plus').addEventListener('click', function () {
    const input = document.querySelector('.quantity-input');
    let value = parseInt(input.value) || 1;
    if (value < currentStock) {
        input.value = value + 1;
    }
});


// Filter category selection
const categoryItems = document.querySelectorAll('.filter-options li');
categoryItems.forEach(item => {
    item.addEventListener('click', function () {
        categoryItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

