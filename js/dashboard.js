// Initialize the data when the page loads
document.addEventListener('DOMContentLoaded', initializeData);

// Initialize all data from localStorage
function initializeData() {
    initializeProfile();
    initializeBanks();
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
    document.getElementById('dob').textContent = profileData.dob;

    // Set gender radio button
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.checked = (radio.value === profileData.gender);
    });
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

    // Get selected gender
    let gender;
    if (document.getElementById('editMale').checked) {
        gender = 'male';
    } else if (document.getElementById('editFemale').checked) {
        gender = 'female';
    } else {
        gender = 'other';
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
function initializeBanks() {
    let banks = JSON.parse(localStorage.getItem('banks'));

    if (!banks) {
        banks = [];
        localStorage.setItem('banks', JSON.stringify(banks));
    }

    // Update the view with stored values
    updateBanksView(banks);
}

function updateBanksView(banks) {
    const container = document.getElementById('bankCardsContainer');
    container.innerHTML = '';

    banks.forEach((bank, index) => {
        const cardItem = document.createElement('li');
        cardItem.className = 'card-item';
        cardItem.innerHTML = `
                    <div class="card-details">
                        <h3>${bank.bankName}</h3>
                        <p>Account: **** **** **** ${bank.accountNumber.slice(-4)}</p>
                        <p>Expires: ${formatDate(bank.expiryDate)}</p>
                    </div>
                    <div class="info-btn" onclick="showBankInfo(${index})">
                        <i class="fas fa-info"></i>
                    </div>
                `;
        container.appendChild(cardItem);
    });
}

function loadBankForm(index = -1) {
    const banks = JSON.parse(localStorage.getItem('banks')) || [];

    if (index >= 0 && index < banks.length) {
        // Editing existing bank
        document.getElementById('bankFormTitle').textContent = 'Edit Bank Account';
        document.getElementById('editBankIndex').value = index;

        const bank = banks[index];
        document.getElementById('bankName').value = bank.bankName;
        document.getElementById('accountNumber').value = bank.accountNumber;
        document.getElementById('expiryDate').value = bank.expiryDate;
        document.getElementById('cvv').value = bank.cvv;
    } else {
        // Adding new bank
        document.getElementById('bankFormTitle').textContent = 'Add New Bank Account';
        document.getElementById('editBankIndex').value = -1;

        // Reset form
        document.getElementById('bankName').value = '';
        document.getElementById('accountNumber').value = '';
        document.getElementById('expiryDate').value = '';
        document.getElementById('cvv').value = '';
    }
}

function saveBank() {
    const index = parseInt(document.getElementById('editBankIndex').value);
    const bankName = document.getElementById('bankName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    if (!bankName || !accountNumber || !expiryDate || !cvv) {
        alert('Please fill in all fields');
        return;
    }

    const banks = JSON.parse(localStorage.getItem('banks')) || [];
    const bankData = {
        bankName,
        accountNumber,
        expiryDate,
        cvv
    };

    if (index >= 0 && index < banks.length) {
        // Update existing bank
        banks[index] = bankData;
    } else {
        // Add new bank
        banks.push(bankData);
    }

    // Save to localStorage
    localStorage.setItem('banks', JSON.stringify(banks));

    // Update the view
    updateBanksView(banks);

    alert('Bank account saved successfully!');

    // Close the popup
    toggleForm('bank');
}

function showBankInfo(index) {
    const banks = JSON.parse(localStorage.getItem('banks')) || [];
    const bank = banks[index];

    if (!bank) return;

    const popupDetails = document.getElementById('popupDetails');
    popupDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Bank Name:</span>
                    <span class="detail-value">${bank.bankName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Account Number:</span>
                    <span class="detail-value">**** **** **** ${bank.accountNumber.slice(-4)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Expiry Date:</span>
                    <span class="detail-value">${formatDate(bank.expiryDate)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">CVV:</span>
                    <span class="detail-value">***</span>
                </div>
            `;

    document.getElementById('detailsTitle').textContent = 'Bank Account Details';

    // Set up the edit and remove buttons
    document.getElementById('popupEditBtn').onclick = function () {
        closeDetailsPopup();
        toggleForm('bank');
        loadBankForm(index);
    };

    document.getElementById('popupRemoveBtn').onclick = function () {
        removeBank(index);
    };

    // Show the popup
    document.getElementById('popupDetailsOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function removeBank(index) {
    if (confirm('Are you sure you want to remove this bank account?')) {
        const banks = JSON.parse(localStorage.getItem('banks')) || [];
        if (index >= 0 && index < banks.length) {
            banks.splice(index, 1);
            localStorage.setItem('banks', JSON.stringify(banks));
            updateBanksView(banks);
            alert('Bank account removed successfully!');
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
        cardItem.innerHTML = `
                    <div class="card-details">
                        <h3>${address.title}</h3>
                        <p>${address.addressLine1}, ${address.city}</p>
                        <p>Phone: ${address.phone}</p>
                    </div>
                    <div class="info-btn" onclick="showAddressInfo(${index})">
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
                <div class="detail-item">
                    <span class="detail-label">Title:</span>
                    <span class="detail-value">${address.title}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Address Line 1:</span>
                    <span class="detail-value">${address.addressLine1}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Address Line 2:</span>
                    <span class="detail-value">${address.addressLine2 || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">City:</span>
                    <span class="detail-value">${address.city}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">State:</span>
                    <span class="detail-value">${address.state}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Postal Code:</span>
                    <span class="detail-value">${address.postalCode}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${address.phone}</span>
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

    if (newPassword !== confirmPassword) {
        alert("New Password and Confirm Password do not match!");
        return;
    }

    alert("Password updated successfully!");
    form.submit(); // <-- only submit if valid
});



// UTILITY FUNCTIONS
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function closeDetailsPopup() {
    document.getElementById('popupDetailsOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Toggle form visibility
function toggleForm(type) {
    const popupProfile = document.getElementById('popupFormProfile');
    const popupBank = document.getElementById('popupFormBank');
    const popupAddress = document.getElementById('popupFormAddress');

    if (type === 'profile') {
        popupProfile.classList.toggle('active');
        // Close address and bank popup if open
        if (popupAddress.classList.contains('active')) {
            popupAddress.classList.remove('active');
        }
        if (popupBank.classList.contains('active')) {
            popupBank.classList.remove('active');
        }

        if (popupProfile.classList.contains('active')) {
            loadEditForm();
        }
    } else if (type === 'bank') {
        popupBank.classList.toggle('active');
        // Close profile and address popup if open
        if (popupAddress.classList.contains('active')) {
            popupAddress.classList.remove('active');
        }
        if (popupProfile.classList.contains('active')) {
            popupProfile.classList.remove('active');
        }

        if (popupBank.classList.contains('active')) {
            loadBankForm();
        }
    } else if (type === 'address') {
        popupAddress.classList.toggle('active');
        // Close profile and bank popup if open
        if (popupBank.classList.contains('active')) {
            popupBank.classList.remove('active');
        }
        if (popupProfile.classList.contains('active')) {
            popupProfile.classList.remove('active');
        }

        if (popupAddress.classList.contains('active')) {
            loadAddressForm();
        }
    }

    // Prevent body from scrolling when any popup is open
    if (popupProfile.classList.contains('active') || popupBank.classList.contains('active') || popupAddress.classList.contains('active')) {
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

document.getElementById('popupFormBank').addEventListener('click', function (e) {
    if (e.target === this) {
        toggleForm('bank');
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