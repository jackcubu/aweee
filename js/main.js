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