import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";

const initialForm = {
  title: "",
  description: "",
  tech_stack: "",
  github_link: "",
  live_demo_link: "",
  image: null,
};

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/projects/", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/projects/${id}/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete project.");
    }
    setDeletingId(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setFormError("");
    setAdding(true);
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }
    try {
      await axios.post("/api/projects/", formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowAdd(false);
      setForm(initialForm);
      fetchProjects();
    } catch (err) {
      setFormError("Failed to add project. Please check your input.");
    }
    setAdding(false);
  };

  const openEditModal = (project) => {
    setEditId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      tech_stack: project.tech_stack || "",
      github_link: project.github_link || "",
      live_demo_link: project.live_demo_link || "",
      image: null,
    });
    setFormError("");
    setShowEdit(true);
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    setFormError("");
    setEditing(true);
    const formData = new FormData();
    for (const key in form) {
      if (form[key]) formData.append(key, form[key]);
    }
    try {
      await axios.patch(`/api/projects/${editId}/`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowEdit(false);
      setEditId(null);
      setForm(initialForm);
      fetchProjects();
    } catch (err) {
      setFormError("Failed to update project. Please check your input.");
    }
    setEditing(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Manage Projects</h2>
      <button
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        onClick={() => setShowAdd(true)}
      >
        + Add Project
      </button>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-slate-800 rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Tech Stack</th>
                <th className="py-2 px-4 border-b">GitHub</th>
                <th className="py-2 px-4 border-b">Live Demo</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-sky-50 dark:hover:bg-slate-700">
                  <td className="py-2 px-4 border-b">{project.title}</td>
                  <td className="py-2 px-4 border-b">{project.tech_stack}</td>
                  <td className="py-2 px-4 border-b">
                    {project.github_link ? (
                      <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GitHub</a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {project.live_demo_link ? (
                      <a href={project.live_demo_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Live</a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 px-4 border-b flex gap-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      disabled={deletingId === project.id}
                    >
                      {deletingId === project.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Add Project Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setShowAdd(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Add Project</h3>
            {formError && <div className="mb-2 text-red-500">{formError}</div>}
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Tech Stack</label>
                <input
                  type="text"
                  name="tech_stack"
                  value={form.tech_stack}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">GitHub Link</label>
                <input
                  type="url"
                  name="github_link"
                  value={form.github_link}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Live Demo Link</label>
                <input
                  type="url"
                  name="live_demo_link"
                  value={form.live_demo_link}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFormChange}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                disabled={adding}
              >
                {adding ? "Adding..." : "Add Project"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Project Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setShowEdit(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">Edit Project</h3>
            {formError && <div className="mb-2 text-red-500">{formError}</div>}
            <form onSubmit={handleEditProject} className="space-y-4">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Tech Stack</label>
                <input
                  type="text"
                  name="tech_stack"
                  value={form.tech_stack}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">GitHub Link</label>
                <input
                  type="url"
                  name="github_link"
                  value={form.github_link}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Live Demo Link</label>
                <input
                  type="url"
                  name="live_demo_link"
                  value={form.live_demo_link}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1">Image (leave blank to keep current)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFormChange}
                  className="w-full"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition"
                disabled={editing}
              >
                {editing ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager; 