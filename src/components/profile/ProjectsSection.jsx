import React, { useState } from 'react';
import { Plus, Edit3, Trash2, FolderOpen, ExternalLink, Github, Calendar, Code } from 'lucide-react';
import { Button } from '../ui/Button';
import ProjectForm from './ProjectForm';

const ProjectsSection = ({ projects, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleAdd = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter(project => project.id !== id);
      onUpdate(updated);
    }
  };

  const handleSave = (projectData) => {
    let updated;
    if (editingProject) {
      updated = projects.map(project => 
        project.id === editingProject.id ? { ...projectData, id: editingProject.id } : project
      );
    } else {
      updated = [...projects, { ...projectData, id: Date.now().toString() }];
    }
    onUpdate(updated);
    setShowForm(false);
    setEditingProject(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects</h2>
          <p className="text-gray-600">Showcase your work and achievements</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects added</h3>
          <p className="text-gray-600 mb-6">Add your projects to showcase your work and achievements</p>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(project.startDate)} - {
                                  project.ongoing ? 'Ongoing' : formatDate(project.endDate)
                                }
                              </span>
                            </div>
                            {project.status && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {project.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {project.description && (
                        <p className="text-gray-700 mb-4 whitespace-pre-line">{project.description}</p>
                      )}

                      {project.highlights && project.highlights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Key Highlights:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {project.highlights.map((highlight, index) => (
                              <li key={index}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.technologies && project.technologies.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="w-4 h-4 text-gray-600" />
                            <span className="font-semibold text-gray-900">Technologies:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 lg:flex-col lg:w-32">
                  <Button
                    onClick={() => handleEdit(project)}
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:w-full"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ProjectsSection;