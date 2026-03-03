// ==========================================
// 1. THREE.JS: KHATARNAK 3D BACKGROUND
// ==========================================
// Ek canvas create karke background mein set kar rahe hain
const canvas = document.createElement('canvas');
canvas.id = 'webgl-canvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-2'; // Sabse piche rahega
document.body.appendChild(canvas);

// 3D Scene, Camera, aur Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Ek complex 3D Shape (Torus Knot) bana rahe hain glowing particles se
const geometry = new THREE.TorusKnotGeometry(12, 4, 200, 30);
const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
});
const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 35;

// Mouse track karne ke variables
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation Loop (Lagatar chalne wala render)
function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Shape ko khud ghumne do
    particles.rotation.x += 0.002;
    particles.rotation.y += 0.003;
    
    // Mouse ke hisab se 3D shape ko move karo (Parallax Effect)
    particles.position.x += (mouseX * 8 - particles.position.x) * 0.05;
    particles.position.y += (mouseY * 8 - particles.position.y) * 0.05;
    
    renderer.render(scene, camera);
}
animate3D();

// Screen resize hone par 3D canvas adjust ho jaye
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ==========================================
// 2. GSAP SCRUBBING (SCROLL KE SATH ANIMATION)
// ==========================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Khatarnak Effect: Scroll karne par 3D shape screen par zoom hoga
    gsap.to(particles.scale, {
        x: 2.5, y: 2.5, z: 2.5,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5 // Scroll wheel chhodne ke baad bhi smooth rukega
        }
    });

    // Cards float aur 3D tilt hote hue aayenge jab aap scroll karenge
    gsap.utils.toArray('.glass-card').forEach(card => {
        gsap.fromTo(card, 
            { y: 200, opacity: 0, rotationX: 25, scale: 0.8 }, 
            {
                y: 0, opacity: 1, rotationX: 0, scale: 1,
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%", // Card screen par aate hi
                    end: "top 40%",   // Jab tak card middle mein na aaye
                    scrub: 1          // Scroll ke sath-sath animation aage badhega
                }
            }
        );
    });

    // Hero Section ke text ka explosive entry
    gsap.from(".gsap-reveal", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out",
        delay: 0.2
    });
}


// ==========================================
// 3. CUSTOM CURSOR & TYPING EFFECT
// ==========================================
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');

if (dot && outline) {
    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 400, fill: "forwards" });
    });

    document.querySelectorAll('a, .skill-tag, .cyber-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '70px';
            outline.style.height = '70px';
            outline.style.background = 'rgba(0, 240, 255, 0.2)';
            outline.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.width = '40px';
            outline.style.height = '40px';
            outline.style.background = 'transparent';
            outline.style.borderColor = 'rgba(0, 240, 255, 0.5)';
        });
    });
}

// Progress Bar
window.addEventListener("scroll", () => {
    let progress = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
});

// Typing Effect
if (document.querySelector('.typing')) {
    new Typed('.typing', {
        strings: ['Computer Science Student', '3D Designer', 'Web Architect', 'Creative Developer'],
        typeSpeed: 60,
        backSpeed: 40,
        loop: true,
        cursorChar: '_'
    });
}

// Vanilla Tilt (Hover karne par cards ka 3D tilt hona)
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
        max: 15,
        speed: 300,
        glare: true,
        "max-glare": 0.2,
        perspective: 800
    });
}