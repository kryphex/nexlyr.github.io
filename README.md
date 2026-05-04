# Nexlyr — AI Tools & SaaS Intelligence Platform

A fully built, dark cinematic 10-page website for **Nexlyr** — a fictional AI Tools Intelligence agency. Built with pure HTML, CSS, and Three.js. Zero build step. Deploy directly to GitHub Pages.

---

## 🗂 Site Structure

```
nexlyr/
├── index.html              ← Homepage (3D liquid blob hero)
├── css/
│   └── style.css           ← Full design system
├── js/
│   ├── nexlyr-3d.js        ← Three.js liquid morphing engine
│   └── components.js       ← Shared nav + footer injector
└── pages/
    ├── about.html          ← Story, values, team, timeline
    ├── services.html       ← 6 detailed service sections
    ├── tools.html          ← Filterable AI tools directory
    ├── case-studies.html   ← 8 client case studies with metrics
    ├── blog.html           ← Blog grid + newsletter signup
    ├── pricing.html        ← 3-tier pricing + billing toggle + FAQ
    ├── careers.html        ← Job listings + perks
    ├── contact.html        ← Contact form + offices
    ├── privacy.html        ← Privacy Policy
    ├── terms.html          ← Terms of Service
    └── cookies.html        ← Cookie Policy
```

## 🚀 Deploy to GitHub Pages

1. Push this entire `nexlyr/` folder to a GitHub repo
2. Go to **Settings → Pages**
3. Set source: **Deploy from branch → main → / (root)**
4. Visit `https://yourusername.github.io/nexlyr/`

## ✨ Features

- **3D liquid morphing blob** — Three.js WebGL, real-time simplex noise deformation, mouse parallax
- **Dark cinematic aesthetic** — deep space palette, Playfair Display + Outfit + DM Mono fonts
- **10 full pages** — Home, About, Services, AI Tools Directory, Case Studies, Blog, Pricing, Careers, Contact, 3 Legal pages
- **Shared nav + footer** — injected via JS components, path-aware for root vs /pages/
- **Scroll-triggered animations** — IntersectionObserver, fade-up reveals
- **Animated counters** — eased number animations on scroll
- **Interactive tools directory** — live filter by category + search
- **Pricing toggle** — monthly/annual with animated price swap
- **Mouse-tracked card glow** — CSS custom property driven highlight
- **Mobile responsive** — full hamburger menu, breakpoints at 768px and 1024px
- **Film grain overlay** — SVG noise texture for cinematic feel
- **Zero dependencies** — only Three.js r128 from CDN

## 🎨 Design System

| Variable | Value |
|---|---|
| `--void` | `#020308` |
| `--accent` | `#4f8cff` |
| `--teal` | `#00d4b8` |
| `--violet` | `#8b5cf6` |
| Display font | Playfair Display |
| Body font | Outfit |
| Mono font | DM Mono |

## 🔧 Customization

- **Brand name/logo** — edit `components.js` nav logo section
- **Colors** — edit CSS variables in `style.css :root`
- **3D speed/scale** — pass `{ speed, scale, cameraZ }` options to `Nexlyr.init()`
- **Content** — all pages are plain HTML, fully editable
