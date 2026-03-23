console.log("JS connected");

// login functionality work

const CREDENTIALS = { username: "admin", password: "admin123" };

function handleLogin() {
  const username = document.getElementById("usernameInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  const errorEl = document.getElementById("loginError");

  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    errorEl.classList.add("hidden");
    localStorage.setItem("isLoggedIn", "true");
    showDashboard();
  } else {
    errorEl.classList.remove("hidden");
  }
}

function showDashboard() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboardPage").classList.remove("hidden");
}

function checkSession() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
  }
}

function setupLogin() {
  document.getElementById("signInBtn").addEventListener("click", handleLogin);
  document.getElementById("usernameInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLogin();
  });
  document.getElementById("passwordInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLogin();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  setupLogin();
});
