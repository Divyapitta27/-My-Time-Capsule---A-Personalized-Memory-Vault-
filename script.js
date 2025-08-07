const form = document.getElementById("memoryForm");
const memoryList = document.getElementById("memoryList");
const filter = document.getElementById("categoryFilter");

let memories = JSON.parse(localStorage.getItem("memories")) || [];

function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function saveToStorage() {
  localStorage.setItem("memories", JSON.stringify(memories));
}

function updateFilterOptions() {
  const categories = new Set(memories.map(m => m.category));
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

function renderMemories() {
  memoryList.innerHTML = "";
  const now = new Date();
  const selectedCategory = filter.value;

  memories.forEach(memory => {
    if (selectedCategory !== "all" && memory.category !== selectedCategory) return;

    const unlockDate = new Date(memory.unlockDate);
    const isUnlocked = now >= unlockDate;

    const card = document.createElement("div");
    card.className = `memory-card ${isUnlocked ? "unlocked" : "locked"}`;
    card.innerHTML = `
      <h3>${memory.title}</h3>
      <p><strong>Category:</strong> ${memory.category}</p>
      <p><strong>Unlock Date:</strong> ${memory.unlockDate}</p>
      <p>${isUnlocked ? memory.description : "🔒 This memory is locked until the unlock date."}</p>
      ${!isUnlocked ? `<p><strong>⏳ Countdown:</strong> ${countdownToDate(unlockDate)}</p>` : ""}
      <div class="actions">
        <button class="edit-btn" onclick="editMemory(${memory.id})">Edit</button>
        <button class="delete-btn" onclick="deleteMemory(${memory.id})">Delete</button>
      </div>
    `;
    memoryList.appendChild(card);
  });
}

function countdownToDate(futureDate) {
  const now = new Date();
  const diff = futureDate - now;
  if (diff <= 0) return "Now!";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return `${days} day(s) left`;
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const unlockDate = document.getElementById("unlockDate").value;

  const id = Date.now();
  memories.push({ id, title, description, category, unlockDate });

  saveToStorage();
  updateFilterOptions();
  renderMemories();
  form.reset();
  showSection("viewSection");
});

function deleteMemory(id) {
  memories = memories.filter(m => m.id !== id);
  saveToStorage();
  updateFilterOptions();
  renderMemories();
}

function editMemory(id) {
  const memory = memories.find(m => m.id === id);
  if (!memory) return;

  document.getElementById("title").value = memory.title;
  document.getElementById("description").value = memory.description;
  document.getElementById("category").value = memory.category;
  document.getElementById("unlockDate").value = memory.unlockDate;

  memories = memories.filter(m => m.id !== id);
  saveToStorage();
  updateFilterOptions();
  renderMemories();
  showSection("addSection");
}

filter.addEventListener("change", renderMemories);

// Initial Load
updateFilterOptions();
renderMemories();
