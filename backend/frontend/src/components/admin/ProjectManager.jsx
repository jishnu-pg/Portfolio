import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import { Edit, Trash2, LayoutGrid } from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import AdminLayout from './AdminLayout';

const ProjectManager = ({ onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    github_link: '',
    live_demo_link: '',
    featured: false,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, message: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/projects/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProjects(response.data);
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
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key === 'technologies') {
          // Convert comma-separated string to array, then to JSON string
          const techArray = formData[key]
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
          formDataToSend.append(key, JSON.stringify(techArray));
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = editingProject 
        ? `/projects/${editingProject.id}/`
        : '/projects/';
      
      const method = editingProject ? 'put' : 'post';
      await api[method](url, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchProjects();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    setConfirm({
      open: true,
      message: 'Are you sure you want to delete this project?',
      onConfirm: async () => {
        setConfirm({ ...confirm, open: false });
        try {
          const token = localStorage.getItem('adminToken');
          await api.delete(`/projects/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          fetchProjects();
        } catch (error) {
          setError(error.message);
        }
      }
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(', ') || '',
      github_link: project.github_link || '',
      live_demo_link: project.live_demo_link || '',
      featured: project.featured,
      image: null
    });
    setShowForm(true);
    setImagePreview(project.image_url || null);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      github_link: '',
      live_demo_link: '',
      featured: false,
      image: null
    });
    setEditingProject(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(editingProject ? editingProject.image_url : null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Project Manager</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Add, edit, and manage your portfolio projects</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-semibold"
            >
              <Edit className="w-5 h-5 mr-2" />
              Add Project
            </button>
          </div>

          {/* Projects Overview Card */}
          <div className="relative overflow-hidden rounded-xl mb-6 shadow border border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 max-w-xs">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 shadow">
                <LayoutGrid className="w-5 h-5 text-white drop-shadow" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-0.5 tracking-tight">Projects</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">{projects.length} total</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-pulse">
                  {projects.length}
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="20" rx="40" ry="20" fill="url(#cardblobsm)" />
                <defs>
                  <radialGradient id="cardblobsm" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-lg h-[520px] flex flex-col items-center">
                <div className="w-full flex-1 overflow-y-auto hide-scrollbar">
                <div className="flex justify-between items-center w-full mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold px-2"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technologies *</label>
                    <input
                      type="text"
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., React, Django, PostgreSQL"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                      <input
                        type="url"
                        name="github_link"
                        value={formData.github_link}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Demo URL</label>
                      <input
                        type="url"
                        name="live_demo_link"
                        value={formData.live_demo_link}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Image</label>
                    {imagePreview && (
                      <div className="mb-2 flex justify-center">
                        <img src={imagePreview} alt="Preview" className="max-h-32 rounded shadow border" />
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
                    />
                  </div>
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
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 select-none">Featured Project</label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-bold shadow-sm"
                    >
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </button>
                  </div>
                </form>
                </div>
              </div>
            </div>
          )}

          {/* Projects Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Technologies</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">GitHub</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Live Demo</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-600 dark:text-gray-400">No projects found</td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">{project.title}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">{project.description}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-300 whitespace-nowrap">{project.technologies?.join ? project.technologies.join(', ') : project.technologies}</td>
                      <td className="px-6 py-4 text-center">
                        {project.github_link ? (
                          <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline">GitHub</a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {project.live_demo_link ? (
                          <a href={project.live_demo_link} target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 underline">Live</a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.featured ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                          {project.featured ? 'Featured' : 'Regular'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-nowrap items-center gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(project)}
                            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm shadow-md"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm shadow-md"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <ConfirmDeleteModal
          open={confirm.open}
          title="Delete Project?"
          description="This action cannot be undone. Are you sure you want to delete this project?"
          confirmText="Delete"
          onClose={() => setConfirm({ ...confirm, open: false })}
          onConfirm={confirm.onConfirm}
        />
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default ProjectManager; 