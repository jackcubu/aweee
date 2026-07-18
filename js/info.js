document.addEventListener('DOMContentLoaded', async () => {

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
           
            document.title = `${manga.title} | AG`;

            document.querySelector('.manga-cover').src = manga.cover;
            document.querySelector('.manga-title').innerHTML = `${manga.title} <span class="status-dot"></span><span class="status-text">${manga.status}</span>`;
            document.querySelector('.original-title').innerText = manga.original_title;
            document.querySelector('.description').innerText = manga.description;
            document.querySelector('.author').innerText = `Tác giả: ${manga.author}`;

            
            const chapterList = document.getElementById('chapter-list');
            chapterList.innerHTML = ''; 
            
            manga.chapters.forEach((chap, index) => {
                const li = document.createElement('li');
               
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


document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

   
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if(themeToggle) themeToggle.innerText = '☀️';
    }

    
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            
            localStorage.setItem('dark-mode', isDark);
            themeToggle.innerText = isDark ? '☀️' : '🌙';
        });
    }
});


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