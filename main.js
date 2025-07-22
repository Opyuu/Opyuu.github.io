let curMenu = 1;


const img = document.getElementById('mainLogo');

img.addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;

    // Calculate mouse position relative to card center
    const mouseX = e.clientX - cardCenterX;
    const mouseY = e.clientY - cardCenterY;

    // Calculate rotation values (adjust sensitivity as needed)
    const rotateY = (mouseX / rect.width) * 40;  // ±20 degrees max on X-axis
    const rotateX = (-Math.abs(mouseY) / rect.height) * -35; // ±20 degrees max on Y-axis (inverted)

    // Apply transformations
    img.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
    `;
});

img.addEventListener('mouseleave', () => {
    img.style.transform = 'rotateX(0) rotateY(0) scale(1)';
});

function change_menu(menuNum) {
    const curContent = document.getElementById(`content${curMenu}`);
    const curNav = document.getElementById(`nav${curMenu}`);
    const nextContent = document.getElementById(`content${menuNum}`);
    const nextNav = document.getElementById(`nav${menuNum}`);

    curNav.classList.remove('curNav');
    nextNav.classList.add('curNav');

    curContent.style.display = "none";
    nextContent.style.display = "flex";

    curMenu = menuNum;
}


document.addEventListener('keydown', (e) => {
    if (e.key === '1')
        change_menu(1);
    else if (e.key === '2')
        change_menu(2);
    else if (e.key === '3')
        change_menu(3);
});
