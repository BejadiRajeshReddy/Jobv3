import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Code, Star } from 'lucide-react';
import { Button } from '../ui/Button';
import SkillForm from './SkillForm';

const SkillsSection = ({ skills, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  const handleAdd = () => {
    setEditingSkill(null);
    setShowForm(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      const updated = skills.filter(skill => skill.id !== id);
      onUpdate(updated);
    }
  };

  const handleSave = (skillData) => {
    let updated;
    if (editingSkill) {
      updated = skills.map(skill => 
        skill.id === editingSkill.id ? { ...skillData, id: editingSkill.id } : skill
      );
    } else {
      updated = [...skills, { ...skillData, id: Date.now().toString() }];
    }
    onUpdate(updated);
    setShowForm(false);
    setEditingSkill(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-red-100 text-red-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProficiencyStars = (level) => {
    const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    return levels[level] || 0;
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
          <p className="text-gray-600">Your technical and professional skills</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills added</h3>
          <p className="text-gray-600 mb-6">Add your skills to showcase your expertise</p>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Code className="w-6 h-6 mr-3 text-blue-600" />
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{skill.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                            {skill.proficiency}
                          </span>
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < getProficiencyStars(skill.proficiency)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(skill)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(skill.id)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {skill.description && (
                      <p className="text-sm text-gray-600">{skill.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SkillForm
          skill={editingSkill}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default SkillsSection;