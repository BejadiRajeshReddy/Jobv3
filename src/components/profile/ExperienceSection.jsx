import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Briefcase, MapPin, Calendar, Building } from 'lucide-react';
import { Button } from '../ui/Button';
import ExperienceForm from './ExperienceForm';

const ExperienceSection = ({ experiences, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const handleAdd = () => {
    setEditingExperience(null);
    setShowForm(true);
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      const updated = experiences.filter(exp => exp.id !== id);
      onUpdate(updated);
    }
  };

  const handleSave = (experienceData) => {
    let updated;
    if (editingExperience) {
      updated = experiences.map(exp => 
        exp.id === editingExperience.id ? { ...experienceData, id: editingExperience.id } : exp
      );
    } else {
      updated = [...experiences, { ...experienceData, id: Date.now().toString() }];
    }
    onUpdate(updated);
    setShowForm(false);
    setEditingExperience(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExperience(null);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
          <p className="text-gray-600">Your professional work history</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No work experience added</h3>
          <p className="text-gray-600 mb-6">Add your professional experience to showcase your career journey</p>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{experience.company}</span>
                        </div>
                        {experience.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(experience.startDate)} - {
                              experience.current ? 'Present' : formatDate(experience.endDate)
                            }
                          </span>
                        </div>
                      </div>
                      {experience.description && (
                        <p className="text-gray-700 whitespace-pre-line">{experience.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 lg:flex-col lg:w-32">
                  <Button
                    onClick={() => handleEdit(experience)}
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:w-full"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(experience.id)}
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
        <ExperienceForm
          experience={editingExperience}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ExperienceSection;