import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import { FaDownload, FaArrowRight, FaStar, FaCalendar, FaClock, FaExternalLinkAlt, FaGithub, FaEye, FaRocket, FaBrain, FaPen } from 'react-icons/fa';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Home = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testimonialsResponse, projectsResponse, blogsResponse, skillsResponse] = await Promise.all([
        api.get('/testimonials/'),
        api.get('/projects/'),
        api.get('/blogs/'),
        api.get('/skills/')
      ]);

      const testimonialsData = testimonialsResponse.data;
      const testimonialsArray = Array.isArray(testimonialsData)
        ? testimonialsData
        : testimonialsData.results || [];
      const projectsData = projectsResponse.data;
      console.log('projectsData:', projectsData);
      const projectsArray = Array.isArray(projectsData)
        ? projectsData
        : projectsData.results || [];
      const blogsData = blogsResponse.data;
      const blogsArray = Array.isArray(blogsData)
        ? blogsData
        : blogsData.results || [];
      const skillsData = skillsResponse.data;
      const skillsArray = Array.isArray(skillsData)
        ? skillsData
        : skillsData.results || [];

      setTestimonials(testimonialsArray);
      setFeaturedProjects(projectsArray.filter(project => project.featured).slice(0, 3));
      setRecentBlogs(blogsArray.filter(blog => blog.published).slice(0, 3));
      setSkills(skillsArray);
    } catch (error) {
      setTestimonials([]);
      setFeaturedProjects([]);
      setRecentBlogs([]);
      setSkills([]);
      setError('Error loading data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSkillIcon = (skillName) => {
    const iconMap = {
      'python': '🐍',
      'django': '⚡',
      'react': '⚛️',
      'tailwind': '🎨',
      'node.js': '🟢',
      'github': '🐙',
      'javascript': '📜',
      'html': '🌐',
      'css': '🎨',
      'sql': '🗄️',
      'postgresql': '🐘',
      'mongodb': '🍃',
      'docker': '🐳',
      'aws': '☁️',
      'git': '📝'
    };
    
    const lowerName = skillName.toLowerCase();
    return iconMap[lowerName] || '💻';
  };

  const getTimeToRead = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left: Intro */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex flex-col items-start justify-center gap-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Welcome to my portfolio
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {t('hero.greeting')} <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">{t('hero.name')}</span>
                <br />
                <span className="text-3xl sm:text-4xl lg:text-5xl">{t('hero.title')}</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md mx-auto lg:mx-0 justify-center items-center">
                <Link 
                  to="/projects" 
                  className="flex-1 text-center bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 transform hover:scale-105 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center gap-2"
                >
                  {t('projects.viewAll')}
                  <FaArrowRight className="w-5 h-5" />
                </Link>
                <motion.a
                  href="/resume.pdf"
                  download
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px 8px #6366f1' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="flex-1 text-center bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-2xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 relative overflow-hidden flex items-center justify-center gap-3"
                  onClick={e => {
                    confetti({
                      particleCount: 100,
                      spread: 80,
                      origin: { y: 0.6 },
                      colors: ['#6366f1', '#a5b4fc', '#818cf8', '#f472b6', '#facc15']
                    });
                  }}
                >
                  <FaDownload className="w-5 h-5" />
                  Download Resume
                </motion.a>
              </div>
            </motion.div>
            
            {/* Right: Profile Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 flex items-center justify-center mb-6 lg:mb-0"
            >
              <div className="relative">
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center relative">
                  <img
                    src="/src/assets/profile.png"
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full"></div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Tech <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Stack</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Technologies and tools I use to build amazing applications
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {skills.length > 0 ? (
            skills.slice(0, 6).map((skill, idx) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {skill.icon || getSkillIcon(skill.name)}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold text-center">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback tech stack if no skills are added
            [
              { name: 'Python', icon: '🐍' },
              { name: 'Django', icon: '⚡' },
              { name: 'React', icon: '⚛️' },
              { name: 'Tailwind', icon: '🎨' },
              { name: 'Node.js', icon: '🟢' },
              { name: 'GitHub', icon: '🐙' }
            ].map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/50 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {tech.icon}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-semibold text-center">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-12"
        >
                      <Link
              to="/skills"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-lg font-semibold transition-colors"
            >
              View All Skills
              <FaArrowRight className="w-5 h-5" />
            </Link>
        </motion.div>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Featured <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and creativity.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50"
              >
                {project.image_url && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                        Featured
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex gap-3">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white text-center py-2 px-4 rounded-xl hover:from-gray-900 hover:to-black dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <FaGithub className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.live_demo_link && (
                      <a
                        href={project.live_demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-12"
          >
                          <Link
                to="/projects"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                View All Projects
                <FaArrowRight className="w-5 h-5" />
              </Link>
          </motion.div>
        </div>
      )}

      {/* Recent Blog Posts */}
      {recentBlogs.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Latest <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Blog Posts</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Thoughts, insights, and experiences from my journey in software development.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {recentBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50"
              >
                {blog.image_url && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={blog.image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {blog.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaCalendar className="w-4 h-4" />
                      {formatDate(blog.created_at)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaClock className="w-4 h-4" />
                      {getTimeToRead(blog.content)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 120) + '...'}
                  </p>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors group-hover:gap-3"
                  >
                    Read More
                    <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-12"
          >
                          <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Read All Posts
                <FaArrowRight className="w-5 h-5" />
              </Link>
          </motion.div>
        </div>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              What People <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Say</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Testimonials from clients and colleagues I've had the pleasure of working with.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/50"
              >
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">
                      {testimonial.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {testimonial.name}
                    </h4>
                    {testimonial.position && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.position}
                      </p>
                    )}
                    {testimonial.company && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's work together to bring your ideas to life. I'm here to help you create something amazing.
          </p>
                      <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Today
              <FaArrowRight className="w-5 h-5" />
            </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 