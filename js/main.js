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