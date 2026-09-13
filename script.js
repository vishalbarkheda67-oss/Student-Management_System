// Open Login Modal

function openLogin() {

    const modal = document.getElementById("loginModal");

    modal.style.display = "flex";
}


// Close Login Modal

function closeLogin() {

    const modal = document.getElementById("loginModal");

    modal.style.display = "none";
}


// Admin Login

function login(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    // Demo credentials

    if (
        email === "admin@gmail.com" &&
        password === "admin123"
    ) {

        alert("Login Successful!");

        window.location.href =
            "dashboard.html";

    } else {

        alert(
            "Invalid email or password!"
        );

    }

}


// Close modal when clicking outside

window.onclick = function(event) {

    const modal =
        document.getElementById("loginModal");

    if (event.target === modal) {

        modal.style.display = "none";

    }

};

function forgotPassword() {

    const email = prompt("Enter your registered email:");

    if (email === null) {
        return;
    }

    if (email.toLowerCase() === "admin@gmail.com") {

        alert(
            "Password reset successful!\n\n" +
            "Your password is: admin123"
        );

    } else {

        alert("Email not registered!");

    }
}

// ===============================
// FORGOT PASSWORD - OTP SYSTEM
// ===============================

let generatedOTP = "";
let otpEmail = "";

// Open Forgot Password
function forgotPassword() {

    document.getElementById("forgotPasswordModal").style.display = "flex";

    document.getElementById("forgotStep1").style.display = "block";
    document.getElementById("forgotStep2").style.display = "none";
    document.getElementById("forgotStep3").style.display = "none";

    document.getElementById("forgotEmail").value = "";
    document.getElementById("otpInput").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
}


// Close Forgot Password
function closeForgotPassword() {
    document.getElementById("forgotPasswordModal").style.display = "none";
}


// Send OTP
function sendOTP() {

    const email =
        document.getElementById("forgotEmail").value
        .trim()
        .toLowerCase();

    if (email === "") {
        alert("Please enter your email!");
        return;
    }

    if (email !== "admin@gmail.com") {
        alert("Email not registered!");
        return;
    }

    // Generate 6 digit OTP
    generatedOTP =
        Math.floor(100000 + Math.random() * 900000).toString();

    otpEmail = email;

    alert("Your OTP is: " + generatedOTP);

    document.getElementById("forgotStep1").style.display = "none";
    document.getElementById("forgotStep2").style.display = "block";
}


// Verify OTP
function verifyOTP() {

    const enteredOTP =
        document.getElementById("otpInput").value.trim();

    if (enteredOTP === "") {
        alert("Please enter OTP!");
        return;
    }

    if (enteredOTP === generatedOTP) {

        alert("OTP Verified Successfully!");

        document.getElementById("forgotStep2").style.display = "none";
        document.getElementById("forgotStep3").style.display = "block";

    } else {

        alert("Invalid OTP!");

    }
}


// Reset Password
function resetPassword() {

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (newPassword === "" || confirmPassword === "") {
        alert("Please enter both passwords!");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    alert("Password Reset Successfully!");

    closeForgotPassword();
}