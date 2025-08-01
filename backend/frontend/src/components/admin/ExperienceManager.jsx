import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import AdminLayout from './AdminLayout';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const ExperienceManager = ({ onLogout }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    current: false,
    description: '',
    technologies: ''
  });
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, message: '' });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/experience/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setExperiences(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const dataToSend = {
        ...formData,
        end_date: formData.current ? null : formData.end_date
      };
      const url = editingExperience 
        ? `/experience/${editingExperience.id}/`
        : '/experience/';
      const method = editingExperience ? 'put' : 'post';
      await api[method](url, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchExperiences();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    setConfirm({
      open: true,
      message: 'Are you sure you want to delete this experience entry?',
      onConfirm: async () => {
        setConfirm((prev) => ({ ...prev, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          await api.delete(`/experience/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          fetchExperiences();
        } catch (error) {
          setError(error.message);
        }
      }
    });
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setFormData({
      title: experience.title,
      company: experience.company,
      location: experience.location || '',
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      current: experience.current,
      description: experience.description,
      technologies: experience.technologies || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
      technologies: ''
    });
    setEditingExperience(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
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
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">Error: {error}</div>
          <Link
            to="/admin/dashboard"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Experience Manager</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Add, edit, and manage your work experience</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg font-semibold"
            >
              Add New Experience
            </button>
          </div>

          {/* Experience Overview Card */}
          <div className="relative overflow-hidden rounded-xl mb-6 shadow border border-orange-100 dark:border-orange-900 bg-gradient-to-br from-orange-100 via-yellow-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 max-w-xs">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 via-yellow-500 to-indigo-500 shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h3m-7 4v2a4 4 0 004 4h3m-7-4a4 4 0 01-4-4V7a4 4 0 014-4h7a4 4 0 014 4v6a4 4 0 01-4 4H9z" /></svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-0.5 tracking-tight">Experiences</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">{experiences.length} total</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-yellow-600 to-indigo-600 animate-pulse">
                  {experiences.length}
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="20" rx="40" ry="20" fill="url(#cardblobsm)" />
                <defs>
                  <radialGradient id="cardblobsm" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stopColor="#fdba74" />
                    <stop offset="100%" stopColor="#f59e42" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., New York, NY"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        disabled={formData.current}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      aria-pressed={formData.current}
                      onClick={() => setFormData(prev => ({ ...prev, current: !prev.current }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${formData.current ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className="sr-only">Toggle Current Position</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${formData.current ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
                      Current Position
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      placeholder="Describe your role and responsibilities..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleInputChange}
                      placeholder="e.g., React, Django, PostgreSQL, AWS"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      {editingExperience ? 'Update Experience' : 'Create Experience'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Experience Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="overflow-x-auto">
              {experiences.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No experience entries found. Add your first work experience!</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Technologies</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {experiences.map((experience) => (
                      <tr key={experience.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-left font-semibold text-gray-900 dark:text-gray-100">{experience.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-gray-700 dark:text-gray-300">{experience.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600 dark:text-gray-400">{experience.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600 dark:text-gray-400">{formatDate(experience.start_date)} - {experience.current ? 'Present' : formatDate(experience.end_date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600 dark:text-gray-400">{experience.technologies}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {experience.current ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Current</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Past</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-nowrap items-center gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(experience)}
                              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm shadow-md"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(experience.id)}
                              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm shadow-md"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        open={confirm.open}
        onClose={() => setConfirm((prev) => ({ ...prev, open: false }))}
        onConfirm={confirm.onConfirm}
        title="Delete Experience"
        description={confirm.message}
        confirmText="Delete"
      />
    </AdminLayout>
  );
};

export default ExperienceManager; 