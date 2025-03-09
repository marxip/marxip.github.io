// Variables globales
let posts = [];
const postsPerPage = 5;
let currentPage = 1;

// Función para renderizar posts filtrados por categoría
function renderPosts(category = 'Inicio') {
    const activeTab = document.querySelector(`.tabcontent#${category}`);
    if (!activeTab) return;

    const postList = document.querySelector(`#${category} #post-list`);
    console.log(`post-list detectado en: ${activeTab.id}`, postList);
    if (!postList) return;

    postList.innerHTML = "";

    let filteredPosts = category === 'Inicio' ? posts : posts.filter(post => post.category === category);
    if (!Array.isArray(filteredPosts)) {
        console.error("❌ filteredPosts no es un array:", filteredPosts);
        return;
    }

    const start = (currentPage - 1) * postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, start + postsPerPage);
    console.log(`Categoría: ${category}, Posts filtrados:`, filteredPosts);

    paginatedPosts.forEach(post => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = post.url;
        a.textContent = `${post.title} (${post.date})`;
        li.appendChild(a);
        console.log(`Insertando post: ${post.title} en ${category}`);
        postList.appendChild(li);
    });

    updatePaginationButtons(category, filteredPosts.length);
}

// Función para actualizar los botones de paginación
function updatePaginationButtons(category, totalPosts) {
    const activeTab = document.querySelector(`.tabcontent#${category}`);
    if (!activeTab) return;

    const prevPageButton = activeTab.querySelector(".prevPage");
    const nextPageButton = activeTab.querySelector(".nextPage");
    const pageInfo = activeTab.querySelector(".pageInfo");

    const totalPages = Math.ceil(totalPosts / postsPerPage);
    if (prevPageButton) prevPageButton.disabled = currentPage === 1;
    if (nextPageButton) nextPageButton.disabled = currentPage >= totalPages;
    if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
}

// Función para manejar el cambio de pestañas
function openTab(event, tabName) {
    document.querySelectorAll(".tabcontent").forEach(tab => tab.style.display = "none");
    document.querySelectorAll(".tablinks").forEach(button => button.classList.remove("active"));

    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.style.display = "block";
        console.log(`Pestaña activa: ${tabName}`);
        tabContent.classList.add("active");
    } else {
        console.error("No se encontró el elemento con id:", tabName);
        return;
    }

    event.currentTarget.classList.add("active");
    currentPage = 1;
    renderPosts(tabName);
}

// Cargar posts y configurar event listeners cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
    const basePath = window.location.pathname.includes("/entradas") ? "../" : "./";
    
    fetch(`${basePath}posts.json`)
        .then(response => response.json())
        .then(data => {
            posts = data;
            renderPosts();
        })
        .catch(error => console.error("❌ Error cargando posts:", error));

    document.querySelectorAll(".tablinks").forEach(button => {
        button.addEventListener("click", event => openTab(event, button.textContent));
    });

    document.addEventListener("click", function (event) {
        const activeTab = document.querySelector(".tabcontent.active");
        if (!activeTab) return;

        const category = activeTab.id;
        const filteredPosts = category === "Inicio" ? posts : posts.filter(post => post.category === category);
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

        if (event.target.classList.contains("prevPage") && currentPage > 1) {
            currentPage--;
        }

        if (event.target.classList.contains("nextPage") && currentPage < totalPages) {
            currentPage++;
        }

        renderPosts(category);
    });
});
    // Función para compartir en redes sociales
    const currentURL = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    document.querySelectorAll(".share-link").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Evita que el enlace navegue a otra parte

            const network = link.getAttribute("data-network");
            let shareURL = "";

            // Definir los enlaces de compartición
            if (network === "twitter") {
                shareURL = `https://twitter.com/intent/tweet?text=${title}&url=${currentURL}`;
            } else if (network === "facebook") {
                shareURL = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
            } else if (network === "whatsapp") {
                shareURL = `https://wa.me/?text=${title}%20${currentURL}`;
            }

            if (shareURL) {
                window.open(shareURL, "_blank", "noopener,noreferrer");
            }
        });
    });