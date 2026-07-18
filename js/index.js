let currentPage = 1;
const itemsPerPage = 18; 

async function renderManga(page) {
    try {
    const response = await fetch('js/data.json');
    const data = await response.json();
        const mangaList = document.getElementById('manga-list');
        mangaList.innerHTML = '';

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = data.mangas.slice(start, end);

        pageData.forEach(manga => {
            const card = document.createElement('div');
            card.className = 'manga-card';
            
            const totalChapters = manga.chapters ? manga.chapters.length : 0;

            
            card.innerHTML = `
                <a href="info.html?id=${manga.id}" style="text-decoration:none; color:inherit; position:relative; display:block;">
                    <img src="${manga.cover}" alt="${manga.title}">
                    <span class="status-dot ${manga.status === 'Ongoing' ? 'dot-ongoing' : 'dot-completed'}"></span>
                    <h3>${manga.title}</h3>
                    <div class="chapter-count">${totalChapters} chương</div>
                </a>
            `;
            mangaList.appendChild(card);
        });

        renderPagination(data.mangas.length);
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}

function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = `
        <button onclick="changePage(-1)">Trước</button> 
        <span>Trang ${currentPage}</span> 
        <button onclick="changePage(1)">Tiếp</button>
    `;
}

window.changePage = (dir) => {
    
    if (currentPage + dir < 1) return; 
    currentPage += dir;
    renderManga(currentPage);
};

document.addEventListener('DOMContentLoaded', () => renderManga(currentPage));