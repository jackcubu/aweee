// Biến toàn cục
let currentMangaId = null;
let currentChapIndex = 0; // Luôn lưu index THỰC TẾ của mảng (0, 1, 2...) ở đây để xử lý logic nội bộ
let mangaData = null;

// Khởi chạy khi trang load xong
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    currentMangaId = params.get('id');
    
    // 🌟 SỬA TẠI ĐÂY: Lấy số chương trên URL (mặc định là 1 nếu không có), sau đó TRỪ ĐI 1 để ra vị trí mảng
    const chapFromUrl = parseInt(params.get('chap')) || 1;
    currentChapIndex = chapFromUrl - 1;

    console.log("Đang tải truyện ID:", currentMangaId, "| Chỉ số mảng thực tế:", currentChapIndex);

    try {
        const response = await fetch('js/data.json');
        mangaData = await response.json();
        const manga = mangaData.mangas.find(m => m.id === currentMangaId);
        
        if (manga) {
            // Kiểm tra an toàn phòng trường hợp số chap trên URL bị nhập bậy vượt quá số chương hiện có
            if (currentChapIndex >= 0 && currentChapIndex < manga.chapters.length) {
                renderChapter(manga, currentChapIndex);
                setupNavigation(manga);
            } else {
                alert("Chương này không tồn tại!");
            }
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
    
    // Tự động đổi tên tab trình duyệt thành "Tên chương | Tên truyện"
    document.title = `${chapter.name} | ${manga.title || manga.name}`;
    
    imageList.innerHTML = ''; 

    // 1. Nếu file JSON vẫn dùng mảng "images" cũ
    if (chapter.images && chapter.images.length > 0) {
        console.log("Phát hiện cấu trúc cũ (dùng mảng ảnh)");
        chapter.images.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'manga-page';
            img.decoding = 'async'; 
            if (idx > 4) {
                img.loading = 'lazy'; 
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
            img.decoding = 'async'; 
            
            if (i - chapter.startImg > 4) {
                img.loading = 'lazy';
            }
            
            img.onerror = function() {
                this.style.display = 'none';
            };
            imageList.appendChild(img);
        }
        return;
    }

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

    document.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Đổ dữ liệu vào Popup
    const list = document.getElementById('popup-list');
    list.innerHTML = '';
    manga.chapters.forEach((chap, i) => {
        const li = document.createElement('li');
        li.innerText = chap.name;
        // 🌟 Ở ĐÂY BẠN ĐÃ LÀM ĐÚNG: i + 1 để hiển thị chap=1, chap=2 trên URL thanh địa chỉ
        li.onclick = () => window.location.href = `reader.html?id=${manga.id}&chap=${i + 1}`;
        list.appendChild(li);
    });
}

function changeChap(dir) {
    const manga = mangaData.mangas.find(m => m.id === currentMangaId);
    let newIndex = currentChapIndex + dir; // Tính toán vị trí mảng mới
    
    if (newIndex >= 0 && newIndex < manga.chapters.length) {
        // 🌟 SỬA TẠI ĐÂY: Khi bấm nút Tiến/Lùi, phải CỘNG THÊM 1 vào newIndex để URL hiển thị số chương đúng chuẩn (không bị số 0)
        window.location.href = `reader.html?id=${currentMangaId}&chap=${newIndex + 1}`;
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