import React from "react";

const AdminSidebar = ({ onSelect, onLogout }) => (
  <aside className="w-full md:w-64 bg-white dark:bg-slate-800 shadow-md p-6">
    <h2 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400">Admin Menu</h2>
    <nav className="flex flex-col gap-4">
      <button onClick={() => onSelect("projects")} className="text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Projects</button>
      <button onClick={() => onSelect("blogs")} className="text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Blogs</button>
      <button onClick={() => onSelect("contacts")} className="text-left text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">Contacts</button>
      <button onClick={onLogout} className="text-left text-red-500 hover:text-red-700 mt-8">Logout</button>
    </nav>
  </aside>
);

export default AdminSidebar; 