// dark mode toggle 
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
// Kiểm tra xem lần trước người dùng đang chọn chế độ nào
document.addEventListener('DOMContentLoaded', () => {
    // Kiểm tra và áp dụng theme đã lưu
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
});