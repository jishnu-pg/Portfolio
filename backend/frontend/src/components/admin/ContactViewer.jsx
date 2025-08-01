import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';
import AdminLayout from './AdminLayout';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { Trash2, Bell } from 'lucide-react';
import { clearTokens } from '../../utils/auth';

function formatDate(dateString) {
  if (!dateString) return '-';
  // Try to parse as ISO, fallback to replace space with T
  let date = new Date(dateString);
  if (isNaN(date.getTime()) && typeof dateString === 'string') {
    date = new Date(dateString.replace(' ', 'T'));
  }
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const ContactViewer = ({ onLogout }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, onConfirm: null, message: '' });
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = React.useRef(null);

  // Provide a default logout handler if not passed
  const handleLogout = onLogout || (() => {
    clearTokens();
    window.location.href = '/admin/login';
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.get('/contacts/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setContacts(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (contactId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/contacts/${contactId}/`, { read: true }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchContacts();
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const handleDelete = async (id) => {
    setConfirm({
      open: true,
      message: 'Are you sure you want to delete this message?',
      onConfirm: async () => {
        setConfirm((prev) => ({ ...prev, open: false }));
        try {
          const token = localStorage.getItem('adminToken');
          await api.delete(`/contacts/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          fetchContacts();
        } catch (error) {
          setError(error.message);
        }
      }
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

  const unreadContacts = contacts.filter(contact => !contact.read);
  const readContacts = contacts.filter(contact => contact.read);

  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        {/* Bell icon in top right */}
        <div className="absolute top-6 right-8 z-50">
          <button
            ref={bellRef}
            onClick={() => setShowDropdown((prev) => !prev)}
            className="relative p-1 rounded-full bg-white dark:bg-gray-800 shadow hover:bg-blue-100 dark:hover:bg-gray-700 transition"
            aria-label="Show unread messages"
          >
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {unreadContacts.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">
                {unreadContacts.length}
              </span>
            )}
          </button>
          {showDropdown && unreadContacts.length > 0 && (
            <div className="absolute right-0 mt-2 w-80 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-3 border-b dark:border-gray-700 font-semibold text-gray-800 dark:text-gray-100">Unread Messages</div>
              <ul className="max-h-72 overflow-y-auto divide-y dark:divide-gray-700 custom-scrollbar">
                {unreadContacts.map((contact) => (
                  <li
                    key={contact.id}
                    className="p-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-700 dark:text-blue-300">{contact.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(contact.created_at || contact.submitted_at)}</span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 truncate">{contact.subject || '(No Subject)'}</div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          markAsRead(contact.id);
                          setShowDropdown(false);
                        }}
                        className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs shadow transition"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 8px;
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #c7d2fe;
                  border-radius: 6px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #374151;
                }
                .custom-scrollbar {
                  scrollbar-width: thin;
                  scrollbar-color: #c7d2fe transparent;
                }
                .dark .custom-scrollbar {
                  scrollbar-color: #374151 transparent;
                }
              `}</style>
            </div>
          )}
        </div>
        {/* Main content header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Contact Messages</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your contact messages</p>
          </div>
          {/* Contact Messages Overview Card */}
          <div className="relative overflow-hidden rounded-xl mb-6 shadow border border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 max-w-xs">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1118 0z" /></svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-0.5 tracking-tight">Messages</h2>
                <p className="text-xs text-gray-600 dark:text-gray-300">{contacts.length} total</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-pulse">
                  {contacts.length}
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

          {/* All Messages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="overflow-x-auto">
              {contacts.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No messages found</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {contacts.map((contact) => {
                      console.log('Contact created_at:', contact.created_at, contact);
                      return (
                        <tr key={contact.id} id={`contact-row-${contact.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-left font-semibold text-gray-900 dark:text-gray-100">{contact.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-gray-700 dark:text-gray-300">{contact.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600 dark:text-gray-400">{formatDate(contact.created_at || contact.submitted_at)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600 dark:text-gray-400">{contact.subject}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600 dark:text-gray-400 max-w-xs truncate">{contact.message}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contact.read ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>{contact.read ? 'Read' : 'Unread'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex flex-nowrap items-center gap-2 justify-center">
                              {!contact.read && (
                                <button
                                  onClick={() => markAsRead(contact.id)}
                                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
                                >
                                  Mark as Read
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(contact.id)}
                                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm shadow-md"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
        title="Delete Message"
        description={confirm.message}
        confirmText="Delete"
      />
    </AdminLayout>
  );
};

export default ContactViewer; 