import React, { useState } from 'react';
import { Save, X, User, Mail, Phone, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

const PersonalInfoForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
    dateOfBirth: user?.dateOfBirth || '',
    title: user?.title || '',
    about: user?.about || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    twitter: user?.twitter || ''
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
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Personal Information</h2>
              <p className="text-gray-600">Update your profile details</p>
            </div>
            <Button onClick={onCancel} variant="ghost" className="p-3 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Your full name"
                    required
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Professional Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    className="text-base h-12"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">About Me</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Professional Summary
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                  placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Social Links</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website/Portfolio
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <Input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <Input
                    type="url"
                    value={formData.github}
                    onChange={(e) => handleChange('github', e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="text-base h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Twitter Profile
                  </label>
                  <Input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                    className="text-base h-12"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
              >
                <Save className="w-5 h-5 mr-3" />
                Save Changes
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

export default PersonalInfoForm;