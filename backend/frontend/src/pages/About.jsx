import React, { useState, useEffect } from 'react';
import ResumeDownload from '../components/ResumeDownload';
import api from '../utils/axios';

const About = () => {
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      frontend: 'bg-blue-100 text-blue-800',
      backend: 'bg-green-100 text-green-800',
      database: 'bg-purple-100 text-purple-800',
      devops: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">About Me</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            I'm a passionate software developer with expertise in modern web technologies. 
            I love building scalable applications and solving complex problems.
          </p>
        </div>

        {/* Resume Download Section */}
        <div className="mb-8 sm:mb-12">
          <ResumeDownload />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Skills Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Skills & Technologies</h2>
            
            {skills.length > 0 ? (
              <div className="space-y-6">
                {['frontend', 'backend', 'database', 'devops', 'other'].map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category);
                  if (categorySkills.length === 0) return null;

                  return (
                    <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h3 className={`text-lg font-semibold mb-4 inline-block px-3 py-1 rounded-full text-sm ${getCategoryColor(category)}`}>
                        {getCategoryLabel(category)}
                      </h3>
                      <div className="space-y-4">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                {skill.icon && (
                                  <span className="text-lg">{skill.icon}</span>
                                )}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{skill.name}</span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{skill.proficiency}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No skills added yet</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Skills will appear here once they're added through the admin panel.
                </p>
              </div>
            )}
          </div>

          {/* Experience Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Work Experience</h2>
            
            {experience.length > 0 ? (
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500 dark:border-blue-400">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                        <p className="text-lg text-gray-700 dark:text-gray-300">{exp.company}</p>
                        {exp.location && (
                          <p className="text-gray-600 dark:text-gray-400">📍 {exp.location}</p>
                        )}
                      </div>
                      {exp.current && (
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{exp.description}</p>
                    
                    {exp.technologies && exp.technologies.trim() && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.split(',').map((tech, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 text-4xl mb-4">💼</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No experience added yet</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Work experience will appear here once it's added through the admin panel.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">More About Me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Education</h3>
              <p className="text-gray-700 dark:text-gray-300">
                I'm constantly learning and staying up-to-date with the latest technologies and best practices in software development.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Interests</h3>
              <p className="text-gray-700 dark:text-gray-300">
                When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and sharing knowledge with the developer community.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Let's Work Together</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            I'm always interested in new opportunities and exciting projects.
          </p>
          <a
            href="/contact"
            className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default About; 