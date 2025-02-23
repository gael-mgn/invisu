        function smoothScrollTo(element, duration) {
            const targetPosition = document.getElementById(element).offsetTop;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animationStep(currentTime) {
                if (!startTime) startTime = currentTime;
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);

                const easeInOut = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                window.scrollTo(0, startPosition + distance * easeInOut);

                if (elapsedTime < duration) {
                    requestAnimationFrame(animationStep);
                }
            }

            requestAnimationFrame(animationStep);
        }


       



let menu = false;
function closeMenu() {
    if(menu){
        document.querySelector(".menu").classList.toggle("open");
            menu = false;
        }
}
function toggleMenu() {
    document.querySelector(".menu").classList.toggle("open");
        if(menu){
            menu = false;
        }
        else {
            menu = true;
        }
        }

    document.addEventListener("DOMContentLoaded", () => {





        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // Désactive l'observation après l'animation
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll(".news-card").forEach(card => {
            observer.observe(card);
        });
    });