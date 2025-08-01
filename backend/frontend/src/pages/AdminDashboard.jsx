import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Users, FileText, Code, MessageSquare, Eye,
  Calendar, Star, Activity, Target, Award, Zap, LogOut,
  RefreshCw, Download, Filter, BarChart3, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Settings, Bell, Clock
} from 'lucide-react';
import { useAuth } from '../utils/auth';
import api from '../utils/axios';
import AdminLayout from '../components/admin/AdminLayout';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    experience: 0,
    testimonials: 0,
    contacts: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30'); // days
  const [chartType, setChartType] = useState('area');
  const [analyticsData, setAnalyticsData] = useState({
    visitorStats: [],
    blogStats: [],
    projectStats: [],
    skillCategories: [],
    recentActivity: [],
    monthlyGrowth: []
  });

  // Dynamic color schemes
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16'];

  useEffect(() => {
    fetchAllData();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchAllData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchAllData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchAnalyticsData(),
        fetchRecentActivity(),
        fetchMonthlyGrowth()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const endpoints = [
        '/projects/',
        '/blogs/',
        '/skills/',
        '/experience/',
        '/testimonials/',
        '/contacts/'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint => 
          api.get(endpoint, { headers })
        )
      );

      const data = responses.map(response => response.data);

      setStats({
        projects: data[0].length || 0,
        blogs: data[1].length || 0,
        skills: data[2].length || 0,
        experience: data[3].length || 0,
        testimonials: data[4].length || 0,
        contacts: data[5].length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [projectsResponse, blogsResponse, skillsResponse] = await Promise.all([
        api.get('/projects/', { headers }),
        api.get('/blogs/', { headers }),
        api.get('/skills/', { headers })
      ]);

      const projects = projectsResponse.data;
      const blogs = blogsResponse.data;
      const skills = skillsResponse.data;

      // Generate dynamic visitor data based on date range
      const visitorStats = generateVisitorData(dateRange);
      
      // Generate blog categories from real data
      const blogCategories = {};
      blogs.forEach(blog => {
        const category = blog.category || 'General';
        blogCategories[category] = (blogCategories[category] || 0) + 1;
      });
      
      const blogStats = Object.entries(blogCategories).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));

      // Generate project technologies from real data
      const techStack = {};
      projects.forEach(project => {
        if (project.tech_stack) {
          project.tech_stack.split(',').forEach(tech => {
            const cleanTech = tech.trim();
            techStack[cleanTech] = (techStack[cleanTech] || 0) + 1;
          });
        }
      });

      const projectStats = Object.entries(techStack)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length]
        }));

      // Generate skill categories from real data
      const skillCategories = {};
      skills.forEach(skill => {
        const category = skill.category || 'Other';
        skillCategories[category] = (skillCategories[category] || 0) + 1;
      });

      const skillCategoriesData = Object.entries(skillCategories).map(([name, count], index) => ({
        name,
        count,
        color: COLORS[index % COLORS.length]
      }));

      setAnalyticsData(prev => ({
        ...prev,
        visitorStats,
        blogStats,
        projectStats,
        skillCategories: skillCategoriesData
      }));
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [projects, blogs, contacts, skills] = await Promise.all([
        api.get('/projects/', { headers }).then(r => r.data),
        api.get('/blogs/', { headers }).then(r => r.data),
        api.get('/contacts/', { headers }).then(r => r.data),
        api.get('/skills/', { headers }).then(r => r.data)
      ]);

      const activities = [];

      // Add recent projects
      projects.slice(0, 3).forEach(project => {
        activities.push({
          action: 'New project added',
          item: project.title,
          time: new Date(project.created_at).toLocaleDateString(),
          icon: Code,
          color: 'blue'
        });
      });

      // Add recent blogs
      blogs.slice(0, 2).forEach(blog => {
        activities.push({
          action: 'Blog post published',
          item: blog.title,
          time: new Date(blog.created_at).toLocaleDateString(),
          icon: FileText,
          color: 'purple'
        });
      });

      // Add recent contacts
      contacts.slice(0, 2).forEach(contact => {
        activities.push({
          action: 'New contact received',
          item: contact.name,
          time: new Date(contact.created_at).toLocaleDateString(),
          icon: MessageSquare,
          color: 'green'
        });
      });

      // Add recent skills
      skills.slice(0, 1).forEach(skill => {
        activities.push({
          action: 'Skill updated',
          item: skill.name,
          time: new Date(skill.created_at).toLocaleDateString(),
          icon: Target,
          color: 'orange'
        });
      });

      // Sort by date and take latest 8
      activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      setAnalyticsData(prev => ({
        ...prev,
        recentActivity: activities.slice(0, 8)
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchMonthlyGrowth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [projects, blogs, contacts] = await Promise.all([
        api.get('/projects/', { headers }).then(r => r.data),
        api.get('/blogs/', { headers }).then(r => r.data),
        api.get('/contacts/', { headers }).then(r => r.data)
      ]);

      // Generate monthly growth data
      const monthlyGrowth = generateMonthlyGrowthData(projects, blogs, contacts);
      
      setAnalyticsData(prev => ({
        ...prev,
        monthlyGrowth
      }));
    } catch (error) {
      console.error('Error fetching monthly growth:', error);
    }
  };

  const generateVisitorData = (days) => {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate realistic visitor data with some randomness
      const baseVisitors = 1200 + Math.random() * 800;
      const visitors = Math.floor(baseVisitors + (Math.random() - 0.5) * 400);
      const pageViews = Math.floor(visitors * (2.5 + Math.random() * 1.5));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        visitors,
        pageViews,
        bounceRate: Math.floor(30 + Math.random() * 20)
      });
    }
    
    return data;
  };

  const generateMonthlyGrowthData = (projects, blogs, contacts) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    
    months.forEach((month, index) => {
      // Generate realistic growth data based on actual data
      const baseProjects = Math.floor(projects.length / 12) + Math.random() * 2;
      const baseBlogs = Math.floor(blogs.length / 12) + Math.random() * 1;
      const baseContacts = Math.floor(contacts.length / 12) + Math.random() * 3;
      
      data.push({
        month,
        projects: Math.max(0, Math.floor(baseProjects)),
        blogs: Math.max(0, Math.floor(baseBlogs)),
        contacts: Math.max(0, Math.floor(baseContacts))
      });
    });
    
    return data;
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const StatCard = ({ icon: Icon, title, value, color, delay, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-lg px-4 py-5 bg-gray-50 dark:bg-gray-800 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      onClick={onClick}
    >
      <Icon className={`w-6 h-6 ${color} opacity-80`} />
      <div>
        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-0.5">{title}</div>
        <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{loading ? '...' : value.toLocaleString()}</div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, className = "", actions }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg bg-white dark:bg-gray-900 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </motion.div>
  );

  const ActivityItem = ({ activity, index, last }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.07 }}
      className="relative flex items-start gap-4 py-4 px-2 group"
    >
      {/* Timeline vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800 z-0" style={{ display: last ? 'none' : 'block' }} />
      {/* Icon avatar */}
      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 shadow-sm border border-gray-200 dark:border-gray-800`}>
        <activity.icon className={`w-5 h-5 ${activity.color ? `text-${activity.color}-500` : 'text-gray-400'}`} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-0.5">{activity.action}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{activity.item}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{activity.time}</div>
      </div>
    </motion.div>
  );

  return (
    <AdminLayout onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{t('admin.dashboard')}</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-light mt-1">{t('admin.welcome')}</p>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-transparent text-gray-700 dark:text-gray-300 text-sm focus:outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button
              onClick={fetchAllData}
              disabled={refreshing}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 focus:outline-none"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 focus:outline-none"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Minimalist Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Code}
            title={t('admin.totalProjects')}
            value={stats.projects}
            color="text-blue-500"
            delay={0.1}
            onClick={() => window.location.href = '/admin/projects'}
          />
          <StatCard
            icon={FileText}
            title={t('admin.totalBlogs')}
            value={stats.blogs}
            color="text-purple-500"
            delay={0.2}
            onClick={() => window.location.href = '/admin/blogs'}
          />
          <StatCard
            icon={Target}
            title={t('admin.totalSkills')}
            value={stats.skills}
            color="text-orange-500"
            delay={0.4}
            onClick={() => window.location.href = '/admin/skills'}
          />
          <StatCard
            icon={Award}
            title={t('admin.totalExperience')}
            value={stats.experience}
            color="text-pink-500"
            delay={0.5}
            onClick={() => window.location.href = '/admin/experience'}
          />
          <StatCard
            icon={MessageSquare}
            title={t('admin.totalContacts')}
            value={stats.contacts}
            color="text-indigo-500"
            delay={0.6}
            onClick={() => window.location.href = '/admin/messages'}
          />
        </div>

        {/* Recent Activity Only */}
        <div className="mb-8">
          <ChartCard title="Recent Activity">
            <div className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl p-2 sm:p-4">
              {analyticsData.recentActivity.length > 0 ? (
                analyticsData.recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} index={index} last={index === analyticsData.recentActivity.length - 1} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Quick Actions removed as requested */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 