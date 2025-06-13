import React, { useState } from 'react';
import { Save, X, GraduationCap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

const EducationForm = ({ education, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    degree: education?.degree || '',
    institution: education?.institution || '',
    location: education?.location || '',
    startDate: education?.startDate || '',
    endDate: education?.endDate || '',
    current: education?.current || false,
    gpa: education?.gpa || '',
    description: education?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {education ? 'Edit Education' : 'Add Education'}
              </h2>
              <p className="text-gray-600">Share your educational background</p>
            </div>
            <Button onClick={onCancel} variant="ghost" className="p-3 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-green-50 rounded-2xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Academic Details</h3>
                  <p className="text-sm text-gray-600">Information about your education</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Degree/Qualification *
                  </label>
                  <Input
                    value={formData.degree}
                    onChange={(e) => handleChange('degree', e.target.value)}
                    placeholder="e.g. Bachelor of Computer Science"
                    required
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Institution *
                  </label>
                  <Input
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    placeholder="e.g. Stanford University"
                    required
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g. Stanford, CA"
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GPA/Grade
                  </label>
                  <Input
                    value={formData.gpa}
                    onChange={(e) => handleChange('gpa', e.target.value)}
                    placeholder="e.g. 3.8/4.0 or First Class"
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    required
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    disabled={formData.current}
                    className="text-base h-12"
                  />
                </div>
                <div className="flex items-center lg:col-span-2">
                  <input
                    type="checkbox"
                    id="current"
                    checked={formData.current}
                    onChange={(e) => handleChange('current', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="current" className="ml-2 block text-sm text-gray-900">
                    I am currently studying here
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (coursework, achievements, etc.)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe relevant coursework, projects, achievements, or honors..."
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
              >
                <Save className="w-5 h-5 mr-3" />
                Save Education
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1 py-4 text-lg font-semibold"
              >
                <X className="w-5 h-5 mr-3" />
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EducationForm;