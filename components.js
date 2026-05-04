// components.js — injects shared nav and footer
(function() {
  const NAV_HTML = `
<nav id="site-nav">
  <a href="/nexlyr/index.html" class="nav-logo">
    <div class="nav-logo-mark">N</div>
    Nexlyr
  </a>
  <ul class="nav-links">
    <li><a href="/nexlyr/index.html">Home</a></li>
    <li><a href="/nexlyr/pages/about.html">About</a></li>
    <li><a href="/nexlyr/pages/services.html">Services</a></li>
    <li><a href="/nexlyr/pages/tools.html">AI Tools</a></li>
    <li><a href="/nexlyr/pages/case-studies.html">Work</a></li>
    <li><a href="/nexlyr/pages/blog.html">Blog</a></li>
    <li><a href="/nexlyr/pages/pricing.html">Pricing</a></li>
    <li><a href="/nexlyr/pages/contact.html" class="nav-cta">Get Started</a></li>
  </ul>
  <div class="nav-hamburger" aria-label="Open menu">
    <span></span><span></span><span></span>
  </div>
</nav>

<div class="mobile-menu">
  <button class="mobile-close" aria-label="Close">✕</button>
  <a href="/nexlyr/index.html">Home</a>
  <a href="/nexlyr/pages/about.html">About</a>
  <a href="/nexlyr/pages/services.html">Services</a>
  <a href="/nexlyr/pages/tools.html">AI Tools</a>
  <a href="/nexlyr/pages/case-studies.html">Work</a>
  <a href="/nexlyr/pages/blog.html">Blog</a>
  <a href="/nexlyr/pages/pricing.html">Pricing</a>
  <a href="/nexlyr/pages/careers.html">Careers</a>
  <a href="/nexlyr/pages/contact.html">Contact</a>
</div>`;

  const FOOTER_HTML = `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/nexlyr/index.html" class="nav-logo">
          <div class="nav-logo-mark">N</div>
          Nexlyr
        </a>
        <p>We surface, evaluate, and integrate the world's most powerful AI tools — so your business moves faster than your competition.</p>
        <div style="display:flex;gap:16px;margin-top:24px;">
          <a href="#" style="color:var(--text-muted);text-decoration:none;font-size:0.8rem;font-family:var(--font-mono);">Twitter/X</a>
          <a href="#" style="color:var(--text-muted);text-decoration:none;font-size:0.8rem;font-family:var(--font-mono);">LinkedIn</a>
          <a href="#" style="color:var(--text-muted);text-decoration:none;font-size:0.8rem;font-family:var(--font-mono);">GitHub</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/nexlyr/pages/about.html">About</a></li>
          <li><a href="/nexlyr/pages/case-studies.html">Case Studies</a></li>
          <li><a href="/nexlyr/pages/blog.html">Blog</a></li>
          <li><a href="/nexlyr/pages/careers.html">Careers</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Product</h4>
        <ul>
          <li><a href="/nexlyr/pages/services.html">Services</a></li>
          <li><a href="/nexlyr/pages/tools.html">AI Tools</a></li>
          <li><a href="/nexlyr/pages/pricing.html">Pricing</a></li>
          <li><a href="/nexlyr/pages/contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a href="/nexlyr/pages/privacy.html">Privacy Policy</a></li>
          <li><a href="/nexlyr/pages/terms.html">Terms of Service</a></li>
          <li><a href="/nexlyr/pages/cookies.html">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Nexlyr. All rights reserved.</p>
      <p>Built with purpose. Powered by intelligence.</p>
    </div>
  </div>
</footer>`;

  // Fix links based on current path depth
  function fixLinks(html) {
    const isRoot = !window.location.pathname.includes('/pages/');
    if (isRoot) return html.replace(/\/nexlyr\//g, './').replace(/\/nexlyr\//g, './');
    return html.replace(/\/nexlyr\//g, '../');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const navEl = document.getElementById('nav-placeholder');
    const footerEl = document.getElementById('footer-placeholder');
    if (navEl) navEl.outerHTML = fixLinks(NAV_HTML);
    if (footerEl) footerEl.outerHTML = fixLinks(FOOTER_HTML);
  });
})();
