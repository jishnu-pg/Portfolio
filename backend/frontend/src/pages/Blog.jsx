import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, BookOpen, Calendar, Tag, PenTool, Eye, Clock, User } from 'lucide-react';
import api from '../utils/axios';

const Blog = () => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Extract unique categories from blogs
  const categories = ['all', ...new Set(blogs.map(blog => blog.category).filter(Boolean))];

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs/');
      // Filter to only show published blogs
      const data = response.data;
      const publishedBlogs = data.filter(blog => blog.published);
      setBlogs(publishedBlogs);
      setFilteredBlogs(publishedBlogs);
    } catch (error) {
      setError('Error loading blog posts');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.excerpt?.toLowerCase().includes(searchLower) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    setFilteredBlogs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeToRead = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'from-blue-500 to-cyan-500',
      development: 'from-green-500 to-emerald-500',
      design: 'from-purple-500 to-pink-500',
      tutorial: 'from-orange-500 to-red-500',
      other: 'from-gray-500 to-slate-500'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      technology: '💻',
      development: '⚙️',
      design: '🎨',
      tutorial: '📚',
      other: '📝'
    };
    return icons[category] || icons.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Blog</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchBlogs}
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
              <PenTool className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              My <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Thoughts, insights, and experiences from my journey in software development and technology.
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
              placeholder="Search blog posts by title, content, or tags..."
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
              {filteredBlogs.length} of {blogs.length} posts
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
        {filteredBlogs.length === 0 && blogs.length > 0 && (
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
                No posts found
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

      {/* Featured Posts */}
      {filteredBlogs.filter(blog => blog.featured).length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Featured Posts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredBlogs
                .filter(blog => blog.featured)
                .slice(0, 2)
                .map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/50"
                  >
                    {blog.image_url && (
                      <div className="h-64 overflow-hidden relative">
                        <img
                          src={blog.image_url}
                          alt={blog.title}
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
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDate(blog.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {getTimeToRead(blog.content)}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {blog.excerpt || truncateText(blog.content, 200)}
                      </p>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {blog.tags.slice(0, 4).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors flex items-center gap-2 group-hover:gap-3">
                        Read More
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* All Posts */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            {filteredBlogs.filter(blog => blog.featured).length > 0 ? 'All Posts' : 'Recent Posts'}
          </h2>
          
          {filteredBlogs.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              <AnimatePresence>
                {filteredBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 dark:border-gray-700/50 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {blog.image_url && (
                      <div className={`overflow-hidden relative ${viewMode === 'list' ? 'w-64 h-48' : 'h-48'}`}>
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
                    
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDate(blog.created_at)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {getTimeToRead(blog.content)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {blog.excerpt || truncateText(blog.content, 120)}
                      </p>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full font-medium"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors flex items-center gap-2 group-hover:gap-3">
                        Read More
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 dark:border-gray-700/50 max-w-md mx-auto">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  No blog posts yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Blog posts will appear here once they're published through the admin panel.
                </p>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* Newsletter Signup */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h3 className="text-3xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Get notified when I publish new articles about software development, best practices, and industry insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 font-medium"
            />
            <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog; 