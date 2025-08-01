import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import AdminLayout from './AdminLayout';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Edit, Trash2 } from 'lucide-react';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    featured: false,
    image: null
  });
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, message: '' });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/blogs/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setBlogs(response.data);
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
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = editingBlog 
        ? `/blogs/${editingBlog.id}/`
        : '/blogs/';
      
      const method = editingBlog ? 'put' : 'post';
      await api[method](url, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchBlogs();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    setConfirm({
      open: true,
      message: 'Are you sure you want to delete this blog post?',
      onConfirm: async () => {
        setConfirm((prev) => ({ ...prev, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          await api.delete(`/blogs/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          fetchBlogs();
        } catch (error) {
          setError(error.message);
        }
      }
    });
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      published: blog.published,
      featured: blog.featured,
      image: null
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      published: false,
      featured: false,
      image: null
    });
    setEditingBlog(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
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
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Blog Manager</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Add, edit, and manage your blog posts</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg font-semibold"
            >
              Add New Blog Post
            </button>
          </div>

          {/* Blog Overview Card */}
          <div className="relative overflow-hidden rounded-xl mb-6 shadow border border-green-100 dark:border-green-900 bg-gradient-to-br from-green-100 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 max-w-xs">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 via-blue-500 to-indigo-500 shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2 2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-0.5 tracking-tight">Blogs</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">{blogs.length} total</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-indigo-600 animate-pulse">
                  {blogs.length}
                </span>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
              <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="20" rx="40" ry="20" fill="url(#cardblobsm)" />
                <defs>
                  <radialGradient id="cardblobsm" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="100%" stopColor="#2563eb" />
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
                      {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                      <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Short summary for preview..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 shadow-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content *</label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        rows="8"
                        placeholder="Write your blog post content here..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 shadow-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Image</label>
                      {/* Preview new selected image if present, otherwise show current image if editing */}
                      {formData.image && typeof formData.image === 'object' ? (
                        <div className="mb-2 flex justify-center">
                          <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Preview"
                            className="max-h-32 rounded shadow border border-gray-200 dark:border-gray-700 object-contain"
                          />
                        </div>
                      ) : editingBlog && (editingBlog.image_url || editingBlog.image) ? (
                        <div className="mb-2 flex justify-center">
                          <img
                            src={editingBlog.image_url || editingBlog.image}
                            alt="Current Featured"
                            className="max-h-32 rounded shadow border border-gray-200 dark:border-gray-700 object-contain"
                          />
                        </div>
                      ) : null}
                      <input
                        type="file"
                        name="image"
                        onChange={handleInputChange}
                        accept="image/*"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 shadow-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish Post</span>
                        <button
                          type="button"
                          aria-pressed={formData.published}
                          onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${formData.published ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${formData.published ? 'translate-x-5' : 'translate-x-1'}`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Post</span>
                        <button
                          type="button"
                          aria-pressed={formData.featured}
                          onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${formData.featured ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${formData.featured ? 'translate-x-5' : 'translate-x-1'}`}
                          />
                        </button>
                      </div>
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
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-bold shadow-sm"
                      >
                        {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Blogs List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="overflow-x-auto">
              {blogs.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No blog posts found</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tags</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {blogs.map((blog) => (
                      <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{blog.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{blog.excerpt || blog.content.slice(0, 60) + (blog.content.length > 60 ? '...' : '')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-700 dark:text-gray-300">{blog.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-700 dark:text-gray-300">{blog.published_date ? new Date(blog.published_date).toLocaleDateString() : ''}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <div className="flex flex-wrap gap-1">
                            {blog.tags && blog.tags.length > 0 ? blog.tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{tag}</span>
                            )) : <span className="text-xs text-gray-400">—</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            blog.published 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                          {blog.featured && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Featured</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-nowrap items-center gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(blog)}
                              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm shadow-md"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm shadow-md"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
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
        title="Delete Blog Post"
        description={confirm.message}
        confirmText="Delete"
      />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </AdminLayout>
  );
};

export default BlogManager; 