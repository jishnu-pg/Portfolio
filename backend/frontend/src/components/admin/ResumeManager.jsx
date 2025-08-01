import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Download, FileText, Edit, Trash2, Eye, 
  CheckCircle, XCircle, File, Calendar,
  Plus, Settings, RefreshCw
} from 'lucide-react';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import api from '../../utils/axios';
import { useState as useToastState } from 'react';
import { useState as useReactState } from 'react';
import AdminLayout from './AdminLayout';

// Simple Toast component
const Toast = ({ message, onClose }) => (
  <motion.div
    initial={{ x: 40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 40, opacity: 0 }}
    className="fixed top-6 right-6 z-50 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
  >
    <CheckCircle className="w-5 h-5 text-yellow-900" />
    <span>{message}</span>
    <button onClick={onClose} className="ml-4 text-yellow-900 hover:text-yellow-700">✕</button>
  </motion.div>
);

const ResumeManager = ({ onLogout }) => {
  const { t } = useTranslation();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    file: null
  });
  const [toast, setToast] = useToastState(null);
  const [confirm, setConfirm] = useReactState({ open: false, onConfirm: null, title: '', description: '', confirmText: '' });

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/resumes/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setResumes(response.data);
      // Show notification if more than one resume is active
      const activeCount = response.data.filter(r => r.is_active).length;
      if (activeCount > 1) {
        setToast('Warning: More than one resume is set as active!');
        setTimeout(() => setToast(null), 3500);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
    }
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUpload = async () => {
    if (!formData.file) {
      alert('Please select a file');
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const data = new FormData();
      data.append('title', formData.title || 'Resume');
      data.append('description', formData.description);
      data.append('version', formData.version);
      data.append('file', formData.file);
      await api.post('/resumes/', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowUploadModal(false);
      setFormData({ title: '', description: '', version: '', file: null });
      fetchResumes();
    } catch (error) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedResume) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('version', formData.version);
      if (formData.file) {
        data.append('file', formData.file);
      }
      await api.put(`/resumes/${selectedResume.id}/`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setShowEditModal(false);
      setSelectedResume(null);
      setFormData({ title: '', description: '', version: '', file: null });
      fetchResumes();
    } catch (error) {
      alert('Update failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirm({
      open: true,
      title: 'Delete Resume?',
      description: 'This action cannot be undone. Are you sure you want to delete this resume?',
      confirmText: 'Delete',
      icon: <Trash2 className="w-8 h-8 text-red-500 animate-pulse" />, 
      onConfirm: async () => {
        setConfirm((c) => ({ ...c, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          await api.delete(`/resumes/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          fetchResumes();
        } catch (error) {
          alert('Delete failed. Please try again.');
        }
      }
    });
  };

  const handleSetActive = async (id) => {
    console.log('Setting resume as active, ID:', id); // Debug log
    setConfirm({
      open: true,
      title: 'Set Resume as Active?',
      description: 'This will mark this resume as your active resume. Continue?',
      confirmText: 'Set Active',
      icon: <CheckCircle className="w-8 h-8 text-green-500 animate-pulse" />, 
      onConfirm: async () => {
        setConfirm((c) => ({ ...c, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          await api.patch(`/resumes/${id}/`, { is_active: true }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          fetchResumes();
          setToast('Resume set as active!');
          setTimeout(() => setToast(null), 2500);
        } catch (error) {
          alert('Failed to set resume as active. Please try again.');
        }
      }
    });
  };

  const handleSetInactive = async (id) => {
    setConfirm({
      open: true,
      title: 'Set Resume as Inactive?',
      description: 'This will mark this resume as inactive. Continue?',
      confirmText: 'Set Inactive',
      icon: <XCircle className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" />, 
      onConfirm: async () => {
        setConfirm((c) => ({ ...c, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          await api.patch(`/resumes/${id}/`, { is_active: false }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          fetchResumes();
          setToast('Resume set as inactive!');
          setTimeout(() => setToast(null), 2500);
        } catch (error) {
          alert('Failed to set resume as inactive. Please try again.');
        }
      }
    });
  };

  const handleDownload = async (resume) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get(`/resumes/${resume.id}/download/`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resume.file.split('/').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Download failed. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Download failed. Please try again.');
    }
  };

  const openEditModal = useCallback((resume) => {
    setSelectedResume(resume);
    setFormData({
      title: resume.title,
      description: resume.description,
      version: resume.version,
      file: null
    });
    setShowEditModal(true);
  }, []);

  const closeUploadModal = useCallback(() => {
    setShowUploadModal(false);
    setFormData({ title: '', description: '', version: '', file: null });
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedResume(null);
    setFormData({ title: '', description: '', version: '', file: null });
  }, []);

  const UploadModal = useMemo(() => (
    <AnimatePresence>
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upload New Resume
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Resume Title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Brief description of the resume"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., v2.0, 2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Resume File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Accepted formats: PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={closeUploadModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !formData.file}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showUploadModal, formData, uploading, handleInputChange, handleFileChange, handleUpload, closeUploadModal]);

  const EditModal = useMemo(() => (
    <AnimatePresence>
      {showEditModal && selectedResume && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Edit Resume
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New File (Optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to keep current file
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={uploading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Edit className="w-4 h-4 mr-2" />
                )}
                {uploading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showEditModal, selectedResume, formData, uploading, handleInputChange, handleFileChange, handleEdit, closeEditModal]);

  // Find if any resume is active
  const anyActive = resumes.some(r => r.is_active);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Resume Manager</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Upload and manage your resume files</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Resume
            </button>
          </div>
          {/* Resume List */}
          <div className="overflow-x-auto overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">File</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {resumes.length > 0 ? resumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{resume.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{resume.version}</td>
                    <td className="px-6 py-4 whitespace-pre-line text-gray-600 dark:text-gray-400 max-w-xs truncate">{resume.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {resume.file_extension} • {resume.file_size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">{new Date(resume.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0.7 }}
                        animate={resume.is_active ? { scale: 1.1, opacity: 1 } : { scale: 1, opacity: 0.5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${resume.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shadow-md' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}
                      >
                        {resume.is_active ? <CheckCircle className="w-3 h-3 mr-1 animate-bounce" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {resume.is_active ? 'Active' : 'Inactive'}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-nowrap items-center gap-2 justify-center">
                        <button
                          onClick={() => setConfirm({
                            open: true,
                            message: 'Download this resume?',
                            onConfirm: async () => {
                              setConfirm({ ...confirm, open: false });
                              await handleDownload(resume);
                            }
                          })}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                        {!resume.is_active && (
                          <motion.button
                            onClick={() => handleSetActive(resume.id)}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm shadow-md font-semibold"
                          >
                            <CheckCircle className="w-4 h-4 mr-1 animate-pulse" />
                            Active
                          </motion.button>
                        )}
                        {resume.is_active && (
                          <motion.button
                            onClick={() => handleSetInactive(resume.id)}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm shadow-md font-semibold"
                          >
                            <XCircle className="w-4 h-4 mr-1 animate-pulse" />
                            Inactive
                          </motion.button>
                        )}
                        <button
                          onClick={() => openEditModal(resume)}
                          className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm shadow-md"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id)}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm shadow-md"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No resumes uploaded
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload your first resume to get started
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto shadow-lg font-semibold"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </button>
                  </td>
                </tr>
          )}
              </tbody>
            </table>
          </div>
          <AnimatePresence>
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
          </AnimatePresence>
          {/* Modals */}
          {UploadModal}
          {EditModal}
          <ConfirmDeleteModal
            open={confirm.open}
            title={confirm.title}
            description={confirm.description}
            confirmText={confirm.confirmText}
            icon={confirm.icon}
            onClose={() => setConfirm((c) => ({ ...c, open: false }))}
            onConfirm={confirm.onConfirm}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ResumeManager; 