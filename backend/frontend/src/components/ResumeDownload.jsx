import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, File, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../utils/axios';

const ResumeDownload = () => {
  const { t } = useTranslation();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveResume();
  }, []);

  const fetchActiveResume = async () => {
    try {
      const response = await api.get('/resumes/active/');
      setResume(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('No resume available for download');
      } else {
        setError('Failed to load resume information');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!resume) return;
    setDownloading(true);
    try {
      const response = await api.get(`/resumes/${resume.id}/download/`, { responseType: 'blob' });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.file.split('/').pop();
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-center text-center">
          <div>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Resume Not Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {error}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!resume) {
    return null;
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center justify-center gap-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 border-white/30 dark:border-gray-700/30 text-gray-900 dark:text-gray-100 px-8 py-4 rounded-2xl hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {downloading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
      ) : (
        <Download className="w-5 h-5" />
      )}
      <span>{downloading ? 'Downloading...' : 'Resume'}</span>
    </motion.button>
  );
};

export default ResumeDownload;