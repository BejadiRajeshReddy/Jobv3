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
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Building,
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
  const [isLoading, setIsLoading] = useState(true);
  const [editingSections, setEditingSections] = useState({
    personal: false,
    about: false,
    experience: false,
    education: false,
    skills: false,
    social: false,
  });

  // Form states
  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
  });

  const [aboutForm, setAboutForm] = useState("");
  const [experienceForm, setExperienceForm] = useState([]);
  const [educationForm, setEducationForm] = useState([]);
  const [skillsForm, setSkillsForm] = useState([]);
  const [socialForm, setSocialForm] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    website: "",
  });

  // Resume upload states
  const [resume, setResume] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [dragActive, setDragActive] = useState(false);

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
      initializeForms(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const initializeForms = (userData) => {
    setPersonalForm({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phoneNumber || "",
      location: userData.location || "",
      jobTitle: userData.jobTitle || "",
    });

    setAboutForm(userData.about || "");
    setExperienceForm(userData.experience || []);
    setEducationForm(userData.education || []);
    setSkillsForm(userData.skills || []);
    setSocialForm({
      linkedin: userData.socialLinks?.linkedin || "",
      github: userData.socialLinks?.github || "",
      portfolio: userData.socialLinks?.portfolio || "",
      website: userData.socialLinks?.website || "",
    });

    if (userData.resume) {
      setResume(userData.resume);
    }
  };

  const toggleEdit = (section) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveSection = async (section) => {
    try {
      const updatedUser = { ...currentUser };

      switch (section) {
        case "personal":
          Object.assign(updatedUser, personalForm);
          break;
        case "about":
          updatedUser.about = aboutForm;
          break;
        case "experience":
          updatedUser.experience = experienceForm;
          break;
        case "education":
          updatedUser.education = educationForm;
          break;
        case "skills":
          updatedUser.skills = skillsForm;
          break;
        case "social":
          updatedUser.socialLinks = socialForm;
          break;
      }

      // Update localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Update users array
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem("users", JSON.stringify(users));
      }

      setCurrentUser(updatedUser);
      toggleEdit(section);
      
      // Dispatch event to update navbar
      window.dispatchEvent(new Event("userStateChanged"));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const cancelEdit = (section) => {
    // Reset form to current user data
    initializeForms(currentUser);
    toggleEdit(section);
  };

  // Experience management
  const addExperience = () => {
    setExperienceForm([
      ...experienceForm,
      {
        id: Date.now(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const updateExperience = (id, field, value) => {
    setExperienceForm(prev =>
      prev.map(exp => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExperience = (id) => {
    setExperienceForm(prev => prev.filter(exp => exp.id !== id));
  };

  // Education management
  const addEducation = () => {
    setEducationForm([
      ...educationForm,
      {
        id: Date.now(),
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
      },
    ]);
  };

  const updateEducation = (id, field, value) => {
    setEducationForm(prev =>
      prev.map(edu => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id) => {
    setEducationForm(prev => prev.filter(edu => edu.id !== id));
  };

  // Skills management
  const addSkill = () => {
    setSkillsForm([...skillsForm, ""]);
  };

  const updateSkill = (index, value) => {
    setSkillsForm(prev => prev.map((skill, i) => (i === index ? value : skill)));
  };

  const removeSkill = (index) => {
    setSkillsForm(prev => prev.filter((_, i) => i !== index));
  };

  // Resume upload functions
  const handleResumeUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setResumeError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setResumeError("File size must be less than 5MB");
      return;
    }

    setResumeUploading(true);
    setResumeError("");

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const resumeData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file), // In real app, this would be the server URL
      };

      setResume(resumeData);

      // Save to user profile
      const updatedUser = { ...currentUser, resume: resumeData };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem("users", JSON.stringify(users));
      }

      setCurrentUser(updatedUser);
    } catch (error) {
      setResumeError("Failed to upload resume. Please try again.");
    } finally {
      setResumeUploading(false);
    }
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
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleResumeUpload(files[0]);
    }
  };

  const removeResume = () => {
    setResume(null);
    const updatedUser = { ...currentUser };
    delete updatedUser.resume;
    
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem("users", JSON.stringify(users));
    }
    
    setCurrentUser(updatedUser);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
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
                      {getInitials(currentUser.name)}
                    </span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-white">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {currentUser.name}
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-4">
                  {currentUser.jobTitle || "Job Seeker"}
                </p>
                <div className="flex flex-wrap gap-4 sm:gap-6 text-blue-100">
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
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                </div>
                <Button
                  onClick={() => editingSections.personal ? cancelEdit('personal') : toggleEdit('personal')}
                  variant="outline"
                  size="sm"
                >
                  {editingSections.personal ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>

              {editingSections.personal ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        value={personalForm.name}
                        onChange={(e) => setPersonalForm({...personalForm, name: e.target.value})}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <Input
                        value={personalForm.jobTitle}
                        onChange={(e) => setPersonalForm({...personalForm, jobTitle: e.target.value})}
                        placeholder="e.g. Frontend Developer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={personalForm.email}
                        onChange={(e) => setPersonalForm({...personalForm, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <Input
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm({...personalForm, phone: e.target.value})}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <Input
                      value={personalForm.location}
                      onChange={(e) => setPersonalForm({...personalForm, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => saveSection('personal')} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => cancelEdit('personal')} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      <p className="text-gray-900">{currentUser.name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
                      <p className="text-gray-900">{currentUser.jobTitle || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p className="text-gray-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                      <p className="text-gray-900">{currentUser.phoneNumber || "Not provided"}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                    <p className="text-gray-900">{currentUser.location || "Not provided"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* About Me */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">About Me</h2>
                </div>
                <Button
                  onClick={() => editingSections.about ? cancelEdit('about') : toggleEdit('about')}
                  variant="outline"
                  size="sm"
                >
                  {editingSections.about ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>

              {editingSections.about ? (
                <div className="space-y-4">
                  <textarea
                    value={aboutForm}
                    onChange={(e) => setAboutForm(e.target.value)}
                    placeholder="Write a compelling summary about yourself, your experience, and what you're looking for..."
                    rows={6}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-3">
                    <Button onClick={() => saveSection('about')} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => cancelEdit('about')} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {currentUser.about ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {currentUser.about}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 mb-4">No professional summary added yet</p>
                      <Button onClick={() => toggleEdit('about')} variant="outline">
                        Add Summary
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Experience</h2>
                </div>
                <Button
                  onClick={() => editingSections.experience ? cancelEdit('experience') : toggleEdit('experience')}
                  variant="outline"
                  size="sm"
                >
                  {editingSections.experience ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>

              {editingSections.experience ? (
                <div className="space-y-6">
                  {experienceForm.map((exp, index) => (
                    <div key={exp.id} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        />
                        <Input
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            placeholder="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                          <Input
                            type="date"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">Currently working here</span>
                        </label>
                      </div>
                      <textarea
                        placeholder="Describe your role and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  ))}
                  
                  <Button onClick={addExperience} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                  
                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => saveSection('experience')} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => cancelEdit('experience')} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {currentUser.experience && currentUser.experience.length > 0 ? (
                    <div className="space-y-6">
                      {currentUser.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-6">
                          <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </p>
                          {exp.description && (
                            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 mb-4">No work experience added yet</p>
                      <Button onClick={() => toggleEdit('experience')} variant="outline">
                        Add Experience
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Education</h2>
                </div>
                <Button
                  onClick={() => editingSections.education ? cancelEdit('education') : toggleEdit('education')}
                  variant="outline"
                  size="sm"
                >
                  {editingSections.education ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>

              {editingSections.education ? (
                <div className="space-y-6">
                  {educationForm.map((edu, index) => (
                    <div key={edu.id} className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        />
                        <Input
                          placeholder="Location"
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        />
                        <Input
                          placeholder="GPA (optional)"
                          value={edu.gpa}
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        />
                        <Input
                          type="date"
                          placeholder="Start Date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                        <Input
                          type="date"
                          placeholder="End Date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          disabled={edu.current}
                        />
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">Currently studying here</span>
                        </label>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addEducation} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                  
                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => saveSection('education')} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => cancelEdit('education')} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {currentUser.education && currentUser.education.length > 0 ? (
                    <div className="space-y-6">
                      {currentUser.education.map((edu, index) => (
                        <div key={index} className="border-l-4 border-orange-500 pl-6">
                          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-orange-600 font-medium">{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            {edu.location} • {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                            {edu.gpa && ` • GPA: ${edu.gpa}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 mb-4">No education added yet</p>
                      <Button onClick={() => toggleEdit('education')} variant="outline">
                        Add Education
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:space-y-8">
            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                </div>
                <Button
                  onClick={() => editingSections.skills ? cancelEdit('skills') : toggleEdit('skills')}
                  variant="outline"
                  size="sm"
                >
                  {editingSections.skills ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>

              {editingSections.skills ? (
                <div className="space-y-4">
                  {skillsForm.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        placeholder="Enter a skill"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeSkill(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button onClick={addSkill} variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                  
                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => saveSection('skills')} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => cancelEdit('skills')} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {currentUser.skills && currentUser.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 mb-4">No skills added yet</p>
                      <Button onClick={() => toggleEdit('skills')} variant="outline">
                        Add Skills
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Social Links</h2>
                </div>
                <Button
                  onClick={() => editingSections.social ? cancelEdit('social') : toggleEdit('social')}
                  variant="outline"
                  size="sm"
                >
                  {editingSections.social ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>

              {editingSections.social ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <Input
                      value={socialForm.linkedin}
                      onChange={(e) => setSocialForm({...socialForm, linkedin: e.target.value})}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <Input
                      value={socialForm.github}
                      onChange={(e) => setSocialForm({...socialForm, github: e.target.value})}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio
                    </label>
                    <Input
                      value={socialForm.portfolio}
                      onChange={(e) => setSocialForm({...socialForm, portfolio: e.target.value})}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <Input
                      value={socialForm.website}
                      onChange={(e) => setSocialForm({...socialForm, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => saveSection('social')} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={() => cancelEdit('social')} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentUser.socialLinks?.linkedin && (
                    <a
                      href={currentUser.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">LinkedIn</span>
                    </a>
                  )}
                  {currentUser.socialLinks?.github && (
                    <a
                      href={currentUser.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Github className="w-5 h-5 text-gray-700" />
                      <span className="text-gray-700">GitHub</span>
                    </a>
                  )}
                  {currentUser.socialLinks?.portfolio && (
                    <a
                      href={currentUser.socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-700">Portfolio</span>
                    </a>
                  )}
                  {currentUser.socialLinks?.website && (
                    <a
                      href={currentUser.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">Website</span>
                    </a>
                  )}
                  
                  {(!currentUser.socialLinks || Object.values(currentUser.socialLinks).every(link => !link)) && (
                    <div className="text-center py-8">
                      <ExternalLink className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 mb-4">No social links added yet</p>
                      <Button onClick={() => toggleEdit('social')} variant="outline">
                        Add Social Links
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Resume</h2>
              </div>

              {resume ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{resume.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(resume.size)} • Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => window.open(resume.url, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = resume.url;
                          link.download = resume.name;
                          link.click();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={removeResume}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <label htmlFor="resume-replace" className="cursor-pointer">
                      <Button variant="outline" className="w-full" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Replace Resume
                        </span>
                      </Button>
                    </label>
                    <input
                      id="resume-replace"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {resumeUploading ? (
                      <div className="space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600">Uploading resume...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <p className="text-lg font-medium text-gray-900 mb-2">
                            Upload your resume
                          </p>
                          <p className="text-gray-600 mb-4">
                            Drag and drop your file here, or click to browse
                          </p>
                          <label htmlFor="resume-upload" className="cursor-pointer">
                            <Button variant="blue" asChild>
                              <span>Choose File</span>
                            </Button>
                          </label>
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            PDF, DOC, DOCX up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {resumeError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-red-700">{resumeError}</p>
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

export default CandidateProfile;