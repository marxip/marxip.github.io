document.addEventListener("DOMContentLoaded", function () {
    const postsPerPage = 5;
    let currentPage = 1;
    let posts = [];

    // Función para renderizar los posts
    function renderPosts() {
        let postList = document.getElementById("post-list");
        postList.innerHTML = "";

        let start = (currentPage - 1) * postsPerPage;
        let end = start + postsPerPage;
        let paginatedPosts = posts.slice(start, end);

        paginatedPosts.forEach(post => {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.href = post.url;
            a.textContent = `${post.title} (${post.date})`;
            li.appendChild(a);
            postList.appendChild(li);
        });

        document.getElementById("pageInfo").textContent = `Página ${currentPage} de ${Math.ceil(posts.length / postsPerPage)}`;
        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled = currentPage === Math.ceil(posts.length / postsPerPage);
    }

    // Determinamos el pathPrefix de forma sencilla y confiable
    let pathPrefix = "";
    if (window.location.pathname.includes("entradas") || window.location.pathname.includes("/entradas/")) {
        pathPrefix = "../"; // Para subcarpetas
    }

    // Cargar los posts desde JSON
    fetch(pathPrefix + "posts.json")
        .then(response => response.json())
        .then(data => {
            posts = data;
            renderPosts();
        })
        .catch(error => console.error("❌ Error cargando posts:", error));

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

    // Funciones de paginación
    document.getElementById("prevPage").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    });

    document.getElementById("nextPage").addEventListener("click", function () {
        if (currentPage < Math.ceil(posts.length / postsPerPage)) {
            currentPage++;
            renderPosts();
        }
    });
});
