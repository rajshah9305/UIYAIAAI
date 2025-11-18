// --- 0. Lenis for Smooth Scroll ---
const lenis = new Lenis()

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


// --- 2. Clock Logic ---
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('clock').innerText = timeString;
}

setInterval(updateClock, 1000);
updateClock();

// --- 3. Intersection Observer for Reveals ---
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            // Stagger children if they exist
            const children = entry.target.querySelectorAll('.line-inner');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe headers and text blocks - Exclude hero elements from observer
document.querySelectorAll('.line-wrapper').forEach(el => {
    if (!el.closest('.hero-section')) {
        observer.observe(el);
    }
});

// Initial trigger for hero section without wait
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const heroElements = heroSection.querySelectorAll('.line-inner');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transform = 'translateY(0)';
            }, 500 + index * 100); // Staggered delay
        });
    }
});


// --- 4. Parallax Effect (Vanilla JS) ---
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Parallax for diagonal slice
    const slice = document.querySelector('.diagonal-slice');
    if(slice) {
        slice.style.transform = `translateY(-${scrolled * 0.1}px) skewY(-2deg)`;
    }

    // Parallax for hero image
    const heroImage = document.getElementById('hero-image');
    if (heroImage) {
        // We add this transform style, but it might be overwritten by the hover effect's class.
        // For a more robust solution, both transforms should be managed via JS or a parent container used for one of them.
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }

    // Parallax for images in gallery
    const images = document.querySelectorAll('.img-container img');
    images.forEach((img, index) => {
        const speed = index % 2 === 0 ? 0.05 : 0.08;
        img.style.transform = `scale(1.1) translateY(${scrolled * speed}px)`;
    });
});

// --- 5. Menu Logic ---
const menuButton = document.querySelector('.fixed.bottom-8.right-8 button');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('#menu-overlay .menu-link');

menuButton.addEventListener('click', () => {
    menuOverlay.classList.toggle('open');
    if (menuOverlay.classList.contains('open')) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        menuOverlay.classList.remove('open');
        lenis.start();

        // Lenis smooth scroll to anchor
        const targetId = link.getAttribute('href');
        lenis.scrollTo(targetId, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
    });
});
