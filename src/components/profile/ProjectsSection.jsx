import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, FolderOpen, ExternalLink, Github, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

const ProjectsSection = ({ projects, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    startDate: '',
    endDate: '',
    ongoing: false,
    githubUrl: '',
    liveUrl: '',
    highlights: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      ongoing: false,
      githubUrl: '',
      liveUrl: '',
      highlights: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields');
      return;
    }

    const newProject = {
      ...formData,
      id: editingId || Date.now().toString(),
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      highlights: formData.highlights.split('\n').filter(highlight => highlight.trim())
    };

    let updatedProjects;
    if (editingId) {
      updatedProjects = projects.map(project => 
        project.id === editingId ? newProject : project
      );
    } else {
      updatedProjects = [...projects, newProject];
    }

    onUpdate(updatedProjects);
    resetForm();
  };

  const handleEdit = (project) => {
    setFormData({
      ...project,
      technologies: project.technologies?.join(', ') || '',
      highlights: project.highlights?.join('\n') || ''
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(project => project.id !== id);
      onUpdate(updatedProjects);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <Button onClick={() => setIsAdding(true)} variant="blue">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isAdding && (
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="blue" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. E-commerce Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                disabled={formData.ongoing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <Input
                value={formData.githubUrl}
                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                placeholder="https://github.com/username/project"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Live Demo URL</label>
              <Input
                value={formData.liveUrl}
                onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                placeholder="https://project-demo.com"
              />
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="ongoing-project"
                checked={formData.ongoing}
                onChange={(e) => setFormData({...formData, ongoing: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="ongoing-project" className="ml-2 text-sm text-gray-700">
                This is an ongoing project
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what the project does, your role, and the problem it solves..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Highlights</label>
            <textarea
              value={formData.highlights}
              onChange={(e) => setFormData({...formData, highlights: e.target.value})}
              placeholder="List key achievements or features (one per line)..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects added yet</h3>
            <p className="text-gray-600 mb-4">Showcase your work by adding projects you've built</p>
            <Button onClick={() => setIsAdding(true)} variant="blue">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(project.startDate)} - {project.ongoing ? 'Ongoing' : formatDate(project.endDate)}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.highlights && project.highlights.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Highlights:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {project.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(project)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;