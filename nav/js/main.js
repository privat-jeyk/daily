const linkItems = document.querySelectorAll(".link-item");

linkItems.forEach((linkItem, index) => {
    linkItem.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        linkItem.classList.add("active");

        const indicator = document.querySelector(".indicator");

        // Hier wurde das "þ" durch ein normales "p" ersetzt
        indicator.style.left = `${index * 95 + 48}px`; 
    })
})