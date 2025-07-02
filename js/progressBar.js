const progressBar = document.getElementById('progressBar');

function updateProgressBar() {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = document.documentElement.scrollTop;
    const progress = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateProgressBar);
window.onload = updateProgressBar;
