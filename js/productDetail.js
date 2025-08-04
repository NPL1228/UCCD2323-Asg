const menuBtn = document.getElementById("menuIcon")
menuBtn.addEventListener('click', function() {
    console.log('Clicked');
    document.getElementById('filter-container').classList.toggle('show');

});

//testing
const profileBtn = document.getElementById("profile")
signInBtn.addEventListener('click', function() {
    console.log('Clicked');
    document.getElementById('signInUp').classList.toggle('hidden');
    document.getElementById('cart').classList.toggle('hidden');

});


const priceRange = document.querySelector('.price-range');
const sliderValue = document.querySelector('.slider-value')
priceRange.addEventListener('input', function() {
  sliderValue.textContent = this.value;
});

// Quantity control functionality
document.querySelector('.minus').addEventListener('click', function() {
    const input = document.querySelector('.quantity-input');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
});

document.querySelector('.plus').addEventListener('click', function() {
    const input = document.querySelector('.quantity-input');
    const max = parseInt(input.getAttribute('max'));
    if (parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
    }
});

// Filter category selection
const categoryItems = document.querySelectorAll('.filter-options li');
categoryItems.forEach(item => {
    item.addEventListener('click', function() {
        categoryItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});