import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/axios';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main id="main-content" className="max-w-6xl mx-auto px-4 md:px-10">
        {/* Hero Section */}
        <section className="flex flex-col-reverse lg:flex-row items-center justify-between py-12 sm:py-16 lg:py-20 gap-8 lg:gap-10">
          {/* Left: Intro */}
          <div className="flex-1 flex flex-col items-start justify-center gap-4 sm:gap-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 leading-tight sm:leading-relaxed mb-2">
              {t('hero.greeting')} <span className="text-blue-600 dark:text-blue-400">{t('hero.name')}</span>
              <br />
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 w-full max-w-md mx-auto lg:mx-0">
              <Link 
                to="/projects" 
                className="flex-1 text-center bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {t('projects.viewAll')}
              </Link>
              <a 
                href="/resume.pdf" 
                download 
                className="flex-1 text-center bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-3 rounded-lg shadow-lg hover:bg-gray-50 transition font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {t('hero.downloadResume')}
              </a>
            </div>
          </div>
          
          {/* Right: Profile Image */}
          <div className="flex-1 flex items-center justify-center mb-6 lg:mb-0">
            <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-lg border-4 border-blue-100 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <img
                src="/src/assets/profile.png"
                alt="Jishnu Profile"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-8 sm:py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-100">Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {skills.length > 0 ? (
              skills.slice(0, 6).map((skill, idx) => (
                <div
                  key={skill.id}
                  className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:scale-105 hover:shadow-xl transition-transform cursor-pointer"
                >
                  <span className="text-3xl">{skill.icon || getSkillIcon(skill.name)}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-1">{skill.name}</span>
                </div>
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
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:scale-105 hover:shadow-xl transition-transform cursor-pointer"
                >
                  <span className="text-3xl">{tech.icon}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-1">{tech.name}</span>
                </div>
              ))
            )}
          </div>
          <a
            href="#about"
            className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline text-lg font-semibold animate-bounce transition"
          >
            {t('hero.scrollToAbout')}
          </a>
        </section>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="py-12 sm:py-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Featured Projects</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Here are some of my recent projects that showcase my skills and creativity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {project.image_url && (
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h3>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base">{project.description}</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-800 text-white text-center py-2 px-4 rounded-md hover:bg-gray-900 transition-colors text-sm"
                        >
                          GitHub
                        </a>
                      )}
                      {project.live_demo_link && (
                        <a
                          href={project.live_demo_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                to="/projects"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                View All Projects
              </Link>
            </div>
          </section>
        )}

        {/* Recent Blog Posts */}
        {recentBlogs.length > 0 && (
          <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Latest Blog Posts</h2>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                Thoughts, insights, and experiences from my journey in software development.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {recentBlogs.map((blog) => (
                <div key={blog.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {blog.image_url && (
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                      {blog.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(blog.created_at)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">{blog.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt || blog.content.substring(0, 120) + '...'}
                    </p>
                    <Link
                      to="/blog"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                to="/blog"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Read All Posts
              </Link>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What People Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Testimonials from clients and colleagues I've had the pleasure of working with.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 text-2xl">★★★★★</div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-semibold text-lg">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      {testimonial.position && (
                        <p className="text-gray-600 text-sm">{testimonial.position}</p>
                      )}
                      {testimonial.company && (
                        <p className="text-gray-600 text-sm">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's work together to bring your ideas to life. I'm here to help you create something amazing.
            </p>
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 