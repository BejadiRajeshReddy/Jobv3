import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Code } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const SkillsSection = ({ skills, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'technical',
    proficiency: 'intermediate'
  });

  const categories = [
    { value: 'technical', label: 'Technical Skills', color: 'bg-blue-100 text-blue-800' },
    { value: 'soft', label: 'Soft Skills', color: 'bg-green-100 text-green-800' },
    { value: 'language', label: 'Languages', color: 'bg-purple-100 text-purple-800' },
    { value: 'tool', label: 'Tools & Software', color: 'bg-orange-100 text-orange-800' }
  ];

  const proficiencyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-gray-100 text-gray-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-blue-100 text-blue-800' },
    { value: 'expert', label: 'Expert', color: 'bg-green-100 text-green-800' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'technical',
      proficiency: 'intermediate'
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('Please enter a skill name');
      return;
    }

    const newSkill = {
      ...formData,
      id: editingId || Date.now().toString()
    };

    let updatedSkills;
    if (editingId) {
      updatedSkills = skills.map(skill => 
        skill.id === editingId ? newSkill : skill
      );
    } else {
      updatedSkills = [...skills, newSkill];
    }

    onUpdate(updatedSkills);
    resetForm();
  };

  const handleEdit = (skill) => {
    setFormData(skill);
    setEditingId(skill.id);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      const updatedSkills = skills.filter(skill => skill.id !== id);
      onUpdate(updatedSkills);
    }
  };

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  const getProficiencyInfo = (proficiency) => {
    return proficiencyLevels.find(level => level.value === proficiency) || proficiencyLevels[1];
  };

  const groupedSkills = categories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.value)
  })).filter(group => group.skills.length > 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        <Button onClick={() => setIsAdding(true)} variant="blue">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {isAdding && (
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Skill' : 'Add New Skill'}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. React, JavaScript, Communication"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proficiency Level</label>
              <Select value={formData.proficiency} onValueChange={(value) => setFormData({...formData, proficiency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {skills.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills added yet</h3>
            <p className="text-gray-600 mb-4">Add your skills to showcase your expertise and capabilities</p>
            <Button onClick={() => setIsAdding(true)} variant="blue">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        ) : (
          groupedSkills.map((group) => (
            <div key={group.value}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-3 ${group.color.split(' ')[0]}`}></span>
                {group.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.skills.map((skill) => {
                  const proficiencyInfo = getProficiencyInfo(skill.proficiency);
                  return (
                    <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleEdit(skill)}
                            variant="outline"
                            size="sm"
                            className="p-1 h-8 w-8"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(skill.id)}
                            variant="outline"
                            size="sm"
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${proficiencyInfo.color}`}>
                        {proficiencyInfo.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillsSection;