import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import AdminLayout from './AdminLayout';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const TestimonialManager = ({ onLogout }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    featured: false,
    approved: false
  });
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, message: '' });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/testimonials/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setTestimonials(response.data);
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
      const url = editingTestimonial 
        ? `/testimonials/${editingTestimonial.id}/`
        : '/testimonials/';
      const method = editingTestimonial ? 'put' : 'post';
      await api[method](url, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchTestimonials();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    setConfirm({
      open: true,
      message: 'Are you sure you want to delete this testimonial?',
      onConfirm: async () => {
        setConfirm((prev) => ({ ...prev, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          await api.delete(`/testimonials/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          fetchTestimonials();
        } catch (error) {
          setError(error.message);
        }
      }
    });
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      position: testimonial.position || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      approved: testimonial.approved
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      company: '',
      content: '',
      rating: 5,
      featured: false,
      approved: false
    });
    setEditingTestimonial(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Testimonial Manager</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Add, edit, and manage your testimonials</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-lg font-semibold"
            >
              Add New Testimonial
            </button>
          </div>

          {/* Testimonials Overview Card */}
          <div className="relative overflow-hidden rounded-xl mb-6 shadow border border-yellow-100 dark:border-yellow-900 bg-gradient-to-br from-yellow-100 via-orange-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 max-w-xs">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 via-orange-500 to-indigo-500 shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M17 8a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-0.5 tracking-tight">Testimonials</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">{testimonials.length} total</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-indigo-600 animate-pulse">
                  {testimonials.length}
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="20" rx="40" ry="20" fill="url(#cardblobsm)" />
                <defs>
                  <radialGradient id="cardblobsm" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stopColor="#fde68a" />
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
                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rating *
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value={1}>1 Star</option>
                      <option value={2}>2 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={5}>5 Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Testimonial Content *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100"
                      placeholder="What did they say about your work?"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Featured Toggle */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        aria-pressed={formData.featured}
                        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${formData.featured ? 'bg-yellow-500' : 'bg-gray-300'}`}
                      >
                        <span className="sr-only">Toggle Featured</span>
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${formData.featured ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                      </button>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
                        Featured Testimonial
                      </label>
                    </div>
                    {/* Approved Toggle */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        aria-pressed={formData.approved}
                        onClick={() => setFormData(prev => ({ ...prev, approved: !prev.approved }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${formData.approved ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className="sr-only">Toggle Approved</span>
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${formData.approved ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                      </button>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
                        Approved
                      </label>
                    </div>
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
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      {editingTestimonial ? 'Update' : 'Create'} Testimonial
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Testimonials Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="overflow-x-auto">
              {testimonials.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No testimonials yet. Add your first testimonial!</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Content</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {testimonials.map((testimonial) => (
                      <tr key={testimonial.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-left font-semibold text-gray-900 dark:text-gray-100">{testimonial.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-gray-700 dark:text-gray-300">{testimonial.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-gray-700 dark:text-gray-300">{testimonial.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-yellow-500 dark:text-yellow-400">{'★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600 dark:text-gray-400 max-w-xs truncate">{testimonial.content}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center gap-1">
                            {testimonial.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Featured</span>
                            )}
                            {testimonial.approved && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-nowrap items-center gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(testimonial)}
                              className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm shadow-md"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(testimonial.id)}
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
        title="Delete Testimonial"
        description={confirm.message}
        confirmText="Delete"
      />
    </AdminLayout>
  );
};

export default TestimonialManager; 