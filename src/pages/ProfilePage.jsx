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
    experience: false,
    education: false,
    skills: false,
    social: false,
    resume: false,
  });
  const [editData, setEditData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [mainActiveTab, setMainActiveTab] = useState('overview');
  const [resumeFile, setResumeFile] = useState(null);
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

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF or Word document");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setResumeFile(file);
      setEditData(prev => ({ ...prev, resume: file.name }));
    }
  };

  const handleSave = (section) => {
    const updatedUser = { ...currentUser, ...editData };
    if (profileImage) {
      updatedUser.profileImage = profileImage;
    }
    if (resumeFile) {
      updatedUser.resumeFile = resumeFile.name;
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
    setResumeFile(null);
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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-10 py-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {profileImage || currentUser.profileImage ? (
                    <img
                      src={profileImage || currentUser.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-white">
                      {getInitials(currentUser.name)}
                    </span>
                  )}
                </div>
                <label
                  htmlFor="profileImageInput"
                  className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-700" />
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
                  <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                    {currentUser.name}
                  </h1>
                  <p className="text-2xl text-blue-100 mb-6">
                    {currentUser.jobTitle || 
                     (currentUser.role === "recruiter" ? "Recruiter" : "Job Seeker")}
                  </p>
                  <div className="flex flex-wrap gap-8 text-blue-100">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <span className="text-base">
                        {currentUser.email || currentUser.company?.email}
                      </span>
                    </div>
                    {currentUser.phoneNumber && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5" />
                        <span className="text-base">{currentUser.phoneNumber}</span>
                      </div>
                    )}
                    {currentUser.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <span className="text-base">{currentUser.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Section - Now below header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Complete Your Profile
            </h3>
            <span className="text-4xl font-bold text-blue-600">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="mb-6" />
          <p className="text-base text-gray-600 mb-8">
            Increase your visibility to employers by completing your profile
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Add a bio", completed: !!currentUser.bio },
              { label: "Add skills", completed: currentUser.skills?.length > 0 },
              { label: "Add work experience", completed: (currentUser.experience?.length > 0 || currentUser.workExperience?.length > 0) },
              { label: "Add education", completed: currentUser.education?.length > 0 },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                {item.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                )}
                <span className={`text-base font-medium ${item.completed ? 'text-green-700' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-12 p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            <Button
              onClick={() => setMainActiveTab('overview')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${mainActiveTab === 'overview' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <User className="w-5 h-5 mr-3" />
              Overview
            </Button>
            <Button
              onClick={() => setMainActiveTab('experience')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${mainActiveTab === 'experience' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <Briefcase className="w-5 h-5 mr-3" />
              Experience
            </Button>
            <Button
              onClick={() => setMainActiveTab('education')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${mainActiveTab === 'education' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <GraduationCap className="w-5 h-5 mr-3" />
              Education
            </Button>
            <Button
              onClick={() => setMainActiveTab('skills')}
              variant="ghost"
              className={`rounded-lg px-6 py-3 border-b-2 transition-all ${mainActiveTab === 'skills' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              <Award className="w-5 h-5 mr-3" />
              Skills
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          {/* Left Column - Main Content based on activeTab */}
          <div className="xl:col-span-3 space-y-10">
            {mainActiveTab === 'overview' && (
              <>
                {/* Personal & Contact Information Section with About */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <User className="w-6 h-6 text-blue-600" />
                      Personal & Contact Information
                    </h3>
                    {!isEditing.personal ? (
                      <Button
                        onClick={() => setIsEditing(prev => ({ ...prev, personal: true }))}
                        size="sm"
                        variant="outline"
                        className="px-4 py-2"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleSave('personal')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={() => handleCancel('personal')}
                          size="sm"
                          variant="outline"
                          className="px-4 py-2"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                      <User className="w-6 h-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">
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
                          <p className="text-gray-900 font-medium text-base">{currentUser.name || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                      <Briefcase className="w-6 h-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">
                          Job Title
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.jobTitle || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, jobTitle: e.target.value })
                            }
                            placeholder="Your job title"
                            className="text-base"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-base">{currentUser.jobTitle || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                      <Mail className="w-6 h-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">
                          Email
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.email || currentUser.company?.email || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, email: e.target.value })
                            }
                            placeholder="Your email"
                            className="text-base"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-base">{currentUser.email || currentUser.company?.email || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                      <Phone className="w-6 h-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">
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
                          <p className="text-gray-900 font-medium text-base">{currentUser.phoneNumber || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                      <MapPin className="w-6 h-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">
                          Location
                        </label>
                        {isEditing.personal ? (
                          <Input
                            value={editData.location || ""}
                            onChange={(e) =>
                              setEditData({ ...editData, location: e.target.value })
                            }
                            placeholder="Your location"
                            className="text-base"
                          />
                        ) : (
                          <p className="text-gray-900 font-medium text-base">{currentUser.location || "Not provided"}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                      <Calendar className="w-6 h-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-500 mb-2">
                          Member Since
                        </label>
                        <p className="text-gray-900 font-medium text-base">
                          {new Date(currentUser.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* About Section - Now integrated */}
                  <div className="border-t border-gray-200 pt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">About</h4>
                    {isEditing.personal ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Bio
                        </label>
                        <textarea
                          value={editData.bio || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, bio: e.target.value })
                          }
                          placeholder="Tell us about yourself, your experience, and what you're looking for..."
                          className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed text-base">
                        {currentUser.bio || 
                         "No bio added yet. Click 'Edit' to add information about yourself."}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {mainActiveTab === 'experience' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Experience
                  </h3>
                  {!isEditing.experience ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, experience: true }))}
                      size="sm"
                      variant="outline"
                      className="px-4 py-2"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSave('experience')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel('experience')}
                        size="sm"
                        variant="outline"
                        className="px-4 py-2"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing.experience ? (
                  <>
                    <Button onClick={addExperience} size="sm" variant="outline" className="mb-6 px-4 py-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                    <div className="space-y-8">
                      {editData.experience?.map((exp, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 text-lg">Experience {index + 1}</h4>
                            <Button
                              onClick={() => removeExperience(index)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 px-3 py-2"
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
                          <textarea
                            value={exp.description || ""}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Job description and achievements"
                            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                          />
                        </div>
                      ))}
                      {(!editData.experience || editData.experience.length === 0) && (
                        <p className="text-gray-500 text-center py-8 text-base">
                          No experience added yet. Click "Add Experience" to get started.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {(currentUser.experience?.length > 0 || currentUser.workExperience?.length > 0) ? (
                      <div className="space-y-6">
                        {(currentUser.experience || currentUser.workExperience || []).map((exp, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                            <h4 className="font-bold text-gray-900 text-lg">{exp.title || exp.position}</h4>
                            <p className="text-blue-600 font-medium text-base">{exp.company}</p>
                            <p className="text-sm text-gray-500 mb-3">{exp.duration || exp.period}</p>
                            {exp.description && (
                              <p className="text-gray-600 text-base leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No work experience added yet</p>
                        <p className="text-base">Add your work experience to build credibility</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {mainActiveTab === 'education' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Education
                  </h3>
                  {!isEditing.education ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, education: true }))}
                      size="sm"
                      variant="outline"
                      className="px-4 py-2"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSave('education')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel('education')}
                        size="sm"
                        variant="outline"
                        className="px-4 py-2"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing.education ? (
                  <>
                    <Button onClick={addEducation} size="sm" variant="outline" className="mb-6 px-4 py-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                    <div className="space-y-6">
                      {editData.education?.map((edu, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900 text-lg">Education {index + 1}</h4>
                            <Button
                              onClick={() => removeEducation(index)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 px-3 py-2"
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
                          <Input
                            value={edu.year || ""}
                            onChange={(e) => updateEducation(index, "year", e.target.value)}
                            placeholder="Year (e.g., 2020-2024)"
                            className="text-base"
                          />
                        </div>
                      ))}
                      {(!editData.education || editData.education.length === 0) && (
                        <p className="text-gray-500 text-center py-8 text-base">
                          No education added yet. Click "Add Education" to get started.
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {currentUser.education?.length > 0 ? (
                      <div className="space-y-6">
                        {currentUser.education.map((edu, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-6 py-4">
                            <h4 className="font-bold text-gray-900 text-lg">{edu.degree}</h4>
                            <p className="text-green-600 font-medium text-base">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No education added yet</p>
                        <p className="text-base">Add your educational background</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {mainActiveTab === 'skills' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Award className="w-6 h-6 text-blue-600" />
                    Skills
                  </h3>
                  {!isEditing.skills ? (
                    <Button
                      onClick={() => setIsEditing(prev => ({ ...prev, skills: true }))}
                      size="sm"
                      variant="outline"
                      className="px-4 py-2"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSave('skills')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCancel('skills')}
                        size="sm"
                        variant="outline"
                        className="px-4 py-2"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                
                {isEditing.skills ? (
                  <>
                    <Button onClick={addSkill} size="sm" variant="outline" className="mb-6 px-4 py-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                    <div className="space-y-4">
                      {editData.skills?.map((skill, index) => (
                        <div key={index} className="flex gap-3">
                          <Input
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            placeholder="Enter skill"
                            className="flex-1 text-base"
                          />
                          <Button
                            onClick={() => removeSkill(index)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 px-3 py-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!editData.skills || editData.skills.length === 0) && (
                        <p className="text-gray-500 text-center py-8 text-base">
                          No skills added yet. Click "Add Skill" to get started.
                        </p>
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
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-base font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No skills added yet</p>
                        <p className="text-base">Add your skills to showcase your expertise</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="xl:col-span-1 space-y-8">
            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-blue-600" />
                  Social Links
                </h3>
                {!isEditing.social ? (
                  <Button
                    onClick={() => setIsEditing(prev => ({ ...prev, social: true }))}
                    size="sm"
                    variant="outline"
                    className="px-3 py-2"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSave('social')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={() => handleCancel('social')}
                      size="sm"
                      variant="outline"
                      className="px-3 py-2"
                    >
                      <X className="w-4 h-4 mr-1" />
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
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-500 text-sm">
                      {currentUser.socialLinks?.linkedin || "No LinkedIn profile added"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Github className="w-5 h-5 text-gray-800" />
                    <span className="text-gray-500 text-sm">
                      {currentUser.socialLinks?.github || "No GitHub profile added"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-green-600" />
                    <span className="text-gray-500 text-sm">
                      {currentUser.socialLinks?.portfolio || "No portfolio website added"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Resume Section - Now positioned below Social Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Resume
                </h3>
                {currentUser.resumeFile && !isEditing.resume && (
                  <Button
                    onClick={() => setIsEditing(prev => ({ ...prev, resume: true }))}
                    size="sm"
                    variant="outline"
                    className="px-3 py-2"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Update
                  </Button>
                )}
              </div>
              
              {currentUser.resumeFile && !isEditing.resume ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Resume uploaded</p>
                      <p className="text-sm text-green-600">{currentUser.resumeFile}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setIsEditing(prev => ({ ...prev, resume: true }))}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2 font-medium">
                      {isEditing.resume ? "Upload new resume" : "Upload your resume"}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                    <label htmlFor="resumeUpload" className="cursor-pointer">
                      <Button variant="outline" className="mx-auto px-6 py-2" asChild>
                        <span>Choose File</span>
                      </Button>
                      <input
                        id="resumeUpload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {resumeFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">{resumeFile.name}</p>
                            <p className="text-sm text-blue-600">
                              {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSave('resume')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setResumeFile(null);
                              setIsEditing(prev => ({ ...prev, resume: false }));
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;