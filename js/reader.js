// Biến toàn cục
let currentMangaId = null;
let currentChapIndex = 0;
let mangaData = null;

// Khởi chạy khi trang load xong
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    // Đã đồng bộ hoàn toàn: dùng 'id' thay vì 'manga'
    currentMangaId = params.get('id');
    currentChapIndex = parseInt(params.get('chap')) || 0;

    console.log("Đang tải truyện ID:", currentMangaId, "| Chương:", currentChapIndex);

    try {
        const response = await fetch('js/data.json');
        mangaData = await response.json();
        const manga = mangaData.mangas.find(m => m.id === currentMangaId);
        
        if (manga) {
            renderChapter(manga, currentChapIndex);
            setupNavigation(manga);
        } else {
            alert("Không tìm thấy dữ liệu truyện cho ID: " + currentMangaId);
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

    // HỖ TRỢ CẢ 2 PHƯƠNG ÁN:
    // 1. Nếu file JSON vẫn dùng mảng "images" cũ
    if (chapter.images && chapter.images.length > 0) {
        console.log("Phát hiện cấu trúc cũ (dùng mảng ảnh)");
        chapter.images.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'manga-page';
            
            // ✨ TỐI ƯU TỐC ĐỘ LOAD 
            img.decoding = 'async'; 
            if (idx > 4) {
                img.loading = 'lazy'; // Chỉ lazy-load từ ảnh thứ 5
            }

            imageList.appendChild(img);
        });
        return;
    }

    // 2. Nếu file JSON đã rút gọn (dùng startImg & endImg)
    if (chapter.startImg !== undefined && chapter.endImg !== undefined) {
        console.log("Phát hiện cấu trúc mới (sinh ảnh tự động từ", chapter.startImg, "đến", chapter.endImg, ")");
        
        if (chapter.startImg === 0 && chapter.endImg === 0) {
            showEmptyMessage(imageList);
            return;
        }

        for (let i = chapter.startImg; i <= chapter.endImg; i++) {
            const src = `assets/images/${manga.id}/${chapter.name}/${i}.jpg`;
            const img = document.createElement('img');
            img.src = src;
            img.className = 'manga-page';
            
            // ✨ TỐI ƯU TỐC ĐỘ LOAD
            img.decoding = 'async'; // Giải mã ảnh chạy ngầm mượt mà
            
            // 4 ảnh đầu load ngay lập tức, từ ảnh thứ 5 trở đi mới bật lazy-load
            if (i - chapter.startImg > 4) {
                img.loading = 'lazy';
            }
            
            // Tự ẩn ảnh lỗi nếu trong folder thực tế thiếu mất số ảnh đó
            img.onerror = function() {
                this.style.display = 'none';
            };
            imageList.appendChild(img);
        }
        return;
    }

    // Trường hợp không rơi vào cả 2 (chương trống)
    showEmptyMessage(imageList);
}

function showEmptyMessage(container) {
    const emptyMsg = document.createElement('p');
    emptyMsg.className = 'empty-message';
    emptyMsg.innerText = "Chương này hiện chưa có nội dung ảnh. Vui lòng quay lại sau!";
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.padding = '50px 20px';
    container.appendChild(emptyMsg);
}

function setupNavigation(manga) {
    // Nút Lùi/Tiến
    document.getElementById('prev-btn').onclick = () => changeChap(-1);
    document.getElementById('next-btn').onclick = () => changeChap(1);
    
    // Nút Menu (Popup)
    const popup = document.getElementById('chapter-popup');
    document.getElementById('menu-btn').onclick = (e) => {
        e.stopPropagation();
        popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
    };

    // Click ra ngoài để đóng Popup menu tự động
    document.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Đổ dữ liệu vào Popup
    const list = document.getElementById('popup-list');
    list.innerHTML = '';
    manga.chapters.forEach((chap, i) => {
        const li = document.createElement('li');
        li.innerText = chap.name;
        // ĐÃ SỬA: Đổi 'manga=' thành 'id=' để đồng bộ URL
        li.onclick = () => window.location.href = `reader.html?id=${manga.id}&chap=${i+1}`;
        list.appendChild(li);
    });
}

function changeChap(dir) {
    const manga = mangaData.mangas.find(m => m.id === currentMangaId);
    let newIndex = currentChapIndex + dir;
    if (newIndex >= 0 && newIndex < manga.chapters.length) {
        // ĐÃ SỬA: Đổi 'manga=' thành 'id=' để đồng bộ URL
        window.location.href = `reader.html?id=${currentMangaId}&chap=${newIndex}`;
    } else {
        alert("Đã hết chương!");
    }
}

// --- Xử lý Dark/Light Mode ---
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});