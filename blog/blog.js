document.addEventListener("DOMContentLoaded", function () {
    const postsPerPage = 5;
    let currentPage = 1;
    let posts = [];

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

    fetch("posts.json")
        .then(response => response.json())
        .then(data => {
            posts = data;
            renderPosts();
        })
        .catch(error => console.error("Error cargando posts:", error));

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
