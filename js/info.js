document.addEventListener('DOMContentLoaded', async () => {
    // Thống nhất lấy tham số 'id' từ URL
    const params = new URLSearchParams(window.location.search);
    const mangaId = params.get('id');
    
    console.log("ID nhận được từ URL là:", mangaId); 
    
    if (!mangaId) {
        alert("Lỗi: Không tìm thấy ID trong URL! Hãy thử truy cập: info.html?id=1");
        return;
    }

    try {
        const response = await fetch('js/data.json');
        const data = await response.json();
        const manga = data.mangas.find(m => m.id === mangaId);

        if (manga) {
            // 🌟 ĐÃ THÊM: Tự động đổi tên tab trình duyệt theo tên truyện
            document.title = `${manga.title} | AG`;

            document.querySelector('.manga-cover').src = manga.cover;
            document.querySelector('.manga-title').innerHTML = `${manga.title} <span class="status-dot"></span><span class="status-text">${manga.status}</span>`;
            document.querySelector('.original-title').innerText = manga.original_title;
            document.querySelector('.description').innerText = manga.description;
            document.querySelector('.author').innerText = `Tác giả: ${manga.author}`;

            // Đổ danh sách chương
            const chapterList = document.getElementById('chapter-list');
            chapterList.innerHTML = ''; // Reset list tránh trùng lặp
            
            manga.chapters.forEach((chap, index) => {
                const li = document.createElement('li');
                // 🌟 ĐÃ SỬA: Thay đổi thành index + 1 để đồng bộ với logic nhận số chương (chapFromUrl) của file reader.js
                li.innerHTML = `<a href="reader.html?id=${mangaId}&chap=${index + 1}">${chap.name}</a>`;
                chapterList.appendChild(li);
            });
        } else {
            alert(`Lỗi: Không tìm thấy truyện có ID là ${mangaId} trong file JSON!`);
        }
    } catch (error) {
        alert("Lỗi kết nối file JSON, kiểm tra Console (F12)!");
        console.error(error);
    }
});

// --- Xử lý Dark/Light Mode ---
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // 1. Kiểm tra trạng thái đã lưu từ trang trước
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if(themeToggle) themeToggle.innerText = '☀️';
    }

    // 2. Lắng nghe sự kiện click
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            // Lưu trạng thái vào trình duyệt
            localStorage.setItem('dark-mode', isDark);
            themeToggle.innerText = isDark ? '☀️' : '🌙';
        });
    }
});

// Áp dụng theme ngay lập tức để tránh bị nháy màn hình trắng khi load trang
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}