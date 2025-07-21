import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Code, Database, Server, Palette, Wrench, 
  Zap, Target, TrendingUp, Star, Award
} from 'lucide-react';
import api from '../utils/axios';

const Skills = () => {
  const { t } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Skill categories with icons and colors
  const categories = [
    { id: 'all', name: t('skills.all'), icon: Star, color: 'from-purple-500 to-pink-500' },
    { id: 'frontend', name: t('skills.frontend'), icon: Palette, color: 'from-blue-500 to-cyan-500' },
    { id: 'backend', name: t('skills.backend'), icon: Server, color: 'from-green-500 to-emerald-500' },
    { id: 'database', name: t('skills.database'), icon: Database, color: 'from-orange-500 to-red-500' },
    { id: 'devops', name: t('skills.devops'), icon: Wrench, color: 'from-indigo-500 to-purple-500' },
    { id: 'tools', name: t('skills.tools'), icon: Zap, color: 'from-yellow-500 to-orange-500' }
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
        className="relative group"
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
            <div className="text-2xl mb-1">{skill.icon}</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
              {isNaN(skill.level) ? '0' : skill.level}%
            </div>
          </div>
        </div>
        
        {/* Skill name */}
        <div className="text-center mt-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {skill.name}
          </h3>
        </div>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.05 }}
        />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              {t('skills.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('skills.description')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                <category.icon className="w-5 h-5 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Circular Progress Bars View */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredSkills.map((skill, index) => (
                  <CircularProgress key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Tag Cloud View */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
                  {t('skills.tagCloud')}
                </h2>
                <TagCloud skills={filteredSkills} />
              </div>
            </motion.div>
          </>
        )}

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Target, title: t('skills.totalSkills'), value: skills.length, color: 'from-blue-500 to-blue-600' },
            { icon: TrendingUp, title: t('skills.avgProficiency'), value: Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length), color: 'from-green-500 to-green-600' },
            { icon: Award, title: t('skills.categories'), value: categories.length - 1, color: 'from-purple-500 to-purple-600' }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
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