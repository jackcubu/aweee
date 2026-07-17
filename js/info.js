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
            document.querySelector('.manga-cover').src = manga.cover;
            document.querySelector('.manga-title').innerHTML = `${manga.title} <span class="status-badge">${manga.status}</span>`;
            document.querySelector('.original-title').innerText = manga.original_title;
            document.querySelector('.description').innerText = manga.description;
            document.querySelector('.author').innerText = `Tác giả: ${manga.author}`;

            // Đổ danh sách chương
            const chapterList = document.getElementById('chapter-list');
            chapterList.innerHTML = ''; // Reset list tránh trùng lặp
            
            manga.chapters.forEach((chap, index) => {
                const li = document.createElement('li');
                // Thống nhất tham số truyền sang reader.html là 'id' thay vì 'manga'
                li.innerHTML = `<a href="reader.html?id=${mangaId}&chap=${index}">${chap.name}</a>`;
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
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Áp dụng theme ngay lập tức để tránh bị nháy màn hình trắng khi load trang
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});