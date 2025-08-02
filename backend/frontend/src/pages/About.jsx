import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/axios';

const About = () => {
  const { t } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsResponse, experienceResponse] = await Promise.all([
        api.get('/skills/'),
        api.get('/experience/')
      ]);

      const skillsData = skillsResponse.data;
      const experienceData = experienceResponse.data;
      const skillsArray = Array.isArray(skillsData)
        ? skillsData
        : skillsData.results || [];
      setSkills(skillsArray);
      const experienceArray = Array.isArray(experienceData)
        ? experienceData
        : experienceData.results || [];
      setExperience(experienceArray);
    } catch (error) {
      setSkills([]);
      setExperience([]);
      setError('Error loading data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      frontend: 'from-blue-500 to-cyan-500',
      backend: 'from-green-500 to-emerald-500',
      database: 'from-purple-500 to-pink-500',
      devops: 'from-orange-500 to-red-500',
      other: 'from-gray-500 to-slate-500'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      frontend: '🎨',
      backend: '⚙️',
      database: '🗄️',
      devops: '🚀',
      other: '🛠️'
    };
    return icons[category] || icons.other;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Database',
      devops: 'DevOps',
      other: 'Other'
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
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
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-8 shadow-2xl">
              <img 
                src="/src/assets/profile.png" 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Me</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              I'm a passionate software developer with expertise in modern web technologies. 
              I love building scalable applications and solving complex problems with innovative solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex justify-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {['about', 'skills', 'experience'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Education</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  I'm constantly learning and staying up-to-date with the latest technologies and best practices in software development. 
                  My educational journey is marked by continuous growth and adaptation to emerging trends in the tech industry.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Interests</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, 
                  and sharing knowledge with the developer community. I'm passionate about creating meaningful solutions.
                </p>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">My Approach</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💡</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Innovation</h4>
                  <p className="text-gray-600 dark:text-gray-400">Creative problem-solving with cutting-edge solutions</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">⚡</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Performance</h4>
                  <p className="text-gray-600 dark:text-gray-400">Optimized code that delivers exceptional user experiences</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Collaboration</h4>
                  <p className="text-gray-600 dark:text-gray-400">Working effectively in teams to achieve common goals</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            {skills.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {['frontend', 'backend', 'database', 'devops', 'other'].map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category);
                  if (categorySkills.length === 0) return null;

                  return (
                    <div key={category} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
                      <div className="flex items-center mb-6">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(category)} rounded-xl flex items-center justify-center mr-4`}>
                          <span className="text-2xl">{getCategoryIcon(category)}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{getCategoryLabel(category)}</h3>
                      </div>
                      <div className="space-y-6">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                {skill.icon && (
                                  <span className="text-xl">{skill.icon}</span>
                                )}
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{skill.name}</span>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{skill.proficiency}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <div 
                                className={`h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${getCategoryColor(category)}`}
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20 dark:border-gray-700/50">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No skills added yet</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Skills will appear here once they're added through the admin panel.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            {experience.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                
                <div className="space-y-8">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                      
                      <div className="ml-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">{exp.company}</p>
                            {exp.location && (
                              <p className="text-gray-600 dark:text-gray-400 flex items-center mt-1">
                                <span className="mr-2">📍</span> {exp.location}
                              </p>
                            )}
                          </div>
                          {exp.current && (
                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-4 py-2 rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">
                          {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                        </div>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        
                        {exp.technologies && exp.technologies.trim() && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Technologies:</h4>
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.split(',').map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 text-sm px-3 py-1 rounded-full font-medium"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-xl border border-white/20 dark:border-gray-700/50">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-6">💼</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">No experience added yet</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Work experience will appear here once it's added through the admin panel.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">Let's Work Together</h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            I'm always interested in new opportunities and exciting projects. Let's create something amazing together!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="mr-2">Get In Touch</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 