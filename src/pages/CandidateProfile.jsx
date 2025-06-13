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
  ExternalLink,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Briefcase,
  Settings,
  Bell,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Camera,
  Download,
  Eye,
  Linkedin,
  Github,
  Globe,
  Twitter,
  Target,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";

const CandidateProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    about: "",
    skills: [],
    experience: [],
    education: [],
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
    },
    resume: null,
  });

  const [tempData, setTempData] = useState({});
  const [newSkill, setNewSkill] = useState("");
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });

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
      loadProfileData(userData.id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const loadProfileData = (userId) => {
    const savedProfile = localStorage.getItem(`profile_${userId}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setProfileData(profile);
    } else {
      // Initialize with user data
      setProfileData((prev) => ({
        ...prev,
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: currentUser?.phoneNumber || "",
      }));
    }
  };

  const saveProfileData = () => {
    if (currentUser) {
      localStorage.setItem(
        `profile_${currentUser.id}`,
        JSON.stringify(profileData)
      );
    }
  };

  useEffect(() => {
    if (currentUser) {
      saveProfileData();
    }
  }, [profileData, currentUser]);

  const handleEdit = (section) => {
    setEditingSection(section);
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setTempData({});
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      setProfileData((prev) => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience, id: Date.now() }],
      }));
      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    }
  };

  const handleRemoveExperience = (id) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setProfileData((prev) => ({
        ...prev,
        education: [...prev.education, { ...newEducation, id: Date.now() }],
      }));
      setNewEducation({
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    }
  };

  const handleRemoveEducation = (id) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    setUploadError("");
    setUploadSuccess("");

    if (!file) {
      setProfileData((prev) => ({ ...prev, resume: null }));
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
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size must be less than 5MB");
      e.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would upload to a server here
      // For now, we'll store file info in localStorage
      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      };

      setProfileData((prev) => ({ ...prev, resume: fileInfo }));
      setUploadSuccess("Resume uploaded successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(""), 3000);
    } catch (error) {
      setUploadError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
          value: "",
        },
      };
      handleResumeUpload(syntheticEvent);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-4 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  <span className="text-2xl sm:text-4xl font-bold text-white">
                    {getInitials(profileData.name || currentUser.name)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-white text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  {profileData.name || currentUser.name}
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 mb-4">
                  {profileData.jobTitle || "Job Seeker"}
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 text-blue-100">
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">
                      {profileData.email || currentUser.email}
                    </span>
                  </div>
                  {profileData.phone && (
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{profileData.phone}</span>
                    </div>
                  )}
                  {profileData.location && (
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profileData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4 sm:gap-8 text-white">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">
                    {profileData.skills?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-100">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">
                    {profileData.experience?.length || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-100">Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-1 sm:gap-2 -mb-px">
            {[
              { id: "overview", label: "Overview", icon: User, shortLabel: "Info" },
              { id: "experience", label: "Experience", icon: Briefcase, shortLabel: "Exp" },
              { id: "education", label: "Education", icon: GraduationCap, shortLabel: "Edu" },
              { id: "skills", label: "Skills", icon: Award, shortLabel: "Skills" },
              { id: "resume", label: "Resume", icon: FileText, shortLabel: "Resume" },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="ghost"
                className={`rounded-lg px-3 sm:px-6 py-2 sm:py-3 border-b-2 transition-all text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-3" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Personal Information
                        </h2>
                        <p className="text-sm text-gray-600">
                          Basic details about yourself
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEdit("personal")}
                      variant="outline"
                      size="sm"
                      disabled={isEditing}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  {isEditing && editingSection === "personal" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <Input
                            value={tempData.name || ""}
                            onChange={(e) =>
                              setTempData({ ...tempData, name: e.target.value })
                            }
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Title
                          </label>
                          <Input
                            value={tempData.jobTitle || ""}
                            onChange={(e) =>
                              setTempData({
                                ...tempData,
                                jobTitle: e.target.value,
                              })
                            }
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
                            value={tempData.email || ""}
                            onChange={(e) =>
                              setTempData({ ...tempData, email: e.target.value })
                            }
                            placeholder="your.email@example.com"
                            type="email"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <Input
                            value={tempData.phone || ""}
                            onChange={(e) =>
                              setTempData({ ...tempData, phone: e.target.value })
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <Input
                          value={tempData.location || ""}
                          onChange={(e) =>
                            setTempData({
                              ...tempData,
                              location: e.target.value,
                            })
                          }
                          placeholder="City, Country"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Full Name
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Job Title
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData.jobTitle || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Email
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData.email || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Phone Number
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData.phone || "Not provided"}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-gray-500">
                          Location
                        </label>
                        <p className="text-gray-900 font-medium">
                          {profileData.location || "Not provided"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Me */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">About Me</h2>
                        <p className="text-sm text-gray-600">
                          Tell employers about yourself
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEdit("about")}
                      variant="outline"
                      size="sm"
                      disabled={isEditing}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  {isEditing && editingSection === "about" ? (
                    <div className="space-y-4">
                      <textarea
                        value={tempData.about || ""}
                        onChange={(e) =>
                          setTempData({ ...tempData, about: e.target.value })
                        }
                        placeholder="Write a compelling summary about yourself, your experience, and what you're looking for..."
                        rows={6}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                      <div className="flex gap-3">
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {profileData.about ? (
                        <p className="text-gray-700 leading-relaxed text-left">
                          {profileData.about}
                        </p>
                      ) : (
                        <div>
                          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500 mb-4">
                            No professional summary added yet
                          </p>
                          <Button
                            onClick={() => handleEdit("about")}
                            variant="outline"
                          >
                            Add a compelling summary to showcase your expertise
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Work Experience
                      </h2>
                      <p className="text-sm text-gray-600">
                        Your professional journey
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add New Experience */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add Experience
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Job Title"
                      value={newExperience.title}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          title: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Company Name"
                      value={newExperience.company}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          company: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={newExperience.startDate}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          startDate: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={newExperience.endDate}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          endDate: e.target.value,
                        })
                      }
                      disabled={newExperience.current}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newExperience.current}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            current: e.target.checked,
                            endDate: e.target.checked ? "" : newExperience.endDate,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        I currently work here
                      </span>
                    </label>
                  </div>
                  <textarea
                    placeholder="Describe your role and achievements..."
                    value={newExperience.description}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                  />
                  <Button onClick={handleAddExperience}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                {/* Experience List */}
                <div className="space-y-6">
                  {profileData.experience?.length > 0 ? (
                    profileData.experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {exp.title}
                            </h3>
                            <p className="text-blue-600 font-medium">
                              {exp.company}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(exp.startDate)} -{" "}
                              {exp.current ? "Present" : formatDate(exp.endDate)}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleRemoveExperience(exp.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">
                        No work experience added yet
                      </p>
                      <p className="text-sm text-gray-400">
                        Add your professional experience to showcase your career
                        journey
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Education Tab */}
            {activeTab === "education" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Education</h2>
                      <p className="text-sm text-gray-600">
                        Your academic background
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add New Education */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add Education
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      placeholder="Degree/Certification"
                      value={newEducation.degree}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          degree: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Institution Name"
                      value={newEducation.institution}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          institution: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={newEducation.startDate}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          startDate: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={newEducation.endDate}
                      onChange={(e) =>
                        setNewEducation({
                          ...newEducation,
                          endDate: e.target.value,
                        })
                      }
                      disabled={newEducation.current}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newEducation.current}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            current: e.target.checked,
                            endDate: e.target.checked ? "" : newEducation.endDate,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Currently studying here
                      </span>
                    </label>
                  </div>
                  <textarea
                    placeholder="Additional details about your education..."
                    value={newEducation.description}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                  />
                  <Button onClick={handleAddEducation}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                {/* Education List */}
                <div className="space-y-6">
                  {profileData.education?.length > 0 ? (
                    profileData.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {edu.degree}
                            </h3>
                            <p className="text-blue-600 font-medium">
                              {edu.institution}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(edu.startDate)} -{" "}
                              {edu.current ? "Present" : formatDate(edu.endDate)}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleRemoveEducation(edu.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {edu.description && (
                          <p className="text-gray-700">{edu.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">
                        No education added yet
                      </p>
                      <p className="text-sm text-gray-400">
                        Add your educational background to strengthen your profile
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                      <p className="text-sm text-gray-600">
                        Your technical and soft skills
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add New Skill */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add Skills
                  </h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleAddSkill}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                {/* Skills List */}
                <div>
                  {profileData.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {profileData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                        >
                          <span>{skill}</span>
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 mb-4">No skills added yet</p>
                      <p className="text-sm text-gray-400">
                        Add your skills to help employers find you
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resume Tab */}
            {activeTab === "resume" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Resume</h2>
                      <p className="text-sm text-gray-600">
                        Upload your latest resume
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-6">
                  {!profileData.resume ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload your resume
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Drag and drop your resume here, or click to browse
                      </p>
                      <div className="flex justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <Button disabled={isUploading}>
                            {isUploading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Choose File
                              </>
                            )}
                          </Button>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        PDF, DOC, DOCX up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {profileData.resume.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(profileData.resume.size)} •{" "}
                              Uploaded{" "}
                              {new Date(
                                profileData.resume.uploadedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                            <Button variant="outline" size="sm" disabled={isUploading}>
                              {isUploading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                              ) : (
                                <Upload className="w-4 h-4" />
                              )}
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-700">{uploadError}</span>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {uploadSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-700">{uploadSuccess}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Social Links */}
          <div className="space-y-6 sm:space-y-8">
            {/* Social Links */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Social Links
                    </h2>
                    <p className="text-sm text-gray-600">Connect your profiles</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleEdit("social")}
                  variant="outline"
                  size="sm"
                  disabled={isEditing}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>

              {isEditing && editingSection === "social" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <Input
                      value={tempData.socialLinks?.linkedin || ""}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          socialLinks: {
                            ...tempData.socialLinks,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub
                    </label>
                    <Input
                      value={tempData.socialLinks?.github || ""}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          socialLinks: {
                            ...tempData.socialLinks,
                            github: e.target.value,
                          },
                        })
                      }
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio
                    </label>
                    <Input
                      value={tempData.socialLinks?.portfolio || ""}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          socialLinks: {
                            ...tempData.socialLinks,
                            portfolio: e.target.value,
                          },
                        })
                      }
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Twitter
                    </label>
                    <Input
                      value={tempData.socialLinks?.twitter || ""}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          socialLinks: {
                            ...tempData.socialLinks,
                            twitter: e.target.value,
                          },
                        })
                      }
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      name: "LinkedIn",
                      icon: Linkedin,
                      url: profileData.socialLinks?.linkedin,
                      color: "text-blue-600",
                    },
                    {
                      name: "GitHub",
                      icon: Github,
                      url: profileData.socialLinks?.github,
                      color: "text-gray-900",
                    },
                    {
                      name: "Portfolio",
                      icon: Globe,
                      url: profileData.socialLinks?.portfolio,
                      color: "text-green-600",
                    },
                    {
                      name: "Twitter",
                      icon: Twitter,
                      url: profileData.socialLinks?.twitter,
                      color: "text-blue-400",
                    },
                  ].map((social) => (
                    <div
                      key={social.name}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <social.icon className={`w-5 h-5 ${social.color}`} />
                        <span className="font-medium text-gray-900">
                          {social.name}
                        </span>
                      </div>
                      {social.url ? (
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Profile
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Not added</span>
                      )}
                    </div>
                  ))}
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