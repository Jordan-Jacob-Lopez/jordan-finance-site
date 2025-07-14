
// === Fade-in Elements on Scroll ===
const fadeElements = document.querySelectorAll('.fade-in-element');
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => observer.observe(el));



// === Scroll Spy for Nav Highlights ===
const sections = document.querySelectorAll('section[id]');
const spyLinks = document.querySelectorAll('.spy-link');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  spyLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
});

// === Edit Mode Toggle via URL ===

const isAdmin = window.location.search.includes("editmode=true");
if (isAdmin) document.body.classList.add("edit-mode");


// === Make [data-editable] Elements Editable ===

function enableEditableContent() {
  const editableElements = document.querySelectorAll('[data-editable]');
  editableElements.forEach(el => {
    el.contentEditable = true;
    el.style.outline = "1px dashed #90caf9";
    el.addEventListener('input', () => {
      localStorage.setItem(el.id, el.innerText);
    });
    const saved = localStorage.getItem(el.id);
    if (saved) el.innerText = saved;
  });
}


// === Load Blog Posts Dynamically from posts.json ===

fetch('posts.json')
  .then(res => res.json())
  .then(data => {
    const blogSection = document.getElementById('blog-posts');
    if (!blogSection) return;

    data.forEach(post => {
      const article = document.createElement('article');
      article.classList.add('post-card');
      article.innerHTML = `
        <h3 id="${post.id}-title" data-editable>${post.title}</h3>
        <p id="${post.id}-snippet" data-editable>${post.snippet}</p>
      `;
      blogSection.appendChild(article);
    });

    if (document.body.classList.contains("edit-mode")) {
      enableEditableContent();
    }
  });
// === Mobile Nav Toggle Functionality ===
// Burger menu + backdrop toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

if (navToggle && navMenu && navBackdrop) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
    navBackdrop.classList.toggle('show', isOpen);
  });

  // Close menu when clicking backdrop
  navBackdrop.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
    navBackdrop.classList.remove('show');
  });
}

// === New Post Button for Admin (Blog Page Only) ===
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("blog.html") && window.location.search.includes("editmode=true")) {
    const btn = document.getElementById('newPostBtn');
    if (btn) {
      btn.style.display = 'inline-block';
      btn.addEventListener('click', () => {
        const id = "post-" + Date.now();
        const title = prompt("Enter blog post title:");
        const snippet = prompt("Enter blog snippet or teaser:");
        if (!title || !snippet) return;

        const blogSection = document.getElementById('blog-posts');
        const article = document.createElement('article');
        article.classList.add('post-card');
        article.innerHTML = `
          <h3 id="${id}-title" data-editable>${title}</h3>
          <p id="${id}-snippet" data-editable>${snippet}</p>
        `;
        blogSection.prepend(article);
        enableEditableContent?.();
      });
    }
  }
});
// === Load Recent Blog Posts on main.html ===
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("main.html")) {
    fetch("posts.json")
      .then(res => res.json())
      .then(data => {
        const recentPostsContainer = document.getElementById("recent-posts");
        if (!recentPostsContainer) return;

        const recent = data.slice(0, 2); // Grab the first 2 posts

        recent.forEach(post => {
          const div = document.createElement("div");
          div.classList.add("post-card");
          div.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.snippet}</p>
          `;
          recentPostsContainer.appendChild(div);
        });
      });
  }
});
