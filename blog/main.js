// Wartet, bis das HTML vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
    loadBlogPosts();
});

// Lädt die Artikel aus der JSON-Datei
async function loadBlogPosts() {
    const container = document.getElementById("blog-container");
    
    try {
        // Hinweis: Benötigt einen lokalen Server (z.B. Live Server in VS Code)
        const response = await fetch("blog.json");
        
        if (!response.ok) {
            throw new Error("Fehler beim Laden der JSON-Daten");
        }
        
        const posts = await response.json();
        renderPosts(posts, container);
        
    } catch (error) {
        container.innerHTML = `<p style="color:red;">Blog-Beiträge konnten nicht geladen werden: ${error.message}</p>`;
    }
}

// Erstellt das HTML für jeden Artikel
function renderPosts(posts, container) {
    container.innerHTML = ""; // Container leeren

    posts.forEach(post => {
        const postElement = document.createElement("article");
        postElement.classList.add("post-card");

        postElement.innerHTML = `
            <div class="post-date">${post.date}</div>
            <h2 class="post-title">${post.title}</h2>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="full-content" id="content-${post.id}">${post.content}</div>
            <button class="read-more-btn" onclick="togglePost(${post.id}, this)">Weiterlesen</button>
        `;

        container.appendChild(postElement);
    });
}

// Blendet den vollständigen Text ein/aus
function togglePost(id, button) {
    const contentDiv = document.getElementById(`content-${id}`);
    
    if (contentDiv.style.display === "block") {
        contentDiv.style.display = "none";
        button.textContent = "Weiterlesen";
    } else {
        contentDiv.style.display = "block";
        button.textContent = "Weniger anzeigen";
    }
}
