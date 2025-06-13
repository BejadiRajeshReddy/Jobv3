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
  Download,
  Eye,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

const CandidateProfile = () => {
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
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role === "recruiter") {
        navigate("/dashboard");
        return;
      }
      setCurrentUser(userData);
      setEditData({
        ...userData,
        skills: userData.skills || [],
        experience: userData.experience || [],
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
      description: "",
      current: false
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
      year: "",
      grade: ""
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
      currentUser.email,
      currentUser.phoneNumber,
      currentUser.bio,
      currentUser.location,
      currentUser.skills?.length > 0,
      currentUser.experience?.length > 0,
      currentUser.education?.length > 0,
      currentUser.profileImage,
      currentUser.socialLinks?.linkedin || currentUser.socialLinks?.github || currentUser.socialLinks?.portfolio,
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
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
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
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-4 h-4 text-gray-700" />
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
                    {currentUser.jobTitle || "Job Seeker"}
                  </p>
                  <div className="flex flex-wrap gap-6 text-blue-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{currentUser.email}</span>
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

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center text-white">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{currentUser.skills?.length || 0}</div>
                  <div className="text-sm text-blue-100">Skills</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{currentUser.experience?.length || 0}</div>
                  <div className="text-sm text-blue-100">Experience</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{completionPercentage}%</div>
                  <div className="text-sm text-blue-100">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {completionPercentage < 80 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Complete Your Profile to Stand Out
                </h3>
                <p className="text-orange-700 mb-4">
                  Profiles with {completionPercentage < 50 ? 'more information' : 'complete details'} get 3x more views from recruiters.
                </p>
                <Progress value={completionPercentage} className="mb-3" />
                <p className="text-sm text-orange-600">
                  {completionPercentage}% complete • Add {completionPercentage < 50 ? 'basic information' : 'remaining details'} to improve visibility
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            <Button
              onClick={() => setActiveTab('overview')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${activeTab === 'overview' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <User className="w-5 h-5 mr-3" />
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab('experience')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${activeTab === 'experience' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              Experience
            </Button>
            <Button
              onClick={() => setActiveTab('education')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${activeTab === 'education' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <GraduationCap className="w-5 h-5 mr-3" />
              Education
            </Button>
            <Button
              onClick={() => setActiveTab('skills')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${activeTab === 'skills' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <Award className="w-5 h-5 mr-3" />
              Skills
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <User className="w-6 h-6 text-blue-600" />
                      Personal Information
                    </h3>
                    {!isEditing.personal ? (
                      <Button
                        onClick={() => setIsEditing(prev => ({ ...prev, personal: true }))}
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-50 hover:text-blue-600"
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
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      {isEditing.personal ? (
                        <Input
                          value={editData.name || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          placeholder="Your full name"
                          className="text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                          {currentUser.name || "Not provided"}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Job Title
                      </label>
                      {isEditing.personal ? (
                        <Input
                          value={editData.jobTitle || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, jobTitle: e.target.value })
                          }
                          placeholder="Your current or desired job title"
                          className="text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                          {currentUser.jobTitle || "Not provided"}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email
                      </label>
                      {isEditing.personal ? (
                        <Input
                          value={editData.email || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          placeholder="Your email address"
                          className="text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                          {currentUser.email || "Not provided"}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      {isEditing.personal ? (
                        <Input
                          value={editData.phoneNumber || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, phoneNumber: e.target.value })
                          }
                          placeholder="Your phone number"
                          className="text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                          {currentUser.phoneNumber || "Not provided"}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Location
                      </label>
                      {isEditing.personal ? (
                        <Input
                          value={editData.location || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, location: e.target.value })
                          }
                          placeholder="Your current location"
                          className="text-base"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                          {currentUser.location || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      About Me
                    </h3>
                    {!isEditing.about ? (
                      <Button
                        onClick={() => setIsEditing(prev => ({ ...prev, about: true }))}
                        size="sm"
                        variant="outline"
                        className="hover:bg-blue-50 hover:text-blue-600"
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
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Professional Summary
                      </label>
                      <textarea
                        value={editData.bio || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, bio: e.target.value })
                        }
                        placeholder="Write a compelling summary about yourself, your experience, skills, and career goals. This is your chance to make a great first impression!"
                        className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Tip: Include your key skills, experience highlights, and what you're looking for in your next role.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6">
                      {currentUser.bio ? (
                        <p className="text-gray-700 leading-relaxed text-base">
                          {currentUser.bio}
                        </p>
                      ) : (
                        <div className="text-center py-8">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500 mb-2">No professional summary added yet</p>
                          <p className="text-sm text-gray-400">
                            Add a compelling summary to showcase your expertise
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'experience' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Work Experience
                  </h3>
                  {!isEditing.experience ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, experience: true }))}
                      size="sm"
                      variant="outline"
                      className="hover:bg-blue-50 hover:text-blue-600"
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
                    <Button onClick={addExperience} size="sm" variant="outline" className="mb-6">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                    <div className="space-y-6">
                      {editData.experience?.map((exp, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900">Experience {index + 1}</h4>
                            <Button
                              onClick={() => removeExperience(index)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={exp.title || ""}
                              onChange={(e) => updateExperience(index, "title", e.target.value)}
                              placeholder="Job title"
                              className="text-base"
                            />
                            <Input
                              value={exp.company || ""}
                              onChange={(e) => updateExperience(index, "company", e.target.value)}
                              placeholder="Company name"
                              className="text-base"
                            />
                          </div>
                          <Input
                            value={exp.duration || ""}
                            onChange={(e) => updateExperience(index, "duration", e.target.value)}
                            placeholder="Duration (e.g., Jan 2020 - Present)"
                            className="text-base"
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={exp.current || false}
                              onChange={(e) => updateExperience(index, "current", e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <label className="text-sm text-gray-600">I currently work here</label>
                          </div>
                          <textarea
                            value={exp.description || ""}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Describe your role, responsibilities, and key achievements..."
                            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                          />
                        </div>
                      ))}
                      {(!editData.experience || editData.experience.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No experience added yet</p>
                          <p className="text-sm">Click "Add Experience" to get started</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {currentUser.experience?.length > 0 ? (
                      <div className="space-y-6">
                        {currentUser.experience.map((exp, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                                <p className="text-blue-600 font-medium">{exp.company}</p>
                                <p className="text-sm text-gray-500 mb-3">{exp.duration}</p>
                                {exp.description && (
                                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                                )}
                              </div>
                              {exp.current && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                  Current
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h4 className="text-lg font-medium mb-2">No work experience added yet</h4>
                        <p className="text-sm mb-4">Showcase your professional experience to attract employers</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'education' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Education
                  </h3>
                  {!isEditing.education ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, education: true }))}
                      size="sm"
                      variant="outline"
                      className="hover:bg-blue-50 hover:text-blue-600"
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
                    <Button onClick={addEducation} size="sm" variant="outline" className="mb-6">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                    <div className="space-y-6">
                      {editData.education?.map((edu, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900">Education {index + 1}</h4>
                            <Button
                              onClick={() => removeEducation(index)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={edu.degree || ""}
                              onChange={(e) => updateEducation(index, "degree", e.target.value)}
                              placeholder="Degree/Course"
                              className="text-base"
                            />
                            <Input
                              value={edu.institution || ""}
                              onChange={(e) => updateEducation(index, "institution", e.target.value)}
                              placeholder="Institution name"
                              className="text-base"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={edu.year || ""}
                              onChange={(e) => updateEducation(index, "year", e.target.value)}
                              placeholder="Year (e.g., 2020-2024)"
                              className="text-base"
                            />
                            <Input
                              value={edu.grade || ""}
                              onChange={(e) => updateEducation(index, "grade", e.target.value)}
                              placeholder="Grade/CGPA (optional)"
                              className="text-base"
                            />
                          </div>
                        </div>
                      ))}
                      {(!editData.education || editData.education.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No education added yet</p>
                          <p className="text-sm">Click "Add Education" to get started</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {currentUser.education?.length > 0 ? (
                      <div className="space-y-6">
                        {currentUser.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-6 py-4">
                            <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="text-green-600 font-medium">{edu.institution}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>{edu.year}</span>
                              {edu.grade && <span>Grade: {edu.grade}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h4 className="text-lg font-medium mb-2">No education added yet</h4>
                        <p className="text-sm mb-4">Add your educational background to build credibility</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Award className="w-6 h-6 text-blue-600" />
                    Skills & Expertise
                  </h3>
                  {!isEditing.skills ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, skills: true }))}
                      size="sm"
                      variant="outline"
                      className="hover:bg-blue-50 hover:text-blue-600"
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
                    <Button onClick={addSkill} size="sm" variant="outline" className="mb-6">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                    <div className="space-y-3">
                      {editData.skills?.map((skill, index) => (
                        <div key={index} className="flex gap-3">
                          <Input
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            placeholder="Enter skill (e.g., JavaScript, React, Python)"
                            className="flex-1 text-base"
                          />
                          <Button
                            onClick={() => removeSkill(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!editData.skills || editData.skills.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No skills added yet</p>
                          <p className="text-sm">Click "Add Skill" to showcase your expertise</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {currentUser.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {currentUser.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium border border-blue-300 hover:shadow-md transition-shadow"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h4 className="text-lg font-medium mb-2">No skills added yet</h4>
                        <p className="text-sm mb-4">Add your skills to showcase your expertise to employers</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Profile Strength */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Profile Strength</h3>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <Progress value={completionPercentage} className="mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Complete your profile to increase visibility to employers
              </p>
              <div className="space-y-3">
                {[
                  { label: "Add professional photo", completed: !!currentUser.profileImage, points: 10 },
                  { label: "Write about yourself", completed: !!currentUser.bio, points: 15 },
                  { label: "Add skills", completed: currentUser.skills?.length > 0, points: 15 },
                  { label: "Add work experience", completed: currentUser.experience?.length > 0, points: 20 },
                  { label: "Add education", completed: currentUser.education?.length > 0, points: 15 },
                  { label: "Add contact details", completed: !!(currentUser.phoneNumber && currentUser.location), points: 10 },
                  { label: "Add social links", completed: !!(currentUser.socialLinks?.linkedin || currentUser.socialLinks?.github), points: 15 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={`text-sm ${item.completed ? 'text-green-700' : 'text-gray-600'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">+{item.points}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-blue-600" />
                  Social Links
                </h3>
                {!isEditing.social ? (
                  <Button
                    onClick={() => setIsEditing(prev => ({ ...prev, social: true }))}
                    size="sm"
                    variant="outline"
                    className="hover:bg-blue-50 hover:text-blue-600"
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
                <div className="space-y-4">
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
                      className="flex-1 text-sm"
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
                      className="flex-1 text-sm"
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
                      className="flex-1 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { icon: Linkedin, label: "LinkedIn", value: currentUser.socialLinks?.linkedin, color: "text-blue-600" },
                    { icon: Github, label: "GitHub", value: currentUser.socialLinks?.github, color: "text-gray-800" },
                    { icon: Globe, label: "Portfolio", value: currentUser.socialLinks?.portfolio, color: "text-green-600" },
                  ].map((social, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <social.icon className={`w-5 h-5 ${social.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">{social.label}</p>
                        {social.value ? (
                          <a
                            href={social.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline truncate block"
                          >
                            {social.value}
                          </a>
                        ) : (
                          <p className="text-xs text-gray-500">Not added</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Resume
                </h3>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-2 font-medium">Upload your resume</p>
                <p className="text-sm text-gray-500 mb-4">
                  PDF, DOC, DOCX up to 5MB
                </p>
                <Button variant="outline" className="mx-auto">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
              {currentUser.resume && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Resume uploaded</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;