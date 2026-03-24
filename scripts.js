console.log("JS connected");

const CREDENTIALS = { username: "admin", password: "admin123" };

const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
let allIssues = [];
let currentTab = "all";
let searchTimeout = null;

// login functionality work
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

  // show skeleton for 1.5 seconds then show actual dashboard content
  const skeleton = document.getElementById("skeletonLoader");
  skeleton.classList.remove("hidden");

  setTimeout(() => {
    skeleton.classList.add("hidden");
    loadAllIssues();
  }, 1500);
}

function checkSession() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}
function getPriorityClass(priority) {
  if (priority === "high") return "priority-high";
  if (priority === "medium") return "priority-medium";
  return "priority-low";
}
function getLabelClass(label) {
  if (label === "bug") return "label-bug";
  if (label === "enhancement") return "label-enhancement";
  if (label === "documentation") return "label-documentation";
  if (label === "help wanted") return "label-help";
  if (label === "good first issue") return "label-good";
  return "label-good";
}
function getStatusIcon(status) {
  if (status === "open") return "./assets/Open-Status.png";
  return "./assets/Closed-Status.png";
}

function buildCard(issue) {
  const card = document.createElement("div");
  card.className = `issue-card ${issue.status === "open" ? "open-card" : "closed-card"}`;
  card.dataset.id = issue.id;

  let labelsHtml = "";
  issue.labels.forEach((label) => {
    labelsHtml += `<span class="label-badge ${getLabelClass(label)}">${label.toUpperCase()}</span>`;
  });

  card.innerHTML = `
    <div class="card-top">
      <img src="${getStatusIcon(issue.status)}" alt="${issue.status}" class="card-status-icon" />
      <span class="priority-badge ${getPriorityClass(issue.priority)}">${issue.priority.toUpperCase()}</span>
    </div>
    <p class="card-title">${issue.title}</p>
    <p class="card-description">${issue.description}</p>
    <div class="card-labels">${labelsHtml}</div>
    <div class="card-footer">
      <span>#${issue.id} by ${issue.author}</span><br/>
      <span>${formatDate(issue.createdAt)}</span>
    </div>
  `;

  card.addEventListener("click", () => openModal(issue.id));

  return card;
}

function renderIssues(issues) {
  const grid = document.getElementById("issuesGrid");
  document.getElementById("issueCount").textContent = `${issues.length} Issues`;
  grid.innerHTML = "";

  if (issues.length === 0) {
    grid.innerHTML = `<p class="text-gray-400 text-sm col-span-4">No issues found.</p>`;
    return;
  }

  issues.forEach((issue) => {
    grid.appendChild(buildCard(issue));
  });
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

function setupLogout() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    document.getElementById("dashboardPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
  });
}

async function loadAllIssues() {
  document.getElementById("mainContent").classList.remove("hidden");

  try {
    const res = await fetch(`${API_BASE}/issues`);
    const json = await res.json();
    if (json.status === "success") {
      allIssues = json.data;
      renderIssues(allIssues);
    }
  } catch (err) {
    console.error("Failed to fetch issues:", err);
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      // removing active from all tabs
      tabs.forEach((t) => t.classList.remove("active"));
      // setting clicked one as active
      btn.classList.add("active");

      currentTab = btn.dataset.tab;

      let filtered = allIssues;
      if (currentTab === "open") {
        filtered = allIssues.filter((i) => i.status === "open");
      } else if (currentTab === "closed") {
        filtered = allIssues.filter((i) => i.status === "closed");
      }

      renderIssues(filtered);
    });
  });
}

async function openModal(id) {
  const modal = document.getElementById("issueModal");
  const loader = document.getElementById("modalLoader");
  const content = document.getElementById("modalContent");

  // reset state every time modal opens
  loader.classList.remove("hidden");
  content.classList.add("hidden");
  modal.showModal();

  try {
    const res = await fetch(`${API_BASE}/issue/${id}`);
    const json = await res.json();

    if (json.status === "success") {
      const issue = json.data;

      document.getElementById("modalStatusIcon").src = getStatusIcon(
        issue.status,
      );
      document.getElementById("modalTitle").textContent = issue.title;
      document.getElementById("modalDescription").textContent =
        issue.description;
      document.getElementById("modalStatus").textContent =
        issue.status.charAt(0).toUpperCase() + issue.status.slice(1);
      document.getElementById("modalPriority").textContent =
        issue.priority.toUpperCase();
      document.getElementById("modalAuthor").textContent = issue.author;
      document.getElementById("modalAssignee").textContent =
        issue.assignee || "Unassigned";
      document.getElementById("modalCreated").textContent = formatDate(
        issue.createdAt,
      );
      document.getElementById("modalUpdated").textContent = formatDate(
        issue.updatedAt,
      );

      const badge = document.getElementById("modalPriorityBadge");
      badge.textContent = issue.priority.toUpperCase();
      badge.className = `priority-badge ${getPriorityClass(issue.priority)}`;

      const labelsContainer = document.getElementById("modalLabels");
      labelsContainer.innerHTML = "";
      issue.labels.forEach((label) => {
        const span = document.createElement("span");
        span.className = `label-badge ${getLabelClass(label)}`;
        span.textContent = label.toUpperCase();
        labelsContainer.appendChild(span);
      });

      loader.classList.add("hidden");
      content.classList.remove("hidden");
    }
  } catch (err) {
    console.error("Failed to fetch issue:", err);
  }
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    // debouncing so api doesn't get called on every single keystroke
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      if (query === "") {
        // if search is cleared, go back to current tab data
        let filtered = allIssues;
        if (currentTab === "open")
          filtered = allIssues.filter((i) => i.status === "open");
        else if (currentTab === "closed")
          filtered = allIssues.filter((i) => i.status === "closed");
        renderIssues(filtered);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE}/issues/search?q=${encodeURIComponent(query)}`,
        );
        const json = await res.json();
        if (json.status === "success") {
          renderIssues(json.data);
        }
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 400);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  setupLogin();
  setupLogout();
  setupTabs();
  setupSearch();
});
