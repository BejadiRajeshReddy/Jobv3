import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  Calendar,
  Building,
  GraduationCap,
  Briefcase,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";

const CandidateProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingSection, setEditingSection] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    about: "",
  });
  
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
  });
  
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  
  // New item forms
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    gpa: "",
    description: "",
  });
  
  const [newSkill, setNewSkill] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== "candidate") {
        navigate("/dashboard");
        return;
      }
      
      setCurrentUser(userData);
      loadUserProfile(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const loadUserProfile = (userData) => {
    setPersonalInfo({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phoneNumber || "",
      location: userData.location || "",
      jobTitle: userData.jobTitle || "",
      about: userData.about || "",
    });
    
    setSocialLinks(userData.socialLinks || {
      linkedin: "",
      github: "",
      portfolio: "",
      website: "",
    });
    
    setExperience(userData.experience || []);
    setEducation(userData.education || []);
    setSkills(userData.skills || []);
  };

  const saveProfile = () => {
    const updatedUser = {
      ...currentUser,
      ...personalInfo,
      phoneNumber: personalInfo.phone,
      socialLinks,
      experience,
      education,
      skills,
    };

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem("users", JSON.stringify(users));
    }
    
    setCurrentUser(updatedUser);
    window.dispatchEvent(new Event("userStateChanged"));
  };

  const handlePersonalInfoSave = () => {
    saveProfile();
    setEditingSection(null);
  };

  const handleSocialLinksSave = () => {
    saveProfile();
    setEditingSection(null);
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      const experienceWithId = {
        ...newExperience,
        id: Date.now().toString(),
      };
      setExperience([...experience, experienceWithId]);
      setNewExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
      saveProfile();
    }
  };

  const removeExperience = (id) => {
    setExperience(experience.filter(exp => exp.id !== id));
    saveProfile();
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      const educationWithId = {
        ...newEducation,
        id: Date.now().toString(),
      };
      setEducation([...education, educationWithId]);
      setNewEducation({
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
        description: "",
      });
      saveProfile();
    }
  };

  const removeEducation = (id) => {
    setEducation(education.filter(edu => edu.id !== id));
    saveProfile();
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      saveProfile();
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
    saveProfile();
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setUploadError("");
    setUploadSuccess(false);
    
    if (!file) {
      setResumeFile(null);
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    setUploadSuccess(true);
    
    // Auto-save after 1 second
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const syntheticEvent = {
        target: {
          files: [file],
          value: ""
        }
      };
      handleResumeChange(syntheticEvent);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600 mt-2">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  {currentUser.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl sm:text-4xl font-bold text-white">
                      {getInitials(personalInfo.name)}
                    </span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left text-white">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {personalInfo.name || "Your Name"}
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-4">
                  {personalInfo.jobTitle || "Job Seeker"}
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{personalInfo.email}</span>
                  </div>
                  {personalInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{personalInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-8 text-center text-white">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">{skills.length}</div>
                  <div className="text-blue-100 text-sm">Skills</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">{experience.length}</div>
                  <div className="text-blue-100 text-sm">Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 p-4 sm:p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            <Button
              onClick={() => setActiveTab('overview')}
              variant="ghost"
              className={`rounded-lg px-4 sm:px-6 py-3 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === 'overview' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Info</span>
            </Button>
            <Button
              onClick={() => setActiveTab('experience')}
              variant="ghost"
              className={`rounded-lg px-4 sm:px-6 py-3 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === 'experience' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-5 h-5 mr-2 sm:mr-3" />
              Experience
            </Button>
            <Button
              onClick={() => setActiveTab('education')}
              variant="ghost"
              className={`rounded-lg px-4 sm:px-6 py-3 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === 'education' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="w-5 h-5 mr-2 sm:mr-3" />
              Education
            </Button>
            <Button
              onClick={() => setActiveTab('skills')}
              variant="ghost"
              className={`rounded-lg px-4 sm:px-6 py-3 border-b-2 transition-all text-sm sm:text-base ${
                activeTab === 'skills' 
                  ? 'border-blue-600 text-blue-600 bg-blue-50' 
                  : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Award className="w-5 h-5 mr-2 sm:mr-3" />
              Skills
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6 sm:space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                  <Button
                    onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
                    variant="outline"
                    size="sm"
                  >
                    {editingSection === 'personal' ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>

                {editingSection === 'personal' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <Input
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <Input
                        value={personalInfo.jobTitle}
                        onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        type="email"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <Input
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Input
                        value={personalInfo.location}
                        onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handlePersonalInfoSave} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        onClick={() => setEditingSection(null)} 
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{personalInfo.name || "Not provided"}</p>
                        <p className="text-sm text-gray-500">Full Name</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{personalInfo.jobTitle || "Not provided"}</p>
                        <p className="text-sm text-gray-500">Job Title</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{personalInfo.email}</p>
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{personalInfo.phone || "Not provided"}</p>
                        <p className="text-sm text-gray-500">Phone Number</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{personalInfo.location || "Not provided"}</p>
                        <p className="text-sm text-gray-500">Location</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Social Links</h3>
                  <Button
                    onClick={() => setEditingSection(editingSection === 'social' ? null : 'social')}
                    variant="outline"
                    size="sm"
                  >
                    {editingSection === 'social' ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>

                {editingSection === 'social' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                      <Input
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                      <Input
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                      <Input
                        value={socialLinks.portfolio}
                        onChange={(e) => setSocialLinks({...socialLinks, portfolio: e.target.value})}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <Input
                        value={socialLinks.website}
                        onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSocialLinksSave} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        onClick={() => setEditingSection(null)} 
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">LinkedIn</p>
                        {socialLinks.linkedin ? (
                          <a 
                            href={socialLinks.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            View Profile <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="font-medium text-gray-400">Not added</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-gray-800" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">GitHub</p>
                        {socialLinks.github ? (
                          <a 
                            href={socialLinks.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            View Profile <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="font-medium text-gray-400">Not added</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Portfolio</p>
                        {socialLinks.portfolio ? (
                          <a 
                            href={socialLinks.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            View Portfolio <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="font-medium text-gray-400">Not added</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Website</p>
                        {socialLinks.website ? (
                          <a 
                            href={socialLinks.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            Visit Website <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="font-medium text-gray-400">Not added</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About Me */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">About Me</h3>
                  <Button
                    onClick={() => setEditingSection(editingSection === 'about' ? null : 'about')}
                    variant="outline"
                    size="sm"
                  >
                    {editingSection === 'about' ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>

                {editingSection === 'about' ? (
                  <div className="space-y-4">
                    <textarea
                      value={personalInfo.about}
                      onChange={(e) => setPersonalInfo({...personalInfo, about: e.target.value})}
                      placeholder="Write a compelling summary to showcase your expertise..."
                      rows={6}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="flex gap-3">
                      <Button onClick={handlePersonalInfoSave} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        onClick={() => setEditingSection(null)} 
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {personalInfo.about ? (
                      <p className="text-gray-700 leading-relaxed">{personalInfo.about}</p>
                    ) : (
                      <div>
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-4">No professional summary added yet</p>
                        <p className="text-sm text-gray-400">
                          Add a compelling summary to showcase your expertise
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Resume Upload */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Resume</h3>
                </div>

                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload your resume</h4>
                  <p className="text-gray-600 mb-4">PDF, DOC, DOCX up to 5MB</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="hidden"
                      />
                      <Button variant="blue" className="w-full sm:w-auto">
                        Choose File
                      </Button>
                    </label>
                    <span className="text-gray-500">or drag and drop</span>
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="mt-4 text-sm text-red-600 flex items-center justify-center gap-2">
                      <span>⚠️</span>
                      {uploadError}
                    </div>
                  )}

                  {/* Success Message */}
                  {resumeFile && !uploadError && (
                    <div className="mt-4 text-sm text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}

                  {/* Upload Success */}
                  {uploadSuccess && (
                    <div className="mt-4 text-sm text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Resume uploaded successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-900">Work Experience</h3>
                <Button
                  onClick={() => setEditingSection(editingSection === 'addExperience' ? null : 'addExperience')}
                  variant="blue"
                  size="sm"
                >
                  {editingSection === 'addExperience' ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </>
                  )}
                </Button>
              </div>

              {editingSection === 'addExperience' && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Experience</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <Input
                        value={newExperience.title}
                        onChange={(e) => setNewExperience({...newExperience, title: e.target.value})}
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <Input
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                        placeholder="e.g. Google"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Input
                        value={newExperience.location}
                        onChange={(e) => setNewExperience({...newExperience, location: e.target.value})}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <Input
                        type="date"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <Input
                        type="date"
                        value={newExperience.endDate}
                        onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                        disabled={newExperience.current}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="currentJob"
                        checked={newExperience.current}
                        onChange={(e) => setNewExperience({...newExperience, current: e.target.checked, endDate: e.target.checked ? '' : newExperience.endDate})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="currentJob" className="ml-2 block text-sm text-gray-900">
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newExperience.description}
                      onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button onClick={addExperience} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                    <Button 
                      onClick={() => setEditingSection(null)} 
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {experience.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No work experience added</h4>
                    <p className="text-gray-600 mb-6">Add your work experience to showcase your professional journey</p>
                  </div>
                ) : (
                  experience.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {exp.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </div>
                          </div>
                          {exp.description && (
                            <p className="mt-3 text-gray-700">{exp.description}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-900">Education</h3>
                <Button
                  onClick={() => setEditingSection(editingSection === 'addEducation' ? null : 'addEducation')}
                  variant="blue"
                  size="sm"
                >
                  {editingSection === 'addEducation' ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </>
                  )}
                </Button>
              </div>

              {editingSection === 'addEducation' && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Education</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <Input
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                        placeholder="e.g. Bachelor of Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <Input
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <Input
                        value={newEducation.location}
                        onChange={(e) => setNewEducation({...newEducation, location: e.target.value})}
                        placeholder="e.g. Stanford, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                      <Input
                        value={newEducation.gpa}
                        onChange={(e) => setNewEducation({...newEducation, gpa: e.target.value})}
                        placeholder="e.g. 3.8/4.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <Input
                        type="date"
                        value={newEducation.startDate}
                        onChange={(e) => setNewEducation({...newEducation, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <Input
                        type="date"
                        value={newEducation.endDate}
                        onChange={(e) => setNewEducation({...newEducation, endDate: e.target.value})}
                        disabled={newEducation.current}
                      />
                    </div>
                    <div className="flex items-center md:col-span-2">
                      <input
                        type="checkbox"
                        id="currentEducation"
                        checked={newEducation.current}
                        onChange={(e) => setNewEducation({...newEducation, current: e.target.checked, endDate: e.target.checked ? '' : newEducation.endDate})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="currentEducation" className="ml-2 block text-sm text-gray-900">
                        I currently study here
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={newEducation.description}
                      onChange={(e) => setNewEducation({...newEducation, description: e.target.value})}
                      placeholder="Relevant coursework, achievements, activities..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button onClick={addEducation} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                    <Button 
                      onClick={() => setEditingSection(null)} 
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {education.length === 0 ? (
                  <div className="text-center py-12">
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No education added</h4>
                    <p className="text-gray-600 mb-6">Add your educational background to strengthen your profile</p>
                  </div>
                ) : (
                  education.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-blue-600 font-medium">{edu.institution}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {edu.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                            </div>
                            {edu.gpa && (
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                GPA: {edu.gpa}
                              </div>
                            )}
                          </div>
                          {edu.description && (
                            <p className="mt-3 text-gray-700">{edu.description}</p>
                          )}
                        </div>
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                <Button
                  onClick={() => setEditingSection(editingSection === 'addSkill' ? null : 'addSkill')}
                  variant="blue"
                  size="sm"
                >
                  {editingSection === 'addSkill' ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </>
                  )}
                </Button>
              </div>

              {editingSection === 'addSkill' && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill</h4>
                  <div className="flex gap-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g. React, Python, Project Management"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <div>
                {skills.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No skills added</h4>
                    <p className="text-gray-600 mb-6">Add your skills to highlight your expertise</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                      >
                        <span className="font-medium">{skill}</span>
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;