import React, { useState } from 'react';
import { Plus, Edit3, Trash2, GraduationCap, MapPin, Calendar, School } from 'lucide-react';
import { Button } from '../ui/Button';
import EducationForm from './EducationForm';

const EducationSection = ({ education, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const handleAdd = () => {
    setEditingEducation(null);
    setShowForm(true);
  };

  const handleEdit = (edu) => {
    setEditingEducation(edu);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      const updated = education.filter(edu => edu.id !== id);
      onUpdate(updated);
    }
  };

  const handleSave = (educationData) => {
    let updated;
    if (editingEducation) {
      updated = education.map(edu => 
        edu.id === editingEducation.id ? { ...educationData, id: editingEducation.id } : edu
      );
    } else {
      updated = [...education, { ...educationData, id: Date.now().toString() }];
    }
    onUpdate(updated);
    setShowForm(false);
    setEditingEducation(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEducation(null);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Education</h2>
          <p className="text-gray-600">Your academic background and qualifications</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No education added</h3>
          <p className="text-gray-600 mb-6">Add your educational background to showcase your qualifications</p>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Education
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {education.map((edu) => (
            <div key={edu.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{edu.degree}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <School className="w-4 h-4" />
                          <span className="font-medium">{edu.institution}</span>
                        </div>
                        {edu.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{edu.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(edu.startDate)} - {
                              edu.current ? 'Present' : formatDate(edu.endDate)
                            }
                          </span>
                        </div>
                        {edu.gpa && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </div>
                      {edu.description && (
                        <p className="text-gray-700 whitespace-pre-line">{edu.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 lg:flex-col lg:w-32">
                  <Button
                    onClick={() => handleEdit(edu)}
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:w-full"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(edu.id)}
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
        <EducationForm
          education={editingEducation}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default EducationSection;