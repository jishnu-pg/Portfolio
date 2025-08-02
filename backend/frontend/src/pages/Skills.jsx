import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Code, Database, Server, Palette, Wrench, 
  Zap, Target, TrendingUp, Star, Award, Brain, Rocket, Sparkles
} from 'lucide-react';
import api from '../utils/axios';

const Skills = () => {
  const { t } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('circular'); // 'circular' or 'bars'
  const [error, setError] = useState(null);

  // Skill categories with icons and colors
  const categories = [
    { id: 'all', name: t('skills.all'), icon: Star, color: 'from-purple-500 to-pink-500', emoji: '⭐' },
    { id: 'frontend', name: t('skills.frontend'), icon: Palette, color: 'from-blue-500 to-cyan-500', emoji: '🎨' },
    { id: 'backend', name: t('skills.backend'), icon: Server, color: 'from-green-500 to-emerald-500', emoji: '⚙️' },
    { id: 'database', name: t('skills.database'), icon: Database, color: 'from-orange-500 to-red-500', emoji: '🗄️' },
    { id: 'devops', name: t('skills.devops'), icon: Wrench, color: 'from-indigo-500 to-purple-500', emoji: '🚀' },
    { id: 'tools', name: t('skills.tools'), icon: Zap, color: 'from-yellow-500 to-orange-500', emoji: '🛠️' }
  ];

  // Mock skills data (replace with API call)
  const mockSkills = [
    // Frontend
    { name: 'React', level: 90, category: 'frontend', icon: '⚛️', color: '#61DAFB' },
    { name: 'JavaScript', level: 95, category: 'frontend', icon: '🟨', color: '#F7DF1E' },
    { name: 'TypeScript', level: 85, category: 'frontend', icon: '🔷', color: '#3178C6' },
    { name: 'HTML/CSS', level: 95, category: 'frontend', icon: '🎨', color: '#E34F26' },
    { name: 'Tailwind CSS', level: 90, category: 'frontend', icon: '💨', color: '#06B6D4' },
    { name: 'Next.js', level: 80, category: 'frontend', icon: '⚡', color: '#000000' },
    { name: 'Vue.js', level: 75, category: 'frontend', icon: '🟢', color: '#4FC08D' },
    
    // Backend
    { name: 'Python', level: 92, category: 'backend', icon: '🐍', color: '#3776AB' },
    { name: 'Django', level: 88, category: 'backend', icon: '🎯', color: '#092E20' },
    { name: 'Node.js', level: 85, category: 'backend', icon: '🟢', color: '#339933' },
    { name: 'Express.js', level: 80, category: 'backend', icon: '🚂', color: '#000000' },
    { name: 'FastAPI', level: 75, category: 'backend', icon: '⚡', color: '#059669' },
    { name: 'REST APIs', level: 90, category: 'backend', icon: '🔗', color: '#3B82F6' },
    
    // Database
    { name: 'PostgreSQL', level: 85, category: 'database', icon: '🐘', color: '#336791' },
    { name: 'MongoDB', level: 80, category: 'database', icon: '🍃', color: '#47A248' },
    { name: 'Redis', level: 75, category: 'database', icon: '🔴', color: '#DC382D' },
    { name: 'SQLite', level: 90, category: 'database', icon: '💎', color: '#003B57' },
    
    // DevOps
    { name: 'Docker', level: 80, category: 'devops', icon: '🐳', color: '#2496ED' },
    { name: 'Git', level: 90, category: 'devops', icon: '📝', color: '#F05032' },
    { name: 'AWS', level: 70, category: 'devops', icon: '☁️', color: '#FF9900' },
    { name: 'CI/CD', level: 75, category: 'devops', icon: '🔄', color: '#FF6B6B' },
    
    // Tools
    { name: 'VS Code', level: 95, category: 'tools', icon: '💻', color: '#007ACC' },
    { name: 'Figma', level: 70, category: 'tools', icon: '🎨', color: '#F24E1E' },
    { name: 'Postman', level: 85, category: 'tools', icon: '📮', color: '#FF6C37' },
    { name: 'Jira', level: 75, category: 'tools', icon: '📋', color: '#0052CC' }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/skills/');
      // Transform API data to match our format
      const data = response.data;
      const skillsArray = Array.isArray(data) ? data : data.results || [];
      const transformedSkills = skillsArray.map(skill => ({
        name: skill.name,
        level: typeof skill.proficiency_level === 'number' ? skill.proficiency_level : 80,
        category: skill.category?.toLowerCase() || 'tools',
        icon: '\ud83c\udfaf',
        color: getRandomColor()
      }));
      setSkills(transformedSkills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setError('Error loading skills');
      setSkills(mockSkills);
    } finally {
      setLoading(false);
    }
  };

  const getRandomColor = () => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const CircularProgress = ({ skill, index }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progress = inView ? skill.level : 0;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      >
        <div className="relative w-40 h-40 mx-auto">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="transparent"
              className="dark:stroke-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke={skill.color}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl mb-2">{skill.icon}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
              {isNaN(skill.level) ? '0' : skill.level}%
            </div>
          </div>
        </div>
        
        {/* Skill name */}
        <div className="text-center mt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {skill.name}
          </h3>
        </div>
      </motion.div>
    );
  };

  const ProgressBar = ({ skill, index }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{skill.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {skill.name}
            </h3>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {isNaN(skill.level) ? '0' : skill.level}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              backgroundColor: skill.color,
              width: inView ? `${skill.level}%` : '0%'
            }}
          />
        </div>
      </motion.div>
    );
  };

  const TagCloud = ({ skills }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 p-8"
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="relative group"
          >
            <div
              className="px-4 py-2 rounded-full text-white font-medium shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
              style={{ 
                backgroundColor: skill.color,
                fontSize: `${Math.max(14, skill.level / 5)}px`
              }}
            >
              <span className="mr-2">{skill.icon}</span>
              {skill.name}
            </div>
            <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {isNaN(skill.level) ? '0' : skill.level}%
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Skills</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchSkills}
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
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              My <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Skills</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A comprehensive showcase of my technical expertise and proficiency levels across various technologies and tools.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories:</span>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="mr-2">{category.emoji}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('circular')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'circular'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('bars')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'bars'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skills Display */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {filteredSkills.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {viewMode === 'circular' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredSkills.map((skill, index) => (
                  <CircularProgress key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSkills.map((skill, index) => (
                  <ProgressBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20 dark:border-gray-700/50 max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                No skills found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try selecting a different category or skills will appear here once they're added.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tag Cloud Section */}
      {filteredSkills.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50"
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8 flex items-center justify-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-500" />
                Skills Tag Cloud
              </h2>
              <TagCloud skills={filteredSkills} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Skills Summary */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Target, title: 'Total Skills', value: skills.length, color: 'from-blue-500 to-blue-600', emoji: '🎯' },
            { icon: TrendingUp, title: 'Avg Proficiency', value: Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length), color: 'from-green-500 to-green-600', emoji: '📈' },
            { icon: Award, title: 'Categories', value: categories.length - 1, color: 'from-purple-500 to-purple-600', emoji: '🏆' }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} mr-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Skills; 