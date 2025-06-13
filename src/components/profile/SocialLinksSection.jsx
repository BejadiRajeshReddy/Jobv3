import React, { useState } from 'react';
import { Edit3, Save, X, Github, Linkedin, Globe, Twitter } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

const SocialLinksSection = ({ socialLinks, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    linkedin: socialLinks.linkedin || '',
    github: socialLinks.github || '',
    portfolio: socialLinks.portfolio || '',
    twitter: socialLinks.twitter || ''
  });

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      linkedin: socialLinks.linkedin || '',
      github: socialLinks.github || '',
      portfolio: socialLinks.portfolio || '',
      twitter: socialLinks.twitter || ''
    });
    setIsEditing(false);
  };

  const socialPlatforms = [
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
    { key: 'github', label: 'GitHub', icon: Github, color: 'text-gray-800' },
    { key: 'portfolio', label: 'Portfolio', icon: Globe, color: 'text-green-600' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="blue">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {socialPlatforms.map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Icon className="w-4 h-4 inline mr-2" />
                {label}
              </label>
              <Input
                value={editForm[key]}
                onChange={(e) => setEditForm({...editForm, [key]: e.target.value})}
                placeholder={`Your ${label} URL`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPlatforms.map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="flex items-center space-x-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                {socialLinks[key] ? (
                  <a
                    href={socialLinks[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm truncate block max-w-48"
                  >
                    {socialLinks[key]}
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">Not provided</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialLinksSection;