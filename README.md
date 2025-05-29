# ⚡ Next.js Static Site SEO Template (with Multilanguage Support)

A minimal, high-performance **Next.js** template optimized for generating static pages with strong SEO support and multi-language capabilities using `next-intl`. Perfect for hosting on platforms like Vercel, Netlify, or traditional web hosting services.

---

## 🌍 Live Preview

You can preview the deployed site here:

🔗 [https://marestelle.vercel.app/it](https://marestelle.vercel.app/it)

> ⚠️ This is a temporary deployment link provided by Vercel for preview purposes. Replace this with your custom domain when ready.

---


## ✨ Features

- ✅ **SEO-ready** via `Metadata.jsx` helper
- 🌐 **Multilanguage** routing with `next-intl`
- ⚡ **Static export** with `next export`
- 🎨 **Tailwind CSS** styling
- 🧠 **Structured data** and OpenGraph support
- 📱 Fully responsive design

---

## 📁 Project Structure

```
├── components/
│   └── Metadata.jsx      # SEO metadata + structured data generator
├── app/
│   └── [locale]/         # Dynamic locale routing
│       ├── page.jsx      # Homepage for each locale
│       ├── contatti/
│       │   └── page.jsx
│       └── chi-siamo/
│           └── page.jsx
├── public/               # Static assets
├── next.config.js        # Next.js config with `output: 'export'`
└── README.md
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
# or
yarn install
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔨 Build Static Export

```bash
npm run build
# Generates the /out folder with static files
```

Deploy the `/out` folder to any static host (Netlify, Hostinger, GitHub Pages, etc.).

---

## 🧠 Metadata Helper

Use `components/Metadata.jsx`:

```jsx
<Metadata
  title="Chi siamo - Marestelle"
  description="Scopri chi siamo. La nostra missione e i nostri valori."
  image="/og-image.jpg"
  type="WebPage"
/>
```

Injects:
- SEO title, description, canonical link
- OpenGraph and Twitter Cards
- Schema.org structured data (`WebPage`, `Article`, etc.)

---

## 🌐 Multilingual Support

Pages are organized by locale inside `[locale]` folders (e.g. `/it`, `/en`).

- Fully crawlable by search engines
- Language-specific URLs like `/it/contatti`, `/en/contact`
- Translation messages managed via `next-intl`

---

## 🏗 Customization

- Replace content in `app/[locale]`
- Update translations and SEO data
- Customize design using Tailwind classes

---

## ✅ Summary

| Feature        | Description                            |
|----------------|----------------------------------------|
| Static Export  | Great performance, easy hosting        |
| Multilanguage  | Locale-aware routing and translations  |
| SEO Metadata   | Tags, OpenGraph, structured data       |
| Tailwind CSS   | Responsive and modern design           |
| Deploy Ready   | Works with any static hosting provider |

---

## 👨‍💼 Author

Built with ❤️ by Viraj Perera using [Next.js](https://nextjs.org) and [next-intl](https://next-intl-docs.vercel.app).

---

## 📜 License

[Next.js](https://github.com/viraj-perera-dev/marestelle.com/blob/main/LICENSE)