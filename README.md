# React + TypeScript + Vite + Tailwind CSS

A modern React application built with TypeScript, Vite, and Tailwind CSS. This project provides a beautiful, responsive UI with dark mode support and reusable components.

## ✨ Features

- ⚡️ **Vite** - Fast build tool and development server
- ⚛️ **React 18** - Latest React with TypeScript
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🌙 **Dark Mode** - Automatic dark/light mode support
- 📱 **Responsive Design** - Mobile-first approach
- 🔧 **TypeScript** - Type safety and better DX
- 🎯 **ESLint** - Code linting and formatting
- 📦 **Component Library** - Reusable UI components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd react-app
   npm install
   ```

2. **Set up password protection (optional):**
   ```bash
   # Copy the environment template
   cp env.template .env.local
   
   # Edit .env.local and set your desired password
   # SITE_PASSWORD=your-secure-password-here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:5173` to see your app running!

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── Card.tsx        # Card container component
│   ├── Layout.tsx      # Page layout component
│   └── index.ts        # Component exports
├── assets/             # Static assets
├── App.tsx             # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles with Tailwind
```

## 🎨 Components

### Button
A flexible button component with multiple variants and sizes:

```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me!
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline'`
- `size`: `'sm' | 'md' | 'lg'`

### Card
A beautiful card container with optional title:

```tsx
<Card title="My Card">
  <p>Card content goes here</p>
</Card>
```

### Layout
A responsive layout wrapper with gradient background:

```tsx
<Layout>
  <YourContent />
</Layout>
```

## 🎯 Customization

### Tailwind Configuration
The project includes a custom Tailwind configuration in `tailwind.config.js`:

- Custom animations (slow spin for React logo)
- Extended color palette
- Responsive breakpoints

### Adding New Components
1. Create your component in `src/components/`
2. Export it from `src/components/index.ts`
3. Import and use: `import { YourComponent } from './components'`

## 🌙 Dark Mode

The app automatically respects your system's dark mode preference using Tailwind's built-in dark mode support.

## 🔒 Password Protection

This site includes optional password protection using Vercel Edge Middleware. When enabled, visitors must enter a password before accessing the site.

### Setup Password Protection

1. **Local Development:**
   ```bash
   # Create .env.local file
   cp env.template .env.local
   
   # Edit .env.local and set your password
   SITE_PASSWORD=your-secure-password-here
   ```

2. **Production (Vercel):**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add `SITE_PASSWORD` with your desired password
   - Redeploy your application

### Features
- ✅ Secure server-side authentication (can't be bypassed)
- ✅ Session cookies (password cached for 7 days)
- ✅ HTTP-only cookies (secure from JavaScript access)
- ✅ Automatic redirect to login page
- ✅ Clean, branded login interface

### Disable Password Protection
To disable password protection, simply remove or comment out the `SITE_PASSWORD` environment variable.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service like Vercel, Netlify, or GitHub Pages.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

**Important:** Don't forget to set the `SITE_PASSWORD` environment variable in your Vercel dashboard after deployment.

### Deploy to Netlify
```bash
npm run build
# Then drag and drop the 'dist' folder to Netlify
```

## 📚 Learn More

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ using React, TypeScript, Vite, and Tailwind CSS
