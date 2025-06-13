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
  Download,
  Eye,
  Calendar,
  Building,
  GraduationCap,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";

const CandidateProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingSection, setEditingSection] = useState(null);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
  });

  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
  });

  const [aboutMe, setAboutMe] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);

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
    }
  }, [navigate]);

  const loadUserProfile = (user) => {
    setPersonalInfo({
      name: user.name || "",
      jobTitle: user.jobTitle || "",
      email: user.email || "",
      phone: user.phoneNumber || "",
      location: user.location || "",
    });

    setSocialLinks(user.socialLinks || {
      linkedin: "",
      github: "",
      portfolio: "",
      website: "",
    });

    setAboutMe(user.aboutMe || "");
    setExperiences(user.experiences || []);
    setEducation(user.education || []);
    setSkills(user.skills || []);
    setUploadedResume(user.resume || null);
  };

  const saveToLocalStorage = (updatedData) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem("users", JSON.stringify(users));
      
      const updatedCurrentUser = { ...currentUser, ...updatedData };
      localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
      setCurrentUser(updatedCurrentUser);
    }
  };

  const handlePersonalInfoSave = () => {
    saveToLocalStorage(personalInfo);
    setEditingSection(null);
  };

  const handleSocialLinksSave = () => {
    saveToLocalStorage({ socialLinks });
    setEditingSection(null);
  };

  const handleAboutMeSave = () => {
    saveToLocalStorage({ aboutMe });
    setEditingSection(null);
  };

  const handleExperienceSave = () => {
    saveToLocalStorage({ experiences });
    setEditingSection(null);
  };

  const handleEducationSave = () => {
    saveToLocalStorage({ education });
    setEditingSection(null);
  };

  const handleSkillsSave = () => {
    saveToLocalStorage({ skills });
    setEditingSection(null);
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }]);
  };

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
    }]);
  };

  const updateEducation = (id, field, value) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    const skillName = prompt("Enter skill name:");
    if (skillName && skillName.trim()) {
      setSkills([...skills, {
        id: Date.now(),
        name: skillName.trim(),
        level: "Intermediate",
      }]);
    }
  };

  const updateSkill = (id, field, value) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    ));
  };

  const removeSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const handleResumeUpload = (file) => {
    setUploadError("");
    setUploadSuccess(false);

    if (!file) {
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
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Create resume object
    const resumeData = {
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      // In a real app, you'd upload to a server and get a URL
      url: URL.createObjectURL(file),
    };

    setUploadedResume(resumeData);
    saveToLocalStorage({ resume: resumeData });
    setUploadSuccess(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleResumeUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleResumeUpload(files[0]);
    }
  };

  const handleResumeDelete = () => {
    if (window.confirm("Are you sure you want to delete your resume?")) {
      setUploadedResume(null);
      saveToLocalStorage({ resume: null });
      
      // Clear any file input
      const fileInput = document.getElementById("resume-upload");
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const handleResumeView = () => {
    if (uploadedResume && uploadedResume.url) {
      window.open(uploadedResume.url, "_blank");
    }
  };

  const handleResumeDownload = () => {
    if (uploadedResume && uploadedResume.url) {
      const link = document.createElement("a");
      link.href = uploadedResume.url;
      link.download = uploadedResume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById("resume-upload");
    if (fileInput) {
      fileInput.click();
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
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
                      {getInitials(personalInfo.name || currentUser.name)}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-white text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {personalInfo.name || currentUser.name}
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
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "experience", label: "Experience", icon: Building },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Award },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                className={`rounded-lg px-4 sm:px-6 py-3 border-b-2 transition-all text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  </div>
                  {editingSection !== "personal" && (
                    <Button
                      onClick={() => setEditingSection("personal")}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {editingSection === "personal" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <Input
                        value={personalInfo.jobTitle}
                        onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
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
                        <X className="w-4 h-4 mr-2" />
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
                      <Building className="w-5 h-5 text-gray-400" />
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Social Links</h2>
                  </div>
                  {editingSection !== "social" && (
                    <Button
                      onClick={() => setEditingSection("social")}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {editingSection === "social" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <Input
                        value={socialLinks.linkedin}
                        onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub
                      </label>
                      <Input
                        value={socialLinks.github}
                        onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portfolio
                      </label>
                      <Input
                        value={socialLinks.portfolio}
                        onChange={(e) => setSocialLinks({...socialLinks, portfolio: e.target.value})}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
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
                        <X className="w-4 h-4 mr-2" />
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
                            className="font-medium text-blue-600 hover:text-blue-800 break-all"
                          >
                            {socialLinks.linkedin}
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
                            className="font-medium text-blue-600 hover:text-blue-800 break-all"
                          >
                            {socialLinks.github}
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
                            className="font-medium text-blue-600 hover:text-blue-800 break-all"
                          >
                            {socialLinks.portfolio}
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
                            className="font-medium text-blue-600 hover:text-blue-800 break-all"
                          >
                            {socialLinks.website}
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
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">About Me</h2>
                  </div>
                  {editingSection !== "about" && (
                    <Button
                      onClick={() => setEditingSection("about")}
                      variant="outline"
                      size="sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>

                {editingSection === "about" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Summary
                      </label>
                      <textarea
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        placeholder="Write a compelling summary about yourself, your experience, and what you're looking for..."
                        rows={6}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAboutMeSave} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingSection(null)}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {aboutMe ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aboutMe}</p>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Resume</h2>
                </div>

                {uploadedResume ? (
                  /* Resume Uploaded State */
                  <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{uploadedResume.name}</p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(uploadedResume.size)} • Uploaded {new Date(uploadedResume.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <Button
                          onClick={handleResumeView}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          onClick={handleResumeDownload}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          onClick={triggerFileInput}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Replace
                        </Button>
                        <Button
                          onClick={handleResumeDelete}
                          variant="outline"
                          size="sm"
                          className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Resume Upload State */
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isDragging
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload your resume
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-sm">
                        PDF, DOC, DOCX up to 5MB. Drag and drop or click to browse.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <label className="cursor-pointer">
                          <Button
                            type="button"
                            onClick={triggerFileInput}
                            className="w-full sm:w-auto"
                          >
                            Choose File
                          </Button>
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-gray-500 text-sm">or drag and drop</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {uploadError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700">{uploadError}</p>
                  </div>
                )}

                {/* Success Message */}
                {uploadSuccess && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-green-700">Resume uploaded successfully!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
                </div>
                <div className="flex gap-2">
                  {editingSection === "experience" ? (
                    <>
                      <Button onClick={handleExperienceSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingSection(null)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditingSection("experience")}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button onClick={addExperience} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingSection === "experience" ? (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">Experience {index + 1}</h3>
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title
                          </label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="e.g. Frontend Developer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="e.g. Google"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            placeholder="e.g. San Francisco, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`current-${exp.id}`} className="ml-2 text-sm text-gray-700">
                            I currently work here
                          </label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  ))}
                  {experiences.length === 0 && (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No work experience added yet</p>
                      <Button onClick={addExperience}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Experience
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="border-l-4 border-blue-500 pl-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                        <span className="text-sm text-gray-500">
                          {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-1">{exp.company}</p>
                      <p className="text-gray-600 text-sm mb-3">{exp.location}</p>
                      {exp.description && (
                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                  {experiences.length === 0 && (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No work experience added yet</p>
                      <p className="text-sm text-gray-400">
                        Add your work experience to showcase your professional journey
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "education" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Education</h2>
                </div>
                <div className="flex gap-2">
                  {editingSection === "education" ? (
                    <>
                      <Button onClick={handleEducationSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingSection(null)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditingSection("education")}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button onClick={addEducation} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingSection === "education" ? (
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900">Education {index + 1}</h3>
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Degree
                          </label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="e.g. Bachelor of Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Institution
                          </label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                            placeholder="e.g. Stanford University"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <Input
                            value={edu.location}
                            onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                            placeholder="e.g. Stanford, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            GPA (Optional)
                          </label>
                          <Input
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                            placeholder="e.g. 3.8/4.0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                            disabled={edu.current}
                          />
                        </div>
                        <div className="flex items-center md:col-span-2">
                          <input
                            type="checkbox"
                            id={`current-edu-${edu.id}`}
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, "current", e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`current-edu-${edu.id}`} className="ml-2 text-sm text-gray-700">
                            I currently study here
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {education.length === 0 && (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No education added yet</p>
                      <Button onClick={addEducation}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Education
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={edu.id} className="border-l-4 border-green-500 pl-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                        <span className="text-sm text-gray-500">
                          {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                        </span>
                      </div>
                      <p className="text-green-600 font-medium mb-1">{edu.institution}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 text-sm">
                        <span>{edu.location}</span>
                        {edu.gpa && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>GPA: {edu.gpa}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {education.length === 0 && (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No education added yet</p>
                      <p className="text-sm text-gray-400">
                        Add your educational background to showcase your qualifications
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                </div>
                <div className="flex gap-2">
                  {editingSection === "skills" ? (
                    <>
                      <Button onClick={handleSkillsSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => setEditingSection(null)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setEditingSection("skills")}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button onClick={addSkill} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {editingSection === "skills" ? (
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                          placeholder="Skill name"
                        />
                      </div>
                      <div className="w-32">
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <Button
                        onClick={() => removeSkill(skill.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {skills.length === 0 && (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No skills added yet</p>
                      <Button onClick={addSkill}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Skill
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full"
                        >
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-xs bg-orange-200 px-2 py-1 rounded-full">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No skills added yet</p>
                      <p className="text-sm text-gray-400">
                        Add your skills to showcase your expertise to employers
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;