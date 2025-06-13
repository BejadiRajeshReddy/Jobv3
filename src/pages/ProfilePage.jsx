import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Award,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Upload,
  FileText,
  Plus,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState({
    personal: false,
    about: false,
    experience: false,
    education: false,
    skills: false,
    social: false,
  });
  const [editData, setEditData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [mainActiveTab, setMainActiveTab] = useState('overview'); // New state for main tabs
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      setEditData({
        ...userData,
        skills: userData.skills || [],
        experience: userData.experience || [],
        workExperience: userData.workExperience || [],
        education: userData.education || [],
        socialLinks: userData.socialLinks || {
          linkedin: "",
          github: "",
          portfolio: ""
        }
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setEditData(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (section) => {
    const updatedUser = { ...currentUser, ...editData };
    if (profileImage) {
      updatedUser.profileImage = profileImage;
    }

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setIsEditing(prev => ({ ...prev, [section]: false }));

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
    }

    window.dispatchEvent(new Event("userStateChanged"));
  };

  const handleCancel = (section) => {
    setEditData({
      ...currentUser,
      skills: currentUser.skills || [],
      experience: currentUser.experience || [],
      workExperience: currentUser.workExperience || [],
      education: currentUser.education || [],
      socialLinks: currentUser.socialLinks || {
        linkedin: "",
        github: "",
        portfolio: ""
      }
    });
    setIsEditing(prev => ({ ...prev, [section]: false }));
    setProfileImage(null);
  };

  // Skills management
  const addSkill = () => {
    setEditData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), ""]
    }));
  };

  const updateSkill = (index, value) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Experience management
  const addExperience = () => {
    const newExp = {
      title: "",
      company: "",
      duration: "",
      description: ""
    };
    setEditData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExp]
    }));
  };

  const updateExperience = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setEditData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education management
  const addEducation = () => {
    const newEdu = {
      degree: "",
      institution: "",
      year: ""
    };
    setEditData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
  };

  const updateEducation = (index, field, value) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setEditData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const calculateProfileCompletion = () => {
    if (!currentUser) return 0;
    
    const fields = [
      currentUser.name,
      currentUser.email || currentUser.company?.email,
      currentUser.phoneNumber,
      currentUser.bio,
      currentUser.skills?.length > 0,
      currentUser.experience?.length > 0 || currentUser.workExperience?.length > 0,
      currentUser.education?.length > 0,
      currentUser.location,
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-8 py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {profileImage || currentUser.profileImage ? (
                    <img
                      src={profileImage || currentUser.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {getInitials(currentUser.name)}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="profileImageInput"
                  className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-md hover:bg-gray-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-black" />
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    {currentUser.name}
                  </h1>
                  <p className="text-xl text-blue-100 mb-4">
                    {currentUser.jobTitle || 
                     (currentUser.role === "recruiter" ? "Recruiter" : "Job Seeker")}
                  </p>
                  <div className="flex flex-wrap gap-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">
                        {currentUser.email || currentUser.company?.email}
                      </span>
                    </div>
                    {currentUser.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{currentUser.phoneNumber}</span>
                      </div>
                    )}
                    {currentUser.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{currentUser.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-4">
          <div className="flex border-b border-gray-200">
            <Button
              onClick={() => setMainActiveTab('overview')}
              variant="ghost"
              className={`rounded-none border-b-2 ${mainActiveTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              <User className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              onClick={() => setMainActiveTab('experience')}
              variant="ghost"
              className={`rounded-none border-b-2 ${mainActiveTab === 'experience' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Experience
            </Button>
            <Button
              onClick={() => setMainActiveTab('education')}
              variant="ghost"
              className={`rounded-none border-b-2 ${mainActiveTab === 'education' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Education
            </Button>
            <Button
              onClick={() => setMainActiveTab('skills')}
              variant="ghost"
              className={`rounded-none border-b-2 ${mainActiveTab === 'skills' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            >
              <Award className="w-4 h-4 mr-2" />
              Skills
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content based on activeTab */}
          <div className="lg:col-span-2 space-y-8">
            {mainActiveTab === 'overview' && (
              <>
                {/* Personal & Contact Information Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal & Contact Information
                    </h3>
                    {!isEditing.personal ? (
                      <Button
                        onClick={() => setIsEditing(prev => ({ ...prev, personal: true }))}
                        size="sm"
                        variant="outline"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave('personal')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={() => handleCancel('personal')}
                          size="sm"
                          variant="outline"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Full Name
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.name || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                            placeholder="Your full name"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{currentUser.name || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Job Title
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.jobTitle || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, jobTitle: e.target.value })
                            }
                            placeholder="Your job title"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{currentUser.jobTitle || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.email || currentUser.company?.email || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, email: e.target.value })
                            }
                            placeholder="Your email"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{currentUser.email || currentUser.company?.email || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Phone Number
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.phoneNumber || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, phoneNumber: e.target.value })
                            }
                            placeholder="Your phone number"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{currentUser.phoneNumber || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Location
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.location || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, location: e.target.value })
                            }
                            placeholder="Your location"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{currentUser.location || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Member Since
                        </label>
                        <p className="text-gray-900 font-medium">
                          {new Date(currentUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      About
                    </h3>
                    {!isEditing.about ? (
                      <Button
                        onClick={() => setIsEditing(prev => ({ ...prev, about: true }))}
                        size="sm"
                        variant="outline"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave('about')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={() => handleCancel('about')}
                          size="sm"
                          variant="outline"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  {isEditing.about ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={editData.bio || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself, your experience, and what you're looking for..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {currentUser.bio || 
                       "No bio added yet. Click 'Edit Profile' to add information about yourself."}
                    </p>
                  )}
                </div>
              </>
            )}

            {mainActiveTab === 'experience' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </h3>
                  {!isEditing.experience ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, experience: true }))}
                      size="sm"
                      variant="outline"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave('experience')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel('experience')}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing.experience ? (
                  <>
                    <Button onClick={addExperience} size="sm" variant="outline" className="mb-4">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Experience
                    </Button>
                    <div className="space-y-6">
                      {editData.experience?.map((exp, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                            <Button
                              onClick={() => removeExperience(index)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={exp.title || ""}
                              onChange={(e) => updateExperience(index, "title", e.target.value)}
                              placeholder="Job title"
                            />
                            <Input
                              value={exp.company || ""}
                              onChange={(e) => updateExperience(index, "company", e.target.value)}
                              placeholder="Company name"
                            />
                          </div>
                          <Input
                            value={exp.duration || ""}
                            onChange={(e) => updateExperience(index, "duration", e.target.value)}
                            placeholder="Duration (e.g., Jan 2020 - Present)"
                          />
                          <textarea
                            value={exp.description || ""}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Job description and achievements"
                            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                        </div>
                      ))}
                      {(!editData.experience || editData.experience.length === 0) && (
                        <p className="text-gray-500 text-center py-4">
                          No experience added yet. Click "Add Experience" to get started.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {(currentUser.experience?.length > 0 || currentUser.workExperience?.length > 0) ? (
                      <div className="space-y-4">
                        {(currentUser.experience || currentUser.workExperience || []).map((exp, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-gray-900">{exp.title || exp.position}</h4>
                            <p className="text-blue-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">{exp.duration || exp.period}</p>
                            {exp.description && (
                              <p className="text-gray-600 mt-2">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No work experience added yet</p>
                        <p className="text-sm">Add your work experience to build credibility</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {mainActiveTab === 'education' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h3>
                  {!isEditing.education ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, education: true }))}
                      size="sm"
                      variant="outline"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave('education')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel('education')}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing.education ? (
                  <>
                    <Button onClick={addEducation} size="sm" variant="outline" className="mb-4">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Education
                    </Button>
                    <div className="space-y-4">
                      {editData.education?.map((edu, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                            <Button
                              onClick={() => removeEducation(index)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              value={edu.degree || ""}
                              onChange={(e) => updateEducation(index, "degree", e.target.value)}
                              placeholder="Degree/Course"
                            />
                            <Input
                              value={edu.institution || ""}
                              onChange={(e) => updateEducation(index, "institution", e.target.value)}
                              placeholder="Institution name"
                            />
                          </div>
                          <Input
                            value={edu.year || ""}
                            onChange={(e) => updateEducation(index, "year", e.target.value)}
                            placeholder="Year (e.g., 2020-2024)"
                          />
                        </div>
                      ))}
                      {(!editData.education || editData.education.length === 0) && (
                        <p className="text-gray-500 text-center py-4">
                          No education added yet. Click "Add Education" to get started.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {currentUser.education?.length > 0 ? (
                      <div className="space-y-4">
                        {currentUser.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4">
                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="text-green-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No education added yet</p>
                        <p className="text-sm">Add your educational background</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {mainActiveTab === 'skills' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills
                  </h3>
                  {!isEditing.skills ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, skills: true }))}
                      size="sm"
                      variant="outline"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSave('skills')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel('skills')}
                        size="sm"
                        variant="outline"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                
                {isEditing.skills ? (
                  <>
                    <Button onClick={addSkill} size="sm" variant="outline" className="mb-4">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Skill
                    </Button>
                    <div className="space-y-3">
                      {editData.skills?.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            placeholder="Enter skill"
                            className="flex-1"
                          />
                          <Button
                            onClick={() => removeSkill(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!editData.skills || editData.skills.length === 0) && (
                        <p className="text-gray-500 text-center py-4">
                          No skills added yet. Click "Add Skill" to get started.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {currentUser.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentUser.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No skills added yet</p>
                        <p className="text-sm">Add your skills to showcase your expertise</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Complete Your Profile
                </h3>
                <span className="text-2xl font-bold text-blue-600">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Increase your visibility to employers by completing your profile
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Add a bio", completed: !!currentUser.bio },
                  { label: "Add skills", completed: currentUser.skills?.length > 0 },
                  { label: "Add work experience", completed: (currentUser.experience?.length > 0 || currentUser.workExperience?.length > 0) },
                  { label: "Add education", completed: currentUser.education?.length > 0 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-sm ${item.completed ? 'text-green-700' : 'text-gray-600'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Social Links
                </h3>
                {!isEditing.social ? (
                  <Button
                    onClick={() => setIsEditing(prev => ({ ...prev, social: true }))}
                    size="sm"
                    variant="outline"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave('social')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={() => handleCancel('social')}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
              
              {isEditing.social ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <Input
                      value={editData.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          socialLinks: {
                            ...editData.socialLinks,
                            linkedin: e.target.value
                          }
                        })
                      }
                      placeholder="LinkedIn profile URL"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-800" />
                    <Input
                      value={editData.socialLinks?.github || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          socialLinks: {
                            ...editData.socialLinks,
                            github: e.target.value
                          }
                        })
                      }
                      placeholder="GitHub profile URL"
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-green-600" />
                    <Input
                      value={editData.socialLinks?.portfolio || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          socialLinks: {
                            ...editData.socialLinks,
                            portfolio: e.target.value
                          }
                        })
                      }
                      placeholder="Portfolio website URL"
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-500">
                      {currentUser.socialLinks?.linkedin || "No LinkedIn profile added"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Github className="w-5 h-5 text-gray-800" />
                    <span className="text-gray-500">
                      {currentUser.socialLinks?.github || "No GitHub profile added"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                    <span className="text-gray-500">
                      {currentUser.socialLinks?.portfolio || "No portfolio website added"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Resume
                </h3>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Upload your resume</p>
                <p className="text-sm text-gray-500 mb-4">
                  PDF, DOC, DOCX up to 5MB
                </p>
                <Button variant="outline" className="mx-auto">
                  Choose File
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;