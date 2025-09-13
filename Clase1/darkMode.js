function toggleDarkMode() {
    if (document.body.className.includes('dark-mode')) {
        document.body.removeAttribute('class');
    } else {
        document.body.setAttribute('class', 'dark-mode');
    }
}
