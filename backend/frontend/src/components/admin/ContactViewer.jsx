import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios';

const ContactViewer = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contact Messages</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="http://127.0.0.1:8000/admin/api/contactsubmission/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Django Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Total Messages</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{contacts.length} messages</p>
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{contacts.length}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Unread Messages</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{unreadContacts.length} unread</p>
              </div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{unreadContacts.length}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Read Messages</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{readContacts.length} read</p>
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{readContacts.length}</div>
            </div>
          </div>
        </div>

        {/* Unread Messages */}
        {unreadContacts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Unread Messages ({unreadContacts.length})
              </h3>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {unreadContacts.map((contact) => (
                <div key={contact.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{contact.name}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{contact.message}</p>
                      {contact.subject && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong>Subject:</strong> {contact.subject}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => markAsRead(contact.id)}
                      className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Mark as Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All Messages</h3>
          </div>
          <div className="divide-y dark:divide-gray-700">
            {contacts.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">No messages found</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div key={contact.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{contact.name}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contact.read 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {contact.read ? 'Read' : 'Unread'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{contact.message}</p>
                      {contact.subject && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong>Subject:</strong> {contact.subject}
                        </p>
                      )}
                    </div>
                    {!contact.read && (
                      <button
                        onClick={() => markAsRead(contact.id)}
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactViewer; 