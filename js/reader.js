// Biến toàn cục
let currentMangaId = null;
let currentChapIndex = 0;
let mangaData = null;

// Khởi chạy khi trang load xong
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    currentMangaId = params.get('manga');
    currentChapIndex = parseInt(params.get('chap')) || 0;

    try {
        const response = await fetch('js/data.json');
        mangaData = await response.json();
        const manga = mangaData.mangas.find(m => m.id === currentMangaId);
        
        if (manga) {
            renderChapter(manga, currentChapIndex);
            setupNavigation(manga);
        }
    } catch (err) {
        console.error("Lỗi load data:", err);
    }
});

function renderChapter(manga, index) {
    const chapter = manga.chapters[index];
    const imageList = document.getElementById('image-list');
    document.getElementById('chapter-title').innerText = chapter.name;
    
    imageList.innerHTML = ''; 
    chapter.images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'manga-page';
        imageList.appendChild(img);
    });
}

function setupNavigation(manga) {
    // Nút Lùi/Tiến
    document.getElementById('prev-btn').onclick = () => changeChap(-1);
    document.getElementById('next-btn').onclick = () => changeChap(1);
    
    // Nút Menu (Popup)
    const popup = document.getElementById('chapter-popup');
    document.getElementById('menu-btn').onclick = (e) => {
        e.stopPropagation(); // Ngăn sự kiện click bị đóng ngay lập tức
        popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
    };

    // Đổ dữ liệu vào Popup
    const list = document.getElementById('popup-list');
    list.innerHTML = '';
    manga.chapters.forEach((chap, i) => {
        const li = document.createElement('li');
        li.innerText = chap.name;
        li.onclick = () => window.location.href = `reader.html?manga=${manga.id}&chap=${i}`;
        list.appendChild(li);
    });
}

function changeChap(dir) {
    const manga = mangaData.mangas.find(m => m.id === currentMangaId);
    let newIndex = currentChapIndex + dir;
    if (newIndex >= 0 && newIndex < manga.chapters.length) {
        window.location.href = `reader.html?manga=${currentMangaId}&chap=${newIndex}`;
    } else {
        alert("Đã hết chương!");
    }
}
//sang toi//
// Thêm vào cuối file reader.js
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Kiểm tra trạng thái đã lưu từ trước
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        // Lưu lựa chọn vào localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
