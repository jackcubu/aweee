document.addEventListener('DOMContentLoaded', async () => {
    // Lấy ID từ URL
    const id = new URLSearchParams(window.location.search).get("id");
    const params = new URLSearchParams(window.location.search);
    const mangaId = params.get('id');
    
    // Kiểm tra xem ID có thực sự tồn tại không
    console.log("ID nhận được từ URL là:", mangaId); 
    
    if (!mangaId) {
        alert("Lỗi: Không tìm thấy ID trong URL! Hãy thử truy cập link: info.html?id=1");
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

            const chapterList = document.getElementById('chapter-list');
        manga.chapters.forEach((chap, index) => {
            const li = document.createElement('li');
                li.innerHTML = `<a href="reader.html?manga=${mangaId}&chap=${index}">${chap.name}</a>`;
                chapterList.appendChild(li);
            });
        } else {
            alert("Lỗi: Không tìm thấy truyện có ID là " + mangaId + " trong file JSON!");
        }
    } catch (error) {
        alert("Lỗi kết nối file JSON, kiểm tra Console (F12)!");
        console.error(error);
    }
});
//aaaaaaaaaaa//
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Lưu lựa chọn vào trình duyệt để lần sau vào không bị đổi lại
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Kiểm tra xem lần trước người dùng đang chọn chế độ nào
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
}