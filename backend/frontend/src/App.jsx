import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Skills from './pages/Skills';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminSidebar from './components/admin/AdminSidebar';
import ProjectManager from './components/admin/ProjectManager';
import BlogManager from './components/admin/BlogManager';
import SkillManager from './components/admin/SkillManager';
import ExperienceManager from './components/admin/ExperienceManager';
import ContactViewer from './components/admin/ContactViewer';
import TestimonialManager from './components/admin/TestimonialManager';
import ResumeManager from './components/admin/ResumeManager';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { handleLogout } from './utils/auth';
import ErrorTest from './components/ErrorTest';
import { ThemeProvider } from './context/ThemeContext';
import Accessibility from './components/Accessibility';
import './i18n';

export default function App() {
  const handleLogoutClick = () => {
    handleLogout();
  };

  return (
    <ThemeProvider>
      <Router>
        <Accessibility />
        <Routes>
        {/* Admin login route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin routes with sidebar */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <>
              <AdminSidebar onLogout={handleLogoutClick} />
              <div className="ml-64">
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/projects" element={<ProjectManager />} />
                  <Route path="/blogs" element={<BlogManager />} />
                  <Route path="/skills" element={<SkillManager />} />
                  <Route path="/experience" element={<ExperienceManager />} />
                  <Route path="/messages" element={<ContactViewer />} />
                  <Route path="/testimonials" element={<TestimonialManager />} />
                  <Route path="/resumes" element={<ResumeManager />} />
                </Routes>
              </div>
            </>
          </ProtectedRoute>
        } />
        
        {/* Public routes with navbar */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/test-errors" element={<ErrorTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}
