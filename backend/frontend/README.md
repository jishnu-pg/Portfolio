# 🎨 Portfolio Frontend - React + Vite

A modern, responsive portfolio website built with React, featuring beautiful animations, dark mode support, and a comprehensive admin dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠 Tech Stack

### Core Technologies
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations and transitions

### UI/UX Libraries
- **Lucide React** - Beautiful icon library
- **React Icons** - Comprehensive icon collection
- **Recharts** - Interactive charts and data visualization
- **React Intersection Observer** - Scroll-triggered animations

### Internationalization
- **React-i18next** - Internationalization and localization
- **i18next-browser-languagedetector** - Language detection

### HTTP Client
- **Axios** - HTTP client for API requests

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/           # Reusable React components
│   ├── admin/          # Admin-specific components
│   │   ├── AdminLayout.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── BlogManager.jsx
│   │   ├── ContactViewer.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── ExperienceManager.jsx
│   │   ├── ProjectManager.jsx
│   │   ├── ResumeManager.jsx
│   │   ├── SkillManager.jsx
│   │   └── TestimonialManager.jsx
│   ├── Accessibility.jsx
│   ├── ErrorTest.jsx
│   ├── Hero.jsx
│   ├── Logo.jsx
│   ├── Navigation.jsx
│   ├── NewsletterSignup.jsx
│   ├── ResumeDownload.jsx
│   └── ThemeToggle.jsx
├── context/            # React context providers
│   └── ThemeContext.jsx
├── locales/           # Translation files
│   ├── en.json
│   └── ml.json
├── pages/             # Page components
│   ├── About.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminLogin.jsx
│   ├── Blog.jsx
│   ├── Contact.jsx
│   ├── Home.jsx
│   ├── Projects.jsx
│   └── Skills.jsx
├── utils/             # Utility functions
│   ├── auth.js
│   └── axios.js
├── App.css
├── App.jsx
├── i18n.js
└── main.jsx
```

## 🎨 Features

### Public Pages
- **Home** - Hero section, tech stack, featured projects, recent blogs, testimonials
- **About** - Personal information, skills, experience timeline
- **Projects** - Project showcase with search and filtering
- **Skills** - Interactive skills with animated progress bars
- **Blog** - Blog posts with search and category filtering
- **Contact** - Contact form with validation

### Admin Features
- **Admin Dashboard** - Real-time analytics and statistics
- **Content Management** - Full CRUD operations for all content
- **Resume Management** - Upload and manage resume files
- **Dynamic Charts** - Interactive data visualization
- **Search & Filter** - Advanced content filtering

### Advanced Features
- **Dark/Light Mode** - Theme switching with persistence
- **Responsive Design** - Mobile-first approach
- **Animations** - Smooth transitions and micro-interactions
- **Internationalization** - English and Malayalam support
- **Accessibility** - WCAG compliant with screen reader support

## 🎯 Key Components

### Admin Components
- **AdminLayout** - Main admin layout with sidebar
- **AdminSidebar** - Navigation sidebar for admin pages
- **DashboardStats** - Real-time statistics cards
- **ResumeManager** - Resume upload and management
- **BlogManager** - Blog post management with rich text editor
- **ProjectManager** - Project management with image upload
- **SkillManager** - Skills management with categories
- **TestimonialManager** - Testimonials management
- **ContactViewer** - Contact form submissions viewer

### Public Components
- **Hero** - Hero section with call-to-action
- **Navigation** - Responsive navigation with mobile menu
- **ThemeToggle** - Dark/light mode toggle
- **ResumeDownload** - Public resume download component
- **NewsletterSignup** - Newsletter subscription form

## 🌐 Internationalization

The app supports multiple languages:
- **English** (en) - Default language
- **Malayalam** (ml) - Regional language

Translation files are located in `src/locales/`:
- `en.json` - English translations
- `ml.json` - Malayalam translations

### Adding New Languages
1. Create a new translation file in `src/locales/`
2. Add the language to the i18n configuration in `src/i18n.js`
3. Update the language selector component

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with custom configuration:
- Custom color palette
- Responsive breakpoints
- Custom animations
- Dark mode support

### Custom CSS
- Global styles in `src/App.css`
- Component-specific styles using Tailwind classes
- Custom animations and transitions

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000/api
VITE_BASE_URL=http://localhost:5173
```

### Code Quality
- **ESLint** - Code linting with React-specific rules
- **Prettier** - Code formatting (configured via ESLint)
- **TypeScript** - Optional type checking (can be added)

## 📱 Responsive Design

The app is built with a mobile-first approach:
- **Mobile** (320px+) - Single column layouts
- **Tablet** (768px+) - Two column layouts
- **Desktop** (1024px+) - Multi-column layouts
- **Large Desktop** (1280px+) - Full-width layouts

## ♿ Accessibility

The app follows WCAG 2.1 guidelines:
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader** - ARIA labels and semantic HTML
- **Color Contrast** - High contrast ratios
- **Focus Management** - Clear focus indicators
- **Reduced Motion** - Respects user preferences

## 🎭 Animations

### Framer Motion
- **Page Transitions** - Smooth page-to-page transitions
- **Component Animations** - Entrance and exit animations
- **Hover Effects** - Interactive hover animations
- **Scroll Animations** - Scroll-triggered animations

### Custom Animations
- **Loading States** - Skeleton screens and spinners
- **Micro-interactions** - Button clicks and form interactions
- **Confetti Effects** - Celebration animations

## 🔧 Configuration

### Vite Configuration
- **React Plugin** - Fast refresh and HMR
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Build Optimization** - Production build optimization

### Tailwind Configuration
- **Custom Colors** - Brand color palette
- **Custom Animations** - Keyframe animations
- **Responsive Design** - Breakpoint configuration
- **Dark Mode** - Dark mode support

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting
- **AWS S3** - Static file hosting
- **Docker** - Containerized deployment

### Environment Setup
1. Set production API URL
2. Configure CORS settings
3. Set up CDN for static assets
4. Configure caching headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
