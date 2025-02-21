
        let scene, camera, renderer, sphere, textureLoader;
        let speed = 0.001; // Vitesse de rotation
        let images = ["https://gael-mgn.github.io/360/img/website/1.jpg", "https://gael-mgn.github.io/360/img/website/2.jpg", "https://gael-mgn.github.io/360/img/website/3.jpg"]; // Liste des images 360°
        let textures = {}; // Stockage des textures préchargées
        let currentImageIndex = 0;
        let autoChangeInterval;
        const fadeOverlay = document.getElementById("fadeOverlay");

        function init() {
            const container = document.getElementById("viewer");

            // Get the dimensions using getBoundingClientRect
            const rect = container.getBoundingClientRect();

            // Création de la scène
            scene = new THREE.Scene();

            // Création de la caméra
            camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
            camera.position.set(0, 0, 0.1);

            // Récupérer la taille du conteneur et ajuster le rendu en conséquence
    function resizeRendererToDisplaySize(renderer) {
        const container = document.getElementById("viewer");
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

            // Rendu WebGL
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(rect.width, rect.height);
            container.appendChild(renderer.domElement);

            // Chargement des textures au démarrage
            textureLoader = new THREE.TextureLoader();
            preloadTextures(images, () => {
                // Création de la sphère une fois les textures chargées
                const geometry = new THREE.SphereGeometry(500, 60, 40);
                const material = new THREE.MeshBasicMaterial({
                    map: textures[images[currentImageIndex]], 
                    side: THREE.BackSide
                });
                sphere = new THREE.Mesh(geometry, material);
                scene.add(sphere);

                startAutoChange(); // Lancement du changement auto
                animate();
            });

            // Redimensionnement dynamique
            window.addEventListener('resize', () => resizeRendererToDisplaySize(renderer));
            // Changer l'image avec la touche espace
            window.addEventListener("keydown", (event) => {
                if (event.code === "Space") {
                    resetAutoChange(); // Réinitialise le compteur
                    changeImage();
                }
            });
        }

        // 🔹 Précharge toutes les textures avant d'afficher la scène
        function preloadTextures(imageList, callback) {
            let loadedCount = 0;
            imageList.forEach(image => {
                textureLoader.load(image, (texture) => {
                    texture.colorSpace = THREE.SRGBColorSpace;
                    textures[image] = texture; // Stocke la texture préchargée
                    loadedCount++;
                    if (loadedCount === imageList.length) callback(); // Une fois toutes chargées, callback
                });
            });
        }

        // 🔹 Change l'image avec une transition en fondu noir
        function changeImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length; // Boucle sur les images
            const newTexture = textures[images[currentImageIndex]];

            fadeOverlay.style.opacity = 1; // Début du fondu noir

            setTimeout(() => {
                sphere.material.map = newTexture;
                sphere.material.needsUpdate = true;
                fadeOverlay.style.opacity = 0; // Fin du fondu noir
            }, 500);
        }

        // 🔹 Démarre le changement d’image automatique
        function startAutoChange() {
            autoChangeInterval = setInterval(changeImage, 7000); // Change toutes les 3s
        }

        // 🔹 Réinitialise le changement auto (utile si l’utilisateur change manuellement)
        function resetAutoChange() {
            clearInterval(autoChangeInterval); // Stoppe le timer
            startAutoChange(); // Redémarre le cycle
        }

        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.y += speed; // Rotation automatique
            renderer.render(scene, camera);
        }

        init();