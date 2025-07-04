// Variables globales
let posts = [];
const postsPerPage = 5;
let currentPages = {
    Inicio: 1,
    'Ensayos de calibración': 1,
    errorLog: 1
};

// Función para renderizar posts filtrados por categoría
function renderPosts(category = 'Inicio') {
    const activeTab = document.querySelector(`.tabcontent#${category}`);
    if (!activeTab) return;

    const postList = activeTab.querySelector(".post-list");
    if (!postList) return;

    postList.innerHTML = "";

    let filteredPosts = category === 'Inicio' ? posts : posts.filter(post => post.category === category);
    if (!Array.isArray(filteredPosts)) {
        console.error("❌ filteredPosts no es un array:", filteredPosts);
        return;
    }

    // Inicializar la página si no existe
    if (!currentPages[category]) {
        currentPages[category] = 1;
    }

    const start = (currentPages[category] - 1) * postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, start + postsPerPage);

    paginatedPosts.forEach(post => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = post.url;
        a.textContent = `${post.title} (${post.date})`;
        li.appendChild(a);
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
    
    if (prevPageButton) {
        prevPageButton.disabled = currentPages[category] === 1;
        // Remover event listeners anteriores y agregar nuevos
        prevPageButton.replaceWith(prevPageButton.cloneNode(true));
        const newPrevButton = activeTab.querySelector(".prevPage");
        newPrevButton.addEventListener("click", () => {
            if (currentPages[category] > 1) {
                currentPages[category]--;
                renderPosts(category);
            }
        });
    }
    
    if (nextPageButton) {
        nextPageButton.disabled = currentPages[category] >= totalPages;
        // Remover event listeners anteriores y agregar nuevos
        nextPageButton.replaceWith(nextPageButton.cloneNode(true));
        const newNextButton = activeTab.querySelector(".nextPage");
        newNextButton.addEventListener("click", () => {
            if (currentPages[category] < totalPages) {
                currentPages[category]++;
                renderPosts(category);
            }
        });
    }
    
    if (pageInfo) pageInfo.textContent = `Página ${currentPages[category]} de ${totalPages}`;
}

// Función para manejar el cambio de pestañas
function openTab(event, tabName) {
    document.querySelectorAll(".tabcontent").forEach(tab => {
        tab.style.display = "none";
        tab.classList.remove("active");
    });
    document.querySelectorAll(".tablinks").forEach(button => button.classList.remove("active"));

    // Mostrar la pestaña correspondiente
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.style.display = "block";
        tabContent.classList.add("active");
    } else {
        console.error("No se encontró el elemento con id:", tabName);
        return;
    }

    event.currentTarget.classList.add("active");
    
    // Inicializar la página de la categoría si no existe
    if (!currentPages[tabName]) {
        currentPages[tabName] = 1;
    }
    
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

    // Event listeners para las pestañas
    document.querySelectorAll(".tablinks").forEach(button => {
        button.addEventListener("click", event => {
            const tabName = button.textContent.trim();
            openTab(event, tabName);
        });
    });
});

// Función para compartir en redes sociales
const currentURL = encodeURIComponent(window.location.href);
const title = encodeURIComponent(document.title);

document.querySelectorAll(".share-link").forEach(link => {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const network = link.getAttribute("data-network");
        let shareURL = "";

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

// Bloque compartir aleatorio
document.addEventListener("DOMContentLoaded", function () {
    const frases = [
        "No tenés déficit de atención. Festejalo compartiendo esto.",
        "Leer hasta el final es un arte en extinción. Difundí la resistencia.",
        "Tu paciencia merece un premio. No tengo uno, pero podés compartir esto.",
        "Este artículo no se va a compartir solo. O sí, pero ayudaría que lo hagas vos.",
        "Si esto valió tu tiempo, quizás valga el de alguien más. Hacelo viral(?).",
        "Sobreviviste al scroll. Ahora compartí.",
    ];

    const bloque = document.querySelector(".bloque-compartir");
    if (bloque) {
        const fraseElegida = frases[Math.floor(Math.random() * frases.length)];
        bloque.innerHTML = `<p>${fraseElegida}</p>`;
    }
});

// Carrusel
document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const items = document.querySelectorAll(".carousel-item");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const dotsContainer = document.querySelector(".carousel-dots");
  
    let index = 0;
    const totalItems = items.length;
  
    // Crear puntos dinámicos
    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
  
    const dots = document.querySelectorAll(".dot");
  
    function updateCarousel() {
        carousel.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
    }
  
    function goToSlide(i) {
        index = i;
        updateCarousel();
    }
  
    prevButton.addEventListener("click", () => {
        index = index > 0 ? index - 1 : totalItems - 1;
        updateCarousel();
    });
  
    nextButton.addEventListener("click", () => {
        index = index < totalItems - 1 ? index + 1 : 0;
        updateCarousel();
    });
  
    // Swipe en móviles
    let startX = 0;
    carousel.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
    carousel.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX > endX + 50) nextButton.click();
        if (startX < endX - 50) prevButton.click();
    });
});

// Spoiler alert aleatorio
document.addEventListener("DOMContentLoaded", function () {
    const frases = [
        "⚠️ Spoiler Alert. Sí, hay spoilers. Todos. Hasta los del final. Especialmente los del final. Después no digas que no te avisé.",
        "⚠️ Spoiler Alert. Esto es un spoiler extendido con justificación teórica. Se arruina todo, pero con fundamento.",
        "⚠️ Spoiler Alert. Lo que sigue no tiene piedad narrativa. Spoilea todo y además lo explica. Destruir para entender, entender para destruir.",
        "⚠️ Spoiler Alert. Lo que vas a leer no solo te arruina la trama. Este texto es el fin de la inocencia.",
    ];

    const bloque = document.querySelector(".spoiler-alert");
    if (bloque) {
        const fraseElegida = frases[Math.floor(Math.random() * frases.length)];
        bloque.innerHTML = `<p>${fraseElegida}</p>`;
    }
});