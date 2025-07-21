import React, { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import ProjectManager from "../components/admin/ProjectManager";
import BlogManager from "../components/admin/BlogManager";
import ContactViewer from "../components/admin/ContactViewer";
import { removeToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [section, setSection] = useState("projects");
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/admin/login");
  };

  let content;
  if (section === "projects") content = <ProjectManager />;
  else if (section === "blogs") content = <BlogManager />;
  else if (section === "contacts") content = <ContactViewer />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <div className="flex flex-col md:flex-row">
        <AdminSidebar onSelect={setSection} onLogout={handleLogout} />
        <main className="flex-1 p-8">
          {content || (
            <>
              <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Welcome, Admin!</h1>
              <p className="text-gray-600 dark:text-gray-300">Select a section from the menu to manage your portfolio content.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 