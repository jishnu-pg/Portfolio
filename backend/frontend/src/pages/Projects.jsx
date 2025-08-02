import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Code, ExternalLink, Github, Star, Calendar, Eye, Zap } from 'lucide-react';
import api from '../utils/axios';

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Extract unique categories and tech stacks
  const categories = ['all', ...new Set(projects.map(project => project.category).filter(Boolean))];
  const allTechStacks = projects
    .flatMap(project => project.tech_stack ? project.tech_stack.split(',').map(tech => tech.trim()) : [])
    .filter(Boolean);
  const uniqueTechStacks = [...new Set(allTechStacks)];

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedCategory]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      const data = response.data;
      const projectsArray = Array.isArray(data) ? data : data.results || [];
      setProjects(projectsArray);
      setFilteredProjects(projectsArray);
    } catch (error) {
      setError('Error loading projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.tech_stack?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    setFilteredProjects(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const getProjectStatus = (project) => {
    if (project.featured) return 'featured';
    if (project.live_demo_link) return 'live';
    if (project.github_link) return 'github';
    return 'completed';
  };

  const getCategoryColor = (category) => {
    const colors = {
      web: 'from-blue-500 to-cyan-500',
      mobile: 'from-green-500 to-emerald-500',
      desktop: 'from-purple-500 to-pink-500',
      ai: 'from-orange-500 to-red-500',
      other: 'from-gray-500 to-slate-500'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      web: '🌐',
      mobile: '📱',
      desktop: '💻',
      ai: '🤖',
      other: '🛠️'
    };
    return icons[category] || icons.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Projects</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchProjects}
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 shadow-2xl">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              My <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Here are some of the projects I've worked on. Each one represents a unique challenge and learning experience.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects by title, description, or tech stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 font-medium"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 text-red-700 dark:text-red-300 rounded-xl hover:from-red-200 hover:to-red-300 dark:hover:from-red-800 dark:hover:to-red-700 transition-all duration-300 font-medium"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {filteredProjects.length} of {projects.length} projects
            </div>
          </div>

          {/* Category Filter */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* No Results Animation */}
      <AnimatePresence>
        {filteredProjects.length === 0 && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 dark:border-gray-700/50 max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No projects found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Projects */}
      {filteredProjects.filter(project => project.featured).length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProjects
                .filter(project => project.featured)
                .slice(0, 2)
                .map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/50"
                  >
                    {/* Project Image */}
                    {project.image_url && (
                      <div className="h-64 overflow-hidden relative">
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
                    
                    {/* Project Content */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {project.description}
                      </p>
                      
                      {/* Tech Stack */}
                      {project.tech_stack && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Tech Stack:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.split(',').slice(0, 6).map((tech, index) => (
                              <span
                                key={index}
                                className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-medium"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                            {project.tech_stack.split(',').length > 6 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{project.tech_stack.split(',').length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Project Links */}
                      <div className="flex gap-3">
                        {project.github_link && (
                          <a
                            href={project.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white text-center py-3 px-4 rounded-xl hover:from-gray-900 hover:to-black dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 flex items-center justify-center gap-2 font-medium transform hover:scale-105"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </a>
                        )}
                        {project.live_demo_link && (
                          <a
                            href={project.live_demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium transform hover:scale-105"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* All Projects */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
            <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {filteredProjects.filter(project => project.featured).length > 0 ? 'All Projects' : 'Recent Projects'}
          </h2>
          
          {filteredProjects.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/50 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Project Image */}
                    {project.image_url && (
                      <div className={`overflow-hidden relative ${viewMode === 'list' ? 'w-64 h-48' : 'h-48'}`}>
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {project.featured && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Project Content */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      {/* Tech Stack */}
                      {project.tech_stack && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Tech Stack:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.split(',').slice(0, 4).map((tech, index) => (
                              <span
                                key={index}
                                className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-medium"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                            {project.tech_stack.split(',').length > 4 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{project.tech_stack.split(',').length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Project Links */}
                      <div className="flex gap-2">
                        {project.github_link && (
                          <a
                            href={project.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white text-center py-2 px-3 rounded-lg hover:from-gray-900 hover:to-black dark:hover:from-gray-800 dark:hover:to-gray-900 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <Github className="w-4 h-4" />
                            GitHub
                          </a>
                        )}
                        {project.live_demo_link && (
                          <a
                            href={project.live_demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 dark:border-gray-700/50 max-w-md mx-auto">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  No projects yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Projects will appear here once they're added through the admin panel.
                </p>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
};

export default Projects; 