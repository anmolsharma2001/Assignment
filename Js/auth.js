
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("auth-form");
  const toggle = document.getElementById("toggle-form");
  const nameField = document.getElementById("name-field");
  const confirmPasswordField = document.getElementById(
    "confirm-password-field"
  );
  const formTitle = document.getElementById("form-title");
  const errorMsg = document.getElementById("error-msg");

  let isLogin = false;

  toggle.addEventListener("click", () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Login" : "Register";
    toggle.textContent = isLogin
      ? "Don't have an account? Register"
      : "Already have an account? Login";
    nameField.style.display = isLogin ? "none" : "block";
    confirmPasswordField.style.display = isLogin ? "none" : "block";
    errorMsg.textContent = "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();

    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      errorMsg.textContent = "All fields are required.";
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errorMsg.textContent = "Invalid email format.";
      return;
    }


    if (password.length < 6) {
      errorMsg.textContent = "Password must be at least 6 characters.";
      return;
    }

    //  if (!isLogin && !name.match(/^[a-zA-Z0-9]{3,20}$/)) {
    //    errorMsg.textContent =
    //      "Username must be 3–20 characters and alphanumeric only.";
    //    return;
    //  }
    
    if (!isLogin && password !== confirmPassword) {
      errorMsg.textContent = "Passwords do not match.";
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        location.href = "home.html";
      } else {
        errorMsg.textContent = "Invalid credentials.";
      }
    } else {
      if (users.find((u) => u.email === email)) {
        errorMsg.textContent = "User already exists.";
        return;
      }
      users.push({ name, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registered successfully. Please log in.");
      toggle.click();
    }
  });
});
