# 🚀 Jishnu's Portfolio - Full-Stack Developer Portfolio

A modern, responsive portfolio website built with React frontend and Django backend, featuring a comprehensive admin dashboard with full CRUD functionality, dynamic analytics, and advanced user experience features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Admin Features](#admin-features)
- [Advanced Features](#advanced-features)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This portfolio showcases my skills, projects, and experience as a full-stack developer. The application features a modern React frontend with a Django REST API backend, complete with an advanced admin dashboard for content management and dynamic analytics.

### Key Highlights:
- **Modern UI/UX**: Clean, responsive design with dark mode support and smooth animations
- **Dynamic Admin Dashboard**: Real-time analytics, interactive charts, and comprehensive content management
- **Advanced Search & Filtering**: Real-time search functionality across projects and blogs
- **Interactive Skills Page**: Animated progress bars and tag cloud visualization
- **Resume Management**: Upload, manage, and download resume files with version control
- **Full CRUD Operations**: Complete content management through React admin interface
- **Real-time Updates**: Dynamic content loading and updates with auto-refresh
- **Secure Authentication**: JWT-based authentication for admin access
- **Performance Optimized**: Fast loading times and efficient data handling
- **Multi-language Support**: English and Malayalam localization
- **Accessibility First**: WCAG compliant with screen reader support

## ✨ Features

### 🌐 Frontend Features

#### **Public Pages**
- **Home Page**: Hero section with introduction and call-to-action
- **About Page**: Personal information, skills, experience timeline, and resume download
- **Projects Page**: Showcase of portfolio projects with advanced filtering and real-time search
- **Blog Page**: Technical articles and insights with rich content display and search functionality
- **Skills Page**: Interactive skills showcase with animated progress bars and category filtering
- **Contact Page**: Contact form with real-time validation and submission

#### **Resume Management**
- **Resume Upload**: Admin can upload multiple resume versions (PDF, DOC, DOCX)
- **Version Control**: Track different resume versions with descriptions and timestamps
- **Active Resume**: Set one resume as active for public download
- **File Validation**: Automatic file type and size validation (max 5MB)
- **Public Download**: Visitors can download the active resume from the About page
- **File Information**: Display file size, format, and last updated date

#### **Advanced Search & Filtering**
- **Real-time Search**: Instant filtering as you type across projects and blogs
- **Multi-field Search**: Search by title, description, tags, tech stack, and content
- **Category Filters**: Filter by project categories, blog tags, and skill categories
- **No Results Animation**: Beautiful fallback UI when no search results are found
- **Search History**: Persistent search state across page navigation

#### **Interactive Skills Page**
- **Animated Progress Bars**: Circular progress indicators with smooth animations
- **Tag Cloud Visualization**: Dynamic skill tags with hover effects
- **Category Filtering**: Filter skills by frontend, backend, database, tools, etc.
- **Scroll-triggered Animations**: Skills animate into view as you scroll
- **Responsive Layout**: Adapts beautifully to all screen sizes

#### **Responsive Design**
- **Mobile-First Approach**: Optimized for all screen sizes from 320px to 4K+
- **Responsive Navigation**: Hamburger menu for mobile with slide-out navigation
- **Adaptive Layouts**: Grid systems that adapt from 1 column (mobile) to 3 columns (desktop)
- **Touch-Friendly Interface**: Minimum 44px touch targets for mobile devices
- **Responsive Typography**: Scalable text sizes across all breakpoints
- **Flexible Spacing**: Adaptive padding and margins for different screen sizes

#### **Localization & Accessibility**
- **Multi-language Support**: English and Malayalam language toggle
- **Internationalization**: React-i18next integration for seamless language switching
- **Accessibility Features**: 
  - Skip to content links
  - Screen reader support
  - Keyboard navigation
  - High contrast mode support
  - Reduced motion support
  - ARIA labels and semantic HTML

#### **Dynamic Admin Dashboard**
- **Real-time Analytics**: Live statistics and metrics from your actual data
- **Interactive Charts**: Multiple chart types (Area, Line, Bar, Pie) with dynamic data
- **Auto-refresh**: Dashboard updates automatically every 5 minutes
- **Date Range Filtering**: Filter analytics by 7, 30, 90 days, or 1 year
- **Growth Calculations**: Automatic percentage growth calculations for all metrics
- **Recent Activity Timeline**: Real-time feed of recent content changes
- **Quick Actions**: Direct access to add projects, write blogs, manage skills
- **Clickable Statistics**: Navigate directly to content sections from stat cards
- **Professional UI**: Enterprise-level dashboard with glassmorphism design

### 🔧 Backend Features

#### **API Endpoints**
- **RESTful API**: Complete CRUD operations for all models
- **Authentication**: JWT token-based authentication with refresh tokens
- **File Upload**: Image upload support for projects and blog posts
- **Resume Management**: File upload, download, and version control for resumes
- **Data Validation**: Comprehensive input validation and error handling
- **CORS Support**: Cross-origin resource sharing enabled
- **Rate Limiting**: API rate limiting for security

#### **Database Models**
- **Projects**: Portfolio projects with images, technologies, and links
- **Blog Posts**: Articles with content, tags, and publishing status
- **Skills**: Technical skills with proficiency levels and categories
- **Experience**: Work history with detailed descriptions
- **Testimonials**: Client feedback with ratings and approval status
- **Contact Messages**: Incoming contact form submissions
- **Resumes**: Resume files with version control and metadata

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Fast build tool and development server
- **React-i18next**: Internationalization and localization
- **Framer Motion**: Advanced animations and transitions
- **Recharts**: Interactive charts and data visualization
- **Lucide React**: Beautiful icon library
- **React Intersection Observer**: Scroll-triggered animations
- **Axios**: HTTP client for API requests

### Backend
- **Django 5.2**: Python web framework
- **Django REST Framework**: API development toolkit
- **Django CORS Headers**: Cross-origin resource sharing
- **Simple JWT**: JSON Web Token authentication
- **Pillow**: Image processing for file uploads
- **SQLite**: Lightweight database (can be upgraded to PostgreSQL)

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Git**: Version control
- **Virtual Environment**: Python dependency isolation

## 📁 Project Structure

```
portfolio/
├── backend/                 # Django backend
│   ├── api/                # Main Django app
│   │   ├── models.py       # Database models
│   │   ├── serializers.py  # API serializers
│   │   ├── views.py        # API views
│   │   └── urls.py         # API URL patterns
│   ├── portfolio_backend/  # Django project settings
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies (comprehensive)
│   ├── requirements-minimal.txt  # Essential dependencies only
│   ├── requirements-dev.txt      # Development tools
│   └── requirements-prod.txt     # Production-ready
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── BlogManager.jsx
│   │   │   │   ├── ContactViewer.jsx
│   │   │   │   ├── DashboardStats.jsx
│   │   │   │   ├── ExperienceManager.jsx
│   │   │   │   ├── ProjectManager.jsx
│   │   │   │   ├── ResumeManager.jsx
│   │   │   │   ├── SkillManager.jsx
│   │   │   │   └── TestimonialManager.jsx
│   │   │   ├── Accessibility.jsx
│   │   │   ├── ErrorTest.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── NewsletterSignup.jsx
│   │   │   ├── ResumeDownload.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/        # React context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Skills.jsx
│   │   ├── utils/          # Utility functions
│   │   │   ├── auth.js     # Authentication utilities
│   │   │   └── axios.js    # HTTP client configuration
│   │   ├── locales/        # Translation files
│   │   │   ├── en.json     # English translations
│   │   │   └── ml.json     # Malayalam translations
│   │   ├── App.css         # Global styles
│   │   ├── App.jsx         # Main app component
│   │   ├── i18n.js         # Internationalization setup
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static assets
│   │   ├── favicon.ico     # Favicon
│   │   ├── favicon.svg     # SVG favicon
│   │   └── favicon.png     # PNG favicon
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── README.md           # Frontend documentation
└── README.md              # Main project documentation
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Requirements Files
The backend includes multiple requirements files for different use cases:

- **`requirements-minimal.txt`** - Essential dependencies only (recommended for basic setup)
- **`requirements-dev.txt`** - Development tools, testing, and code quality tools
- **`requirements-prod.txt`** - Production-ready with additional security and performance packages
- **`requirements.txt`** - Comprehensive list with all dependencies and comments

### Latest Updates
- **Enhanced Requirements**: Updated all requirements files with latest package versions
- **Development Tools**: Added comprehensive development tooling (linting, testing, formatting)
- **Production Security**: Enhanced production requirements with security and monitoring tools
- **Performance Optimization**: Added caching and compression tools for production

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   
   **For basic setup (recommended):**
   ```bash
   pip install -r requirements-minimal.txt
   ```
   
   **For development with additional tools:**
   ```bash
   pip install -r requirements-dev.txt
   ```
   
   **For production deployment:**
   ```bash
   pip install -r requirements-prod.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (admin)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Configuration

Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 📖 Usage

### Public Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

### Admin Access
1. Navigate to http://localhost:5173/admin/login
2. Use your superuser credentials to log in
3. Access the dynamic admin dashboard for content management

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/token/` - Login and get JWT token
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Content Endpoints
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create new project
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

- `GET /api/blogs/` - List all blog posts
- `POST /api/blogs/` - Create new blog post
- `PUT /api/blogs/{id}/` - Update blog post
- `DELETE /api/blogs/{id}/` - Delete blog post

- `GET /api/skills/` - List all skills
- `POST /api/skills/` - Create new skill
- `PUT /api/skills/{id}/` - Update skill
- `DELETE /api/skills/{id}/` - Delete skill

- `GET /api/experience/` - List all experience entries
- `GET /api/testimonials/` - List all testimonials
- `GET /api/contacts/` - List all contact messages

### Resume Endpoints
- `GET /api/resumes/` - List all resumes
- `POST /api/resumes/` - Upload new resume
- `PUT /api/resumes/{id}/` - Update resume
- `DELETE /api/resumes/{id}/` - Delete resume
- `GET /api/resumes/active/` - Get active resume
- `GET /api/resumes/{id}/download/` - Download specific resume
- `GET /api/resumes/download_active/` - Download active resume

## 🎛️ Admin Features

### Dynamic Admin Dashboard
- **Real-time Statistics**: Live counts of projects, blogs, skills, experience, testimonials, and contacts
- **Interactive Charts**: 
  - Visitor analytics with area, line, and bar chart options
  - Blog categories pie chart
  - Project technologies bar chart
  - Monthly growth trends
- **Recent Activity Feed**: Timeline of recent content changes
- **Quick Actions**: Direct access to add content and manage sections
- **Auto-refresh**: Dashboard updates automatically every 5 minutes
- **Date Range Filtering**: Filter analytics by different time periods
- **Growth Calculations**: Automatic percentage growth indicators

### Content Management
- **Full CRUD Operations**: Create, read, update, and delete all content types
- **Image Upload**: Drag-and-drop image upload for projects and blog posts
- **Rich Text Editing**: WYSIWYG editor for blog content
- **Bulk Operations**: Select and manage multiple items at once
- **Search and Filter**: Find content quickly with search and filtering
- **Real-time Updates**: Changes appear instantly without page refresh

### Resume Management
- **File Upload**: Upload PDF, DOC, and DOCX resume files
- **Version Control**: Track multiple resume versions with descriptions
- **Active Resume**: Set one resume as the active version for public download
- **File Validation**: Automatic validation of file type and size
- **Metadata Management**: Add titles, descriptions, and version numbers
- **Download Management**: Preview and download resume files
- **File Information**: Display file size, format, and timestamps

## 🚀 Advanced Features

### Real-time Search & Filtering
- **Instant Search**: Search across projects and blogs as you type
- **Multi-field Search**: Search by title, description, content, tags, and tech stack
- **Category Filters**: Filter by project categories, blog tags, and skill categories
- **No Results UI**: Beautiful animations when no search results are found
- **Search Persistence**: Search state maintained across navigation

### Interactive Skills Page
- **Animated Progress Bars**: Circular progress indicators with smooth animations
- **Tag Cloud**: Dynamic skill tags with hover effects and animations
- **Category Filtering**: Filter skills by frontend, backend, database, tools, etc.
- **Scroll Animations**: Skills animate into view as you scroll down
- **Responsive Design**: Adapts beautifully to all screen sizes

### Resume System
- **Professional Resume Management**: Upload and manage multiple resume versions
- **Public Download**: Visitors can easily download your latest resume
- **Version Control**: Keep track of different resume versions and updates
- **File Security**: Secure file storage with proper access controls
- **User Experience**: Clean, professional download interface

### Enhanced User Experience
- **Smooth Animations**: Framer Motion animations throughout the application
- **Loading States**: Beautiful loading animations and skeleton screens
- **Error Handling**: Graceful error handling with user-friendly messages
- **Performance Optimized**: Fast loading times and efficient data handling
- **Accessibility**: WCAG compliant with screen reader support

### Multi-language Support
- **English & Malayalam**: Complete localization for both languages
- **Dynamic Translation**: All UI elements and content support both languages
- **Language Persistence**: User's language preference is remembered
- **RTL Support**: Ready for right-to-left language support

### Latest UI/UX Improvements
- **Modern Design**: Redesigned pages with glassmorphism and gradient effects
- **Transparent Buttons**: Updated button styling with transparent backgrounds
- **Enhanced Animations**: Improved hover effects and micro-interactions
- **Better Typography**: Enhanced text hierarchy and readability
- **Improved Accessibility**: Better contrast ratios and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Django Team** for the robust backend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for the smooth animations
- **Recharts** for the beautiful charts and data visualization
- **Lucide React** for the beautiful icons

---

**Built with ❤️ by Jishnu** - A passionate full-stack developer creating amazing digital experiences. 