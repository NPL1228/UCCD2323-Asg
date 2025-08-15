const menuBtn = document.getElementById("menuIcon")
menuBtn.addEventListener('click', function () {
    console.log('Clicked');
    document.getElementById('filter-container').classList.toggle('show');

});
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
const availabilityText = document.querySelector('.availability');
let max = parseInt(availabilityText.textContent);

document.querySelector('.minus').addEventListener('click', function () {
    const input = document.querySelector('.quantity-input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
});

document.querySelector('.plus').addEventListener('click', function () {
    const input = document.querySelector('.quantity-input');
    if (parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
    }
});

//related-product

const container = document.querySelector('.related-container-2');
const leftArrow = document.querySelector('.arrowLeft');
const rightArrow = document.querySelector('.arrowRight');

let scrollSpeed = 1; // pixels per frame
let direction = 1; // 1 = right, -1 = left
let autoScrollActive = true; // control flag
let autoScrollTimeout;

function getProductWidth() {
    const firstProduct = container.querySelector('.related-product');
    const style = window.getComputedStyle(firstProduct);
    const marginRight = parseInt(style.marginRight) || 0;
    return firstProduct.offsetWidth + marginRight;
}

function updateArrows() {
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    leftArrow.classList.toggle('hidden', container.scrollLeft <= 0);
    rightArrow.classList.toggle('hidden', container.scrollLeft >= maxScrollLeft - 1);
}

function pauseAutoScroll() {
    autoScrollActive = false;
    clearTimeout(autoScrollTimeout);
    autoScrollTimeout = setTimeout(() => {
        autoScrollActive = true;
    }, 500); // resume after 2s
}

leftArrow.addEventListener('click', () => {
    pauseAutoScroll();
    container.scrollBy({ left: -getProductWidth(), behavior: 'smooth' });
});
rightArrow.addEventListener('click', () => {
    pauseAutoScroll();
    container.scrollBy({ left: getProductWidth(), behavior: 'smooth' });
});

container.addEventListener('scroll', updateArrows);
window.addEventListener('resize', updateArrows);

updateArrows();

// animation move slowly
function autoScroll() {
    if (autoScrollActive) {
        container.scrollLeft += scrollSpeed * direction;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) direction = -1;
        if (container.scrollLeft <= 0) direction = 1;
    }
    requestAnimationFrame(autoScroll);
}

autoScroll();

// Filter category selection
const categoryItems = document.querySelectorAll('.filter-options li');
categoryItems.forEach(item => {
    item.addEventListener('click', function () {
        categoryItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});
