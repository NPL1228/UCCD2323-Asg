const navLinks = document.querySelectorAll('.nav-pills a');

// Add click event to each link
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show the target section
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).classList.add('active');
    });
});

// Initialize the data when the page loads
document.addEventListener('DOMContentLoaded', initializeData);

// Initialize all data from localStorage
function initializeData() {
    initializeProfile();
    initializeBanksCard();
    initializeAddresses();
}

// PROFILE FUNCTIONS
function initializeProfile() {
    let profileData = JSON.parse(localStorage.getItem('profileData'));

    if (!profileData) {
        // Set default values if no data exists
        profileData = {
            username: 'user',
            email: '',
            countryCode: '+60',
            phone: '',
            gender: 'male',
            dob: ''
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }

    // Update the view with stored values
    updateProfileView(profileData);
}

function updateProfileView(profileData) {
    document.getElementById('username').textContent = profileData.username;
    document.getElementById('email').textContent = profileData.email;
    document.getElementById('countryCode').textContent = profileData.countryCode;
    document.getElementById('phone').textContent = profileData.phone;
    document.getElementById('dob').textContent = formatDateDMY(profileData.dob);
    document.getElementById('gender').textContent = profileData.gender;
}

function loadEditForm() {
    const profileData = JSON.parse(localStorage.getItem('profileData'));

    if (profileData) {
        document.getElementById('editUsername').value = profileData.username;
        document.getElementById('editEmail').value = profileData.email;
        document.getElementById('editCountryCode').value = profileData.countryCode;
        document.getElementById('editPhone').value = profileData.phone;
        document.getElementById('editDob').value = profileData.dob;

        // Set gender radio button
        document.querySelectorAll('input[name="editGender"]').forEach(radio => {
            radio.checked = (radio.value === profileData.gender);
        });
    }
}

function saveProfile() {
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const countryCode = document.getElementById('editCountryCode').value;
    const phone = document.getElementById('editPhone').value;
    const dob = document.getElementById('editDob').value;
    const selectedGender = document.querySelector('input[name="editGender"]:checked');
    const gender = selectedGender ? selectedGender.value : 'other';

    if (isNaN(phone)) {
        alert("Phone numbers must be number digit only!");
        return;
    }

    if (!username || !email || !phone || !dob) {
        alert('Please fill in all required fields');
        return;
    }

    // Create profile data object
    const profileData = {
        username,
        email,
        countryCode,
        phone,
        gender,
        dob
    };

    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));

    // Update the view with new values
    updateProfileView(profileData);

    alert('Profile updated successfully!');

    // Close the popup
    toggleForm('profile');
}



// BANK FUNCTIONS
function initializeBanksCard() {
    let bankCards = JSON.parse(localStorage.getItem('bankCards'));

    if (!bankCards) {
        bankCards = [];
        localStorage.setItem('bankCards', JSON.stringify(bankCards));
    }

    // Update the view with stored values
    updateBankCardsView(bankCards);
}

function updateBankCardsView(bankCards) {
    const container = document.getElementById('bankCardsContainer');
    container.innerHTML = '';

    bankCards.forEach((bankCard, index) => {
        const cardItem = document.createElement('li');
        cardItem.className = 'card-item';
        cardItem.addEventListener("click", () => showBankCardInfo(index));
        cardItem.innerHTML = `
                    <div class="card-details" >
                        <h5>${bankCard.bankCardName}</h5>
                        <p><strong>Account:</strong> **** **** **** ${bankCard.accountNumber.slice(-4)}</p>
                        <p><strong>Expires:</strong> ${bankCard.expiryDate}</p>
                    </div>
                    <div class="info-btn">
                        <i class="fas fa-info"></i>
                    </div>
                `;
        container.appendChild(cardItem);
    });
}

function loadBankCardForm(index = -1) {
    const bankCards = JSON.parse(localStorage.getItem('bankCards')) || [];

    // account number input formatter
    const accountNumberInput = document.getElementById("accountNumber");
    if (accountNumberInput && !accountNumberInput.hasListener) {
        accountNumberInput.addEventListener("input", function () {
            let digits = this.value.replace(/\D/g, ""); // only numbers

            if (digits.length > 16) digits = digits.substring(0, 16); // max 16
            this.value = digits.replace(/(.{4})/g, "$1 ").trim(); // format xxxx xxxx xxxx xxxx

        });
        accountNumberInput.hasListener = true; // prevent double-binding
    }

    if (index >= 0 && index < bankCards.length) {
        // Editing existing bankCard
        document.getElementById('bankCardFormTitle').textContent = 'Edit Bank Card Account';
        document.getElementById('editBankCardIndex').value = index;

        const bankCard = bankCards[index];
        document.getElementById('bankCardName').value = bankCard.bankCardName;
        document.getElementById('accountNumber').value = bankCard.accountNumber;
        document.getElementById('expiryDate').value = bankCard.expiryDate;
        document.getElementById('cvv').value = bankCard.cvv;
    } else {
        // Adding new bankCard
        document.getElementById('bankCardFormTitle').textContent = 'Add New Bank Card';
        document.getElementById('editBankCardIndex').value = -1;

        // Reset form
        document.getElementById('bankCardName').value = '';
        document.getElementById('accountNumber').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('cvv').value = '';
    }
}

function saveBankCard() {
    const index = parseInt(document.getElementById('editBankCardIndex').value);
    const bankCardName = document.getElementById('bankCardName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const expireInput = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv').value; // regex pattern \D: any char not a digit g:global search

    if (isNaN(cvv)) {
        alert("CVV must be number digit only!");
        return;
    }

    if (!formatDateMY(expireInput)) {
        window.alert('Month must be between 01 and 12');
        return;
    }
    const expiryDate = expireInput.value;

    if (!bankCardName || !accountNumber || !expiryDate || !cvv) {
        alert('Please fill in all fields');
        return;
    }

    const bankCards = JSON.parse(localStorage.getItem('bankCards')) || [];
    const bankCardData = {
        bankCardName,
        accountNumber,
        expiryDate,
        cvv
    };

    if (index >= 0 && index < bankCards.length) {
        // Update existing bankCard
        bankCards[index] = bankCardData;
    } else {
        // Add new bankCard
        bankCards.push(bankCardData);
    }

    // Save to localStorage
    localStorage.setItem('bankCards', JSON.stringify(bankCards));

    // Update the view
    updateBankCardsView(bankCards);

    alert('Bank Card account saved successfully!');

    // Close the popup
    toggleForm('bankCard');
}

function showBankCardInfo(index) {
    const bankCards = JSON.parse(localStorage.getItem('bankCards')) || [];
    const bankCard = bankCards[index];

    if (!bankCard) return;

    const popupDetails = document.getElementById('popupDetails');
    popupDetails.innerHTML = `
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">Bank Card Name:</span>
                    <span class="col-7 detail-value">${bankCard.bankCardName}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3"">
                    <span class="col-5 detail-label">Account Number:</span>
                    <span class="col-7 detail-value">**** **** **** ${bankCard.accountNumber.slice(-4)}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3"">
                    <span class="col-5 detail-label">Expiry Date:</span>
                    <span class="col-7 detail-value">${bankCard.expiryDate}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3"">
                    <span class="col-5 detail-label">CVV:</span>
                    <span class="col-7 detail-value">***</span>
                </div>
            `;

    document.getElementById('detailsTitle').textContent = 'Bank Card Details';

    // Set up the edit and remove buttons
    document.getElementById('popupEditBtn').onclick = function () {
        closeDetailsPopup();
        toggleForm('bankCard');
        loadBankCardForm(index);
    };

    document.getElementById('popupRemoveBtn').onclick = function () {
        removeBankCard(index);
    };

    // Show the popup
    document.getElementById('popupDetailsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function removeBankCard(index) {
    if (confirm('Are you sure you want to remove this bank card account?')) {
        const bankCards = JSON.parse(localStorage.getItem('bankCards')) || [];
        if (index >= 0 && index < bankCards.length) {
            bankCards.splice(index, 1);
            localStorage.setItem('bankCards', JSON.stringify(bankCards));
            updateBankCardsView(bankCards);
            alert('Bank Card account removed successfully!');
        }
        closeDetailsPopup();
    }
}

// ADDRESS FUNCTIONS
function initializeAddresses() {
    let addresses = JSON.parse(localStorage.getItem('addresses'));

    if (!addresses) {
        addresses = [];
        localStorage.setItem('addresses', JSON.stringify(addresses));
    }

    // Update the view with stored values
    updateAddressesView(addresses);
}

function updateAddressesView(addresses) {
    const container = document.getElementById('addressCardsContainer');
    container.innerHTML = '';

    addresses.forEach((address, index) => {
        const cardItem = document.createElement('li');
        cardItem.className = 'card-item';
        cardItem.addEventListener("click", () => showAddressInfo(index));
        cardItem.innerHTML = `
                    <div class="card-details">
                        <h5>${address.title}</h5>
                        <p>${address.addressLine1}, ${address.city}</p>
                        <p><strong>Phone:<strong> ${address.phone}</p>
                    </div>
                    <div class="info-btn">
                        <i class="fas fa-info"></i>
                    </div>
                `;
        container.appendChild(cardItem);
    });
}

function loadAddressForm(index = -1) {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];

    if (index >= 0 && index < addresses.length) {
        // Editing existing address
        document.getElementById('addressFormTitle').textContent = 'Edit Address';
        document.getElementById('editAddressIndex').value = index;

        const address = addresses[index];
        document.getElementById('addressTitle').value = address.title;
        document.getElementById('address1').value = address.addressLine1;
        document.getElementById('address2').value = address.addressLine2 || '';
        document.getElementById('postalCode').value = address.postalCode;
        document.getElementById('city').value = address.city;
        document.getElementById('state').value = address.state;
        document.getElementById('addressPhone').value = address.phone;
    } else {
        // Adding new address
        document.getElementById('addressFormTitle').textContent = 'Add New Address';
        document.getElementById('editAddressIndex').value = -1;

        // Reset form
        document.getElementById('addressTitle').value = '';
        document.getElementById('address1').value = '';
        document.getElementById('address2').value = '';
        document.getElementById('postalCode').value = '';
        document.getElementById('city').value = '';
        document.getElementById('state').value = '';
        document.getElementById('addressPhone').value = '';
    }
}

function saveAddress() {
    const index = parseInt(document.getElementById('editAddressIndex').value);
    const title = document.getElementById('addressTitle').value;
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;
    const postalCode = document.getElementById('postalCode').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const phone = document.getElementById('addressPhone').value;

    if (!title || !address1 || !postalCode || !city || !state || !phone) {
        alert('Please fill in all required address fields');
        return;
    }

    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const addressData = {
        title,
        addressLine1: address1,
        addressLine2: address2,
        postalCode,
        city,
        state,
        phone
    };

    if (index >= 0 && index < addresses.length) {
        // Update existing address
        addresses[index] = addressData;
    } else {
        // Add new address
        addresses.push(addressData);
    }

    // Save to localStorage
    localStorage.setItem('addresses', JSON.stringify(addresses));

    // Update the view
    updateAddressesView(addresses);

    alert('Address saved successfully!');

    // Close the popup
    toggleForm('address');
}

function showAddressInfo(index) {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const address = addresses[index];

    if (!address) return;

    const popupDetails = document.getElementById('popupDetails');
    popupDetails.innerHTML = `
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">Title:</span>
                    <span class="col-7 detail-value">${address.title}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">Address Line 1:</span>
                    <span class="col-7 detail-value">${address.addressLine1}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">Address Line 2:</span>
                    <span class="col-7 detail-value">${address.addressLine2 || 'N/A'}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">City:</span>
                    <span class="col-7 detail-value">${address.city}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">State:</span>
                    <span class="col-7 detail-value">${address.state}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">Postal Code:</span>
                    <span class="col-7 detail-value">${address.postalCode}</span>
                </div>
                <div class="detail-item d-flex justify-content-between align-items-center mb-3">
                    <span class="col-5 detail-label">Phone:</span>
                    <span class="col-7 detail-value">${address.phone}</span>
                </div>
            `;

    document.getElementById('detailsTitle').textContent = 'Address Details';

    // Set up the edit and remove buttons
    document.getElementById('popupEditBtn').onclick = function () {
        closeDetailsPopup();
        toggleForm('address');
        loadAddressForm(index);
    };

    document.getElementById('popupRemoveBtn').onclick = function () {
        removeAddress(index);
    };

    // Show the popup
    document.getElementById('popupDetailsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function removeAddress(index) {
    if (confirm('Are you sure you want to remove this address?')) {
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        if (index >= 0 && index < addresses.length) {
            addresses.splice(index, 1);
            localStorage.setItem('addresses', JSON.stringify(addresses));
            updateAddressesView(addresses);
            alert('Address removed successfully!');
        }
        closeDetailsPopup();
    }
}

// password
const isNewUser = true;

const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const form = document.getElementById("passwordForm");

// Old password check

// Form submit validation
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop form from submitting immediately

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword === "" || confirmPassword === "") {
        alert("Please fill in all password fields.");
        return;
    }

    if (confirm("Are you sure you want to change your password?")) {
        if (newPassword !== confirmPassword) {
            alert("New Password and Confirm Password do not match!");
            return;
        } else {
            alert("Password updated successfully!");
            form.submit(); // <-- only submit if valid
        }
    }
});



// UTILITY FUNCTIONS
function updateCountryLabel() {
    const select = document.getElementById('editCountryCode');
    const label = document.getElementById('countryLabel');
    switch (select.value) {
        case '+60':
            label.textContent = 'Malaysia';
            break;
        case '+65':
            label.textContent = 'Singapore';
            break;
        case '+86':
            label.textContent = 'China';
            break;
        case 'other':
            label.textContent = 'Other';
            break;
        default:
            label.textContent = '';
    }
}

function formatDateDMY(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Format and validate MM/YY for card expiry date
function formatDateMY(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = value;

    // Validate MM
    if (value.length >= 2) {
        const mm = parseInt(value.slice(0, 2), 10);
        if (mm < 1 || mm > 12) {
            return false;
        }
    }
    return true;
}

function closeDetailsPopup() {
    document.getElementById('popupDetailsOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Toggle form visibility
function toggleForm(type) {
    const popupProfile = document.getElementById('popupFormProfile');
    const popupBankCard = document.getElementById('popupFormBankCard');
    const popupAddress = document.getElementById('popupFormAddress');

    if (type === 'profile') {
        popupProfile.classList.toggle('active');
        // Close address and bankCard popup if open
        if (popupAddress.classList.contains('active')) {
            popupAddress.classList.remove('active');
        }
        if (popupBankCard.classList.contains('active')) {
            popupBankCard.classList.remove('active');
        }

        if (popupProfile.classList.contains('active')) {
            loadEditForm();
        }
    } else if (type === 'bankCard') {
        popupBankCard.classList.toggle('active');
        // Close profile and address popup if open
        if (popupAddress.classList.contains('active')) {
            popupAddress.classList.remove('active');
        }
        if (popupProfile.classList.contains('active')) {
            popupProfile.classList.remove('active');
        }

        if (popupBankCard.classList.contains('active')) {
            loadBankCardForm();
        }
    } else if (type === 'address') {
        popupAddress.classList.toggle('active');
        // Close profile and bank popup if open
        if (popupBankCard.classList.contains('active')) {
            popupBankCard.classList.remove('active');
        }
        if (popupProfile.classList.contains('active')) {
            popupProfile.classList.remove('active');
        }

        if (popupAddress.classList.contains('active')) {
            loadAddressForm();
        }
    }

    // Prevent body from scrolling when any popup is open
    if (popupProfile.classList.contains('active') || popupBankCard.classList.contains('active') || popupAddress.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close popup if clicked outside of content
document.getElementById('popupFormProfile').addEventListener('click', function (e) {
    if (e.target === this) {
        toggleForm('profile');
    }
});

document.getElementById('popupFormBankCard').addEventListener('click', function (e) {
    if (e.target === this) {
        toggleForm('bankCard');
    }
});

document.getElementById('popupFormAddress').addEventListener('click', function (e) {
    if (e.target === this) {
        toggleForm('address');
    }
});

document.getElementById('popupDetailsOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
        closeDetailsPopup();
    }
});