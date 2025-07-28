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

// === Load Recent Blog Posts on main.html ===
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("main.html")) {
    fetch("blog/posts.json")
      .then(res => res.json())
      .then(data => {
        const recentPostsContainer = document.getElementById("recent-posts");
        if (!recentPostsContainer) return;
        const recent = data.slice(0, 2);
        recent.forEach(post => {
          const div = document.createElement("div");
          div.classList.add("post-card");
          div.innerHTML = `<h3>${post.title}</h3><p>${post.snippet}</p>`;
          recentPostsContainer.appendChild(div);
        });
      });
  }
});

// === Mobile Nav Toggle ===
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

if (navToggle && navMenu && navBackdrop) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('show');
    navToggle.classList.toggle('active');
    navBackdrop.classList.toggle('show', isOpen);
  });

  navBackdrop.addEventListener('click', () => {
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
    navBackdrop.classList.remove('show');
  });

  const navItems = navMenu.querySelectorAll('a');
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
      navToggle.classList.remove('active');
      navBackdrop.classList.remove('show');
    });
  });
}

// === Generate JSON blog for new posts ===

let currentPostData = [];

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("blog.html")) {
    fetch("blog/posts.json")
      .then(res => res.json())
      .then(data => {
        currentPostData = [...data]; // stores existing posts
        const blogSection = document.getElementById("blog-posts");
        if (!blogSection) return;

        data.forEach(post => {
          const article = document.createElement("article");
          article.classList.add("post-card");
          article.innerHTML = `
            <h3 id="${post.id}-title" data-editable>${post.title}</h3>
            <p id="${post.id}-snippet" data-editable>${post.snippet}</p>
            <a href="blog-post.html#${post.id}" class="cta-button" style="margin-top: 0.75rem;">Read More →</a>
          `;
          blogSection.appendChild(article);
        });

        if (document.body.classList.contains("edit-mode")) {
          enableEditableContent();
        }
      });

    // === New Post + Download JSON in Admin Mode ===
    if (window.location.search.includes("editmode=true")) {
      const newBtn = document.getElementById('newPostBtn');
      const dlBtn = document.getElementById('downloadJsonBtn');

      if (newBtn) {
        newBtn.style.display = 'inline-block';
        newBtn.addEventListener('click', () => {
          const id = "post-" + Date.now();
          const title = prompt("Enter blog post title:");
          const snippet = prompt("Enter blog snippet or teaser:");
          const body = prompt("Enter full post content:");
          if (!body) return;
          if (!title || !snippet) return;

          const post = { id, title, snippet, body };
          currentPostData.unshift(post); // ➕ Add to the stored data

          const article = document.createElement('article');
          article.classList.add('post-card');
          article.innerHTML = `
            <h3 id="${id}-title" data-editable>${title}</h3>
            <p id="${id}-snippet" data-editable>${snippet}</p>
            <a href="blog-post.html#${id}" class="cta-button" style="margin-top: 0.75rem;">Read More →</a>
          `;
          document.getElementById('blog-posts').prepend(article);
          enableEditableContent?.();
          showToast("⚠️ Post saved locally. Download posts.json to save permanently.");
        });
      }

      if (dlBtn) {
        dlBtn.style.display = 'inline-block';
        dlBtn.addEventListener('click', () => {
          const blob = new Blob([JSON.stringify(currentPostData, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "posts.json";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          showToast("💾 posts.json downloaded");
        });
      }
    }
  }
});


// === Load Single Post by URL Hash ===
document.addEventListener("DOMContentLoaded", () => {
  const isPostPage = window.location.pathname.includes("blog-post.html");
  const postId = window.location.hash?.substring(1);

  if (isPostPage && postId) {
    fetch("blog/posts.json")
      .then(res => res.json())
      .then(data => {
        const post = data.find(p => p.id === postId);
        console.log("Loaded post:", post);
        if (!post) return;

        document.getElementById("post-title").innerText = post.title;
        document.getElementById("post-snippet").innerText = post.snippet;
        document.getElementById("post-body").innerText = post.body;
      });

    if (window.location.search.includes("editmode=true")) {
      document.body.classList.add("edit-mode");
      enableEditableContent();
    }
  }
});

// === Toast function for fadding in and out ===

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Add .js class to <html> so CSS only activates if JS is running
document.documentElement.classList.add('js');

// Fade in on load
window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.page-transition');
  if (wrapper) {
    // Delay just a hair to let CSS apply
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrapper.classList.add('loaded');
    });
  });
  }
});

// Fade out before navigating
document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const wrapper = document.querySelector('.page-transition');

    const shouldIgnore = (
      !href ||
      href.startsWith('#') ||
      link.target ||
      link.hasAttribute('download')
    );

    if (!wrapper || shouldIgnore) return;

    e.preventDefault();
    wrapper.classList.remove('loaded');
    setTimeout(() => {
      window.location.href = href;
    }, 300); // match the CSS transition time
  });
});
