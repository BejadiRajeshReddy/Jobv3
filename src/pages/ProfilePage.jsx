import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Upload,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Building,
  DollarSign,
  Clock,
  Globe,
  Github,
  Linkedin,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(user);
    setCurrentUser(userData);
    setEditData(userData);
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem("currentUser", JSON.stringify(editData));
    setCurrentUser(editData);
    setIsEditing(false);
    
    // Update in users array as well
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map(user => 
      user.id === editData.id ? editData : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Dispatch event to update navbar
    window.dispatchEvent(new Event('userStateChanged'));
  };

  const handleCancel = () => {
    setEditData(currentUser);
    setIsEditing(false);
  };

  const addSkill = () => {
    const newSkill = prompt("Enter a skill:");
    if (newSkill && newSkill.trim()) {
      setEditData({
        ...editData,
        skills: [...(editData.skills || []), newSkill.trim()]
      });
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = editData.skills.filter((_, i) => i !== index);
    setEditData({ ...editData, skills: updatedSkills });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    };
    setEditData({
      ...editData,
      experience: [...(editData.experience || []), newExp]
    });
  };

  const updateExperience = (index, field, value) => {
    const updatedExp = editData.experience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    setEditData({ ...editData, experience: updatedExp });
  };

  const removeExperience = (index) => {
    const updatedExp = editData.experience.filter((_, i) => i !== index);
    setEditData({ ...editData, experience: updatedExp });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: ""
    };
    setEditData({
      ...editData,
      education: [...(editData.education || []), newEdu]
    });
  };

  const updateEducation = (index, field, value) => {
    const updatedEdu = editData.education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    setEditData({ ...editData, education: updatedEdu });
  };

  const removeEducation = (index) => {
    const updatedEdu = editData.education.filter((_, i) => i !== index);
    setEditData({ ...editData, education: updatedEdu });
  };

  const getProfileCompleteness = () => {
    if (!currentUser) return 0;
    
    const fields = [
      currentUser.name,
      currentUser.email || currentUser.company?.email,
      currentUser.phoneNumber,
      currentUser.location,
      currentUser.bio,
      currentUser.skills?.length > 0,
      currentUser.experience?.length > 0 || currentUser.company,
      currentUser.education?.length > 0
    ];
    
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completeness = getProfileCompleteness();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 sm:mb-8">
          {/* Cover Photo */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-400 to-blue-500 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            {isEditing && (
              <button className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-white/30 transition-colors">
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="relative px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
              {/* Profile Picture */}
              <div className="relative -mt-12 sm:-mt-16 mb-4 sm:mb-0 flex justify-center sm:justify-start">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
                    {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-600 rounded-full p-1.5 sm:p-2 text-white shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                )}
              </div>

              {/* Name and Title */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editData.name || ""}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="text-xl sm:text-2xl font-bold border-2 border-blue-200 focus:border-blue-500 text-center sm:text-left"
                      placeholder="Your name"
                    />
                    <Input
                      value={editData.title || ""}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 text-center sm:text-left"
                      placeholder="Your job title"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {currentUser.name}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-2">
                      {currentUser.title || (currentUser.role === "recruiter" ? "Recruiter" : "Job Seeker")}
                    </p>
                  </>
                )}
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  {currentUser.location && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="truncate">{currentUser.location}</span>
                    </div>
                  )}
                  {currentUser.email && (
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                  )}
                  {currentUser.company?.email && (
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="truncate">{currentUser.company.email}</span>
                    </div>
                  )}
                  {currentUser.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="truncate">{currentUser.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0 w-full sm:w-auto">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="blue" className="w-full sm:w-auto">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Card */}
        {completeness < 100 && (
          <Card className="mb-6 sm:mb-8 border-l-4 border-l-blue-500 bg-blue-50/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
                  <p className="text-gray-600">Increase your visibility to employers</p>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-2xl font-bold text-blue-600">{completeness}%</div>
                  <div className="text-sm text-gray-500">Complete</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completeness}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {!currentUser.bio && (
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                    <span>Add a bio</span>
                  </div>
                )}
                {(!currentUser.skills || currentUser.skills.length === 0) && (
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                    <span>Add skills</span>
                  </div>
                )}
                {(!currentUser.experience || currentUser.experience.length === 0) && currentUser.role !== "recruiter" && (
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                    <span>Add work experience</span>
                  </div>
                )}
                {(!currentUser.education || currentUser.education.length === 0) && (
                  <div className="flex items-center text-gray-600">
                    <AlertCircle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0" />
                    <span>Add education</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 sm:mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max" aria-label="Tabs">
              {[
                { id: "overview", name: "Overview", icon: User },
                { id: "experience", name: "Experience", icon: Briefcase },
                { id: "education", name: "Education", icon: GraduationCap },
                { id: "skills", name: "Skills", icon: Award },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.slice(0, 4)}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Bio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  {isEditing ? (
                    <textarea
                      value={editData.bio || ""}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-sm sm:text-base"
                      placeholder="Tell us about yourself, your experience, and what you're looking for..."
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {currentUser.bio || "No bio added yet. Click 'Edit Profile' to add information about yourself."}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-gray-500">Email</div>
                        <div className="font-medium text-sm sm:text-base truncate">
                          {currentUser.email || currentUser.company?.email || "Not provided"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-gray-500">Phone</div>
                        <div className="font-medium text-sm sm:text-base truncate">{currentUser.phoneNumber || "Not provided"}</div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-gray-500">Location</div>
                        {isEditing ? (
                          <Input
                            value={editData.location || ""}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            placeholder="Your location"
                            className="mt-1 text-sm"
                          />
                        ) : (
                          <div className="font-medium text-sm sm:text-base truncate">{currentUser.location || "Not provided"}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm text-gray-500">Member Since</div>
                        <div className="font-medium text-sm sm:text-base truncate">
                          {new Date(currentUser.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information (for recruiters) */}
                {currentUser.role === "recruiter" && currentUser.company && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg flex items-center justify-center shadow-sm mx-auto sm:mx-0 flex-shrink-0">
                          <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                            {currentUser.company.name}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center justify-center sm:justify-start text-gray-600">
                              <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{currentUser.company.industry}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start text-gray-600">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{currentUser.company.location}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start text-gray-600">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                              <span className="truncate">{currentUser.company.email}</span>
                            </div>
                            {currentUser.company.website && (
                              <div className="flex items-center justify-center sm:justify-start text-gray-600">
                                <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                <a 
                                  href={currentUser.company.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 truncate"
                                >
                                  Company Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                  {isEditing && (
                    <Button onClick={addExperience} variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </div>

                {(!editData.experience || editData.experience.length === 0) ? (
                  <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                    <Briefcase className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">No work experience added yet.</p>
                    {isEditing && (
                      <Button onClick={addExperience} variant="blue" className="mt-4">
                        Add Your First Experience
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editData.experience.map((exp, index) => (
                      <div key={exp.id || index} className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 lg:mr-4">
                                <Input
                                  value={exp.title || ""}
                                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                                  placeholder="Job Title"
                                  className="text-sm"
                                />
                                <Input
                                  value={exp.company || ""}
                                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                                  placeholder="Company"
                                  className="text-sm"
                                />
                                <Input
                                  value={exp.location || ""}
                                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                                  placeholder="Location"
                                  className="text-sm"
                                />
                                <div className="flex space-x-2">
                                  <Input
                                    type="date"
                                    value={exp.startDate || ""}
                                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                                    placeholder="Start Date"
                                    className="text-sm"
                                  />
                                  <Input
                                    type="date"
                                    value={exp.endDate || ""}
                                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                                    placeholder="End Date"
                                    disabled={exp.current}
                                    className="text-sm"
                                  />
                                </div>
                              </div>
                              <Button
                                onClick={() => removeExperience(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 w-full sm:w-auto lg:w-auto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={exp.current || false}
                                onChange={(e) => updateExperience(index, "current", e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm text-gray-600">I currently work here</label>
                            </div>
                            <textarea
                              value={exp.description || ""}
                              onChange={(e) => updateExperience(index, "description", e.target.value)}
                              placeholder="Describe your role and achievements..."
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] text-sm"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                              <div className="text-center sm:text-left">
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900">{exp.title}</h4>
                                <p className="text-blue-600 font-medium text-sm sm:text-base">{exp.company}</p>
                                <p className="text-gray-500 text-xs sm:text-sm">{exp.location}</p>
                              </div>
                              <div className="text-center sm:text-right text-xs sm:text-sm text-gray-500">
                                {exp.startDate && (
                                  <div>
                                    {new Date(exp.startDate).toLocaleDateString()} - {" "}
                                    {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                                  </div>
                                )}
                              </div>
                            </div>
                            {exp.description && (
                              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{exp.description}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                  {isEditing && (
                    <Button onClick={addEducation} variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  )}
                </div>

                {(!editData.education || editData.education.length === 0) ? (
                  <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                    <GraduationCap className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">No education details added yet.</p>
                    {isEditing && (
                      <Button onClick={addEducation} variant="blue" className="mt-4">
                        Add Your Education
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editData.education.map((edu, index) => (
                      <div key={edu.id || index} className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 lg:mr-4">
                                <Input
                                  value={edu.degree || ""}
                                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                  placeholder="Degree"
                                  className="text-sm"
                                />
                                <Input
                                  value={edu.institution || ""}
                                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                                  placeholder="Institution"
                                  className="text-sm"
                                />
                                <Input
                                  value={edu.location || ""}
                                  onChange={(e) => updateEducation(index, "location", e.target.value)}
                                  placeholder="Location"
                                  className="text-sm"
                                />
                                <Input
                                  value={edu.gpa || ""}
                                  onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                                  placeholder="GPA (optional)"
                                  className="text-sm"
                                />
                                <Input
                                  type="date"
                                  value={edu.startDate || ""}
                                  onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                                  placeholder="Start Date"
                                  className="text-sm"
                                />
                                <Input
                                  type="date"
                                  value={edu.endDate || ""}
                                  onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                                  placeholder="End Date"
                                  disabled={edu.current}
                                  className="text-sm"
                                />
                              </div>
                              <Button
                                onClick={() => removeEducation(index)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 w-full sm:w-auto lg:w-auto"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={edu.current || false}
                                onChange={(e) => updateEducation(index, "current", e.target.checked)}
                                className="mr-2"
                              />
                              <label className="text-sm text-gray-600">I currently study here</label>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                              <div className="text-center sm:text-left">
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900">{edu.degree}</h4>
                                <p className="text-blue-600 font-medium text-sm sm:text-base">{edu.institution}</p>
                                <p className="text-gray-500 text-xs sm:text-sm">{edu.location}</p>
                                {edu.gpa && (
                                  <p className="text-gray-600 text-xs sm:text-sm">GPA: {edu.gpa}</p>
                                )}
                              </div>
                              <div className="text-center sm:text-right text-xs sm:text-sm text-gray-500">
                                {edu.startDate && (
                                  <div>
                                    {new Date(edu.startDate).toLocaleDateString()} - {" "}
                                    {edu.current ? "Present" : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                  {isEditing && (
                    <Button onClick={addSkill} variant="outline" size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </div>

                {(!editData.skills || editData.skills.length === 0) ? (
                  <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
                    <Award className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">No skills added yet.</p>
                    {isEditing && (
                      <Button onClick={addSkill} variant="blue" className="mt-4">
                        Add Your Skills
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {editData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                      >
                        <span className="truncate max-w-[120px] sm:max-w-none">{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800 flex-shrink-0"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Social Links & Resume Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Social Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                    <Input
                      value={editData.linkedinUrl || ""}
                      onChange={(e) => setEditData({ ...editData, linkedinUrl: e.target.value })}
                      placeholder="LinkedIn profile URL"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Github className="h-4 w-4 sm:h-5 sm:w-5 text-gray-800 flex-shrink-0" />
                    <Input
                      value={editData.githubUrl || ""}
                      onChange={(e) => setEditData({ ...editData, githubUrl: e.target.value })}
                      placeholder="GitHub profile URL"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                    <Input
                      value={editData.portfolioUrl || ""}
                      onChange={(e) => setEditData({ ...editData, portfolioUrl: e.target.value })}
                      placeholder="Portfolio website URL"
                      className="text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentUser.linkedinUrl ? (
                    <a
                      href={currentUser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                    >
                      <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <span className="truncate">LinkedIn Profile</span>
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                    </a>
                  ) : (
                    <div className="flex items-center text-gray-400 text-sm sm:text-base">
                      <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <span>No LinkedIn profile added</span>
                    </div>
                  )}
                  
                  {currentUser.githubUrl ? (
                    <a
                      href={currentUser.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-800 hover:text-gray-600 text-sm sm:text-base"
                    >
                      <Github className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <span className="truncate">GitHub Profile</span>
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                    </a>
                  ) : (
                    <div className="flex items-center text-gray-400 text-sm sm:text-base">
                      <Github className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <span>No GitHub profile added</span>
                    </div>
                  )}
                  
                  {currentUser.portfolioUrl ? (
                    <a
                      href={currentUser.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 text-sm sm:text-base"
                    >
                      <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <span className="truncate">Portfolio Website</span>
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                    </a>
                  ) : (
                    <div className="flex items-center text-gray-400 text-sm sm:text-base">
                      <Globe className="h-4 w-4 sm:h-5 sm:w-5 mr-3 flex-shrink-0" />
                      <span>No portfolio website added</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resume Upload */}
          {currentUser.role !== "recruiter" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">Upload your resume</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4">PDF, DOC, DOCX up to 5MB</p>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Choose File
                  </Button>
                </div>
                {currentUser.resumeUrl && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center text-green-700 text-sm">
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                      <span>Resume uploaded</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;