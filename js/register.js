document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".registerForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // 1. Check password length
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        // 2. Check password confirmation
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // 3. Load existing users
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // 4. Check if email already exists
        if (users.some(user => user.email === email)) {
            alert("Email is already registered.");
            return;
        }

        // 5. Add new user
        users.push({ email, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully!");
        form.reset();

        // Redirect to login (optional)
        window.location.href = "login.html";
    });
});