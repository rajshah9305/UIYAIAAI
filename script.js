// --- 0. Lenis for Smooth Scroll ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


// --- 1. Custom Cursor Logic ---
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
const triggers = document.querySelectorAll('.hover-trigger');

if (window.matchMedia("(min-width: 1024px)").matches) {
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for dot
        cursor.style.left = mouseX - 8 + 'px';
        cursor.style.top = mouseY - 8 + 'px';
    });

    // Smooth delay for follower ring
    setInterval(() => {
        posX += (mouseX - posX) / 9;
        posY += (mouseY - posY) / 9;
        follower.style.left = posX - 24 + 'px';
        follower.style.top = posY - 24 + 'px';
    }, 10);

    // Hover States
    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            document.body.classList.add('hover-active');
            const text = trigger.getAttribute('data-cursor-text');
            const scale = trigger.getAttribute('data-cursor-scale');
            
            if(text) {
                follower.innerHTML = `<span class="text-[10px] font-mono font-bold text-earth-terra absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">${text}</span>`;
                follower.classList.add('bg-earth-cream');
                follower.style.borderColor = 'transparent';
            }
            
            if(scale) {
                follower.style.transform = `scale(${scale})`;
            }
        });

        trigger.addEventListener('mouseleave', () => {
            document.body.classList.remove('hover-active');
            follower.innerHTML = '';
            follower.classList.remove('bg-earth-cream');
            follower.style.borderColor = '#E2725B';
            follower.style.transform = 'scale(1)';
        });
    });
}


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

const processSteps = document.querySelectorAll('.process-step-item');
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.1 });

processSteps.forEach((step, index) => {
    step.style.transitionDelay = `${index * 200}ms`;
    processObserver.observe(step);
});

// Initial trigger for hero section without wait
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const heroElements = heroSection.querySelectorAll('.line-inner');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transform = 'translateY(0)';
            }, 500 + index * 100); 
        });
    }
});


// --- 4. Parallax Effect ---
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

if(menuButton) {
    menuButton.addEventListener('click', () => {
        menuOverlay.classList.toggle('open');
        if (menuOverlay.classList.contains('open')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });
}

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
        });
    });
});
