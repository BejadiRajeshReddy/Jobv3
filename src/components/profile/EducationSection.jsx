import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

const EducationSection = ({ education, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: ''
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.degree || !formData.institution) {
      alert('Please fill in required fields');
      return;
    }

    const newEducation = {
      ...formData,
      id: editingId || Date.now().toString()
    };

    let updatedEducation;
    if (editingId) {
      updatedEducation = education.map(edu => 
        edu.id === editingId ? newEducation : edu
      );
    } else {
      updatedEducation = [...education, newEducation];
    }

    onUpdate(updatedEducation);
    resetForm();
  };

  const handleEdit = (educationItem) => {
    setFormData(educationItem);
    setEditingId(educationItem.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this education?')) {
      const updatedEducation = education.filter(edu => edu.id !== id);
      onUpdate(updatedEducation);
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
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        <Button onClick={() => setIsAdding(true)} variant="blue">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {isAdding && (
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Education' : 'Add New Education'}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree *</label>
              <Input
                value={formData.degree}
                onChange={(e) => setFormData({...formData, degree: e.target.value})}
                placeholder="e.g. Bachelor of Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
              <Input
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
                placeholder="e.g. Stanford University"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. Stanford, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
              <Input
                value={formData.gpa}
                onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                placeholder="e.g. 3.8/4.0"
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
                disabled={formData.current}
              />
            </div>
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="current-education"
                checked={formData.current}
                onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="current-education" className="ml-2 text-sm text-gray-700">
                I currently study here
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your coursework, achievements, activities..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {education.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No education added yet</h3>
            <p className="text-gray-600 mb-4">Add your educational background to showcase your qualifications</p>
            <Button onClick={() => setIsAdding(true)} variant="blue">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Education
            </Button>
          </div>
        ) : (
          education.map((educationItem) => (
            <div key={educationItem.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{educationItem.degree}</h3>
                  <p className="text-lg text-blue-600 font-medium">{educationItem.institution}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    {educationItem.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {educationItem.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(educationItem.startDate)} - {educationItem.current ? 'Present' : formatDate(educationItem.endDate)}
                    </div>
                    {educationItem.gpa && (
                      <div className="flex items-center">
                        <span className="font-medium">GPA: {educationItem.gpa}</span>
                      </div>
                    )}
                  </div>

                  {educationItem.description && (
                    <p className="mt-3 text-gray-600 leading-relaxed">{educationItem.description}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(educationItem)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(educationItem.id)}
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

export default EducationSection;