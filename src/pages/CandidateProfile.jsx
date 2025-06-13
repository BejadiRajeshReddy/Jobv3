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
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Camera,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

const CandidateProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
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
    bio: "",
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

  const [newSkill, setNewSkill] = useState("");
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
      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phoneNumber || "",
        location: userData.location || "",
        jobTitle: userData.jobTitle || "",
        bio: userData.bio || "",
        skills: userData.skills || [],
        experience: userData.experience || [],
        education: userData.education || [],
        socialLinks: userData.socialLinks || {
          linkedin: "",
          github: "",
          portfolio: "",
          twitter: "",
        },
        resume: userData.resume || null,
      });
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = () => {
    const updatedUser = {
      ...currentUser,
      ...profileData,
      phoneNumber: profileData.phone,
    };

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem("users", JSON.stringify(users));
    }

    setCurrentUser(updatedUser);
    setIsEditing(false);

    // Dispatch event to update navbar
    window.dispatchEvent(new Event("userStateChanged"));
  };

  const handleCancel = () => {
    // Reset form data
    setProfileData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phoneNumber || "",
      location: currentUser.location || "",
      jobTitle: currentUser.jobTitle || "",
      bio: currentUser.bio || "",
      skills: currentUser.skills || [],
      experience: currentUser.experience || [],
      education: currentUser.education || [],
      socialLinks: currentUser.socialLinks || {
        linkedin: "",
        github: "",
        portfolio: "",
        twitter: "",
      },
      resume: currentUser.resume || null,
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const addExperience = () => {
    if (newExperience.title && newExperience.company) {
      setProfileData({
        ...profileData,
        experience: [...profileData.experience, { ...newExperience, id: Date.now() }],
      });
      setNewExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
    }
  };

  const removeExperience = (id) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setProfileData({
        ...profileData,
        education: [...profileData.education, { ...newEducation, id: Date.now() }],
      });
      setNewEducation({
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
      });
    }
  };

  const removeEducation = (id) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter((edu) => edu.id !== id),
    });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    setUploadError("");
    setUploadSuccess("");
    
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

      // In a real app, you would upload to a server and get a URL back
      const resumeData = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        url: URL.createObjectURL(file), // For demo purposes
      };

      setProfileData({
        ...profileData,
        resume: resumeData,
      });

      setUploadSuccess("Resume uploaded successfully!");
      
      // Auto-save resume
      const updatedUser = {
        ...currentUser,
        resume: resumeData,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], resume: resumeData };
        localStorage.setItem("users", JSON.stringify(users));
      }

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
          value: ""
        }
      };
      handleResumeUpload(syntheticEvent);
    }
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 8;

    if (profileData.name) completed++;
    if (profileData.email) completed++;
    if (profileData.phone) completed++;
    if (profileData.location) completed++;
    if (profileData.jobTitle) completed++;
    if (profileData.bio) completed++;
    if (profileData.skills.length > 0) completed++;
    if (profileData.resume) completed++;

    return Math.round((completed / total) * 100);
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

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Header Card */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-4 sm:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                  <span className="text-2xl sm:text-4xl font-bold text-white">
                    {getInitials(profileData.name)}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left text-white">
                <div className="mb-4 sm:mb-6">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    {profileData.name || "Your Name"}
                  </h1>
                  <p className="text-lg sm:text-xl text-blue-100 mb-2 sm:mb-4">
                    {profileData.jobTitle || "Job Title"}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-6 text-blue-100 text-sm sm:text-base">
                    {profileData.email && (
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="break-all">{profileData.email}</span>
                      </div>
                    )}
                    {profileData.phone && (
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.location && (
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold">{profileData.skills.length}</div>
                    <div className="text-xs sm:text-sm text-blue-200">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold">{profileData.experience.length}</div>
                    <div className="text-xs sm:text-sm text-blue-200">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold">{profileCompletion}%</div>
                    <div className="text-xs sm:text-sm text-blue-200">Complete</div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="lg:self-start">
                {isEditing ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3"
                    >
                      <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-4 sm:px-6 py-2 sm:py-3"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-white/10 border border-white/30 text-white hover:bg-white/20 px-4 sm:px-6 py-2 sm:py-3"
                  >
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {profileCompletion < 80 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Complete Your Profile to Stand Out
                </h3>
                <p className="text-orange-700 mb-4 text-sm sm:text-base">
                  Profiles with more information get 3x more views from recruiters.
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-orange-700 mb-1">
                    <span>{profileCompletion}% complete</span>
                    <span>Add basic information to improve visibility</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  {!profileData.bio && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Write about yourself (+15%)
                    </div>
                  )}
                  {profileData.skills.length === 0 && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Add skills (+15%)
                    </div>
                  )}
                  {profileData.experience.length === 0 && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Add work experience (+15%)
                    </div>
                  )}
                  {profileData.education.length === 0 && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Add education (+15%)
                    </div>
                  )}
                  {!profileData.resume && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Upload resume (+10%)
                    </div>
                  )}
                  {!profileData.socialLinks.linkedin && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      Add social links (+15%)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 mb-6 sm:mb-8 p-4 sm:p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-1 sm:gap-2 -mb-px">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Award },
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
                <tab.icon className="w-4 h-4 mr-1 sm:mr-3" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                        <p className="text-sm text-gray-600">Basic details about yourself</p>
                      </div>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, name: e.target.value })
                          }
                          placeholder="Your full name"
                          className="text-base h-12"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData.name || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Title
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.jobTitle}
                          onChange={(e) =>
                            setProfileData({ ...profileData, jobTitle: e.target.value })
                          }
                          placeholder="e.g. Frontend Developer"
                          className="text-base h-12"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData.jobTitle || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                        {profileData.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({ ...profileData, phone: e.target.value })
                          }
                          placeholder="Your phone number"
                          className="text-base h-12"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData.phone || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <Input
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({ ...profileData, location: e.target.value })
                          }
                          placeholder="City, Country"
                          className="text-base h-12"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {profileData.location || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* About Me */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">About Me</h3>
                        <p className="text-sm text-gray-600">Tell employers about yourself</p>
                      </div>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      placeholder="Write a compelling summary to showcase your expertise and career goals..."
                      rows={6}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                    />
                  ) : profileData.bio ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profileData.bio}
                    </p>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No professional summary added yet</p>
                      <p className="text-sm mb-4">
                        Add a compelling summary to showcase your expertise
                      </p>
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        Add Summary
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Work Experience</h3>
                      <p className="text-sm text-gray-600">Your professional journey</p>
                    </div>
                  </div>
                </div>

                {/* Add Experience Form */}
                {isEditing && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Add Experience</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="Job Title"
                        value={newExperience.title}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, title: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      <Input
                        placeholder="Company"
                        value={newExperience.company}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, company: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      <Input
                        placeholder="Location"
                        value={newExperience.location}
                        onChange={(e) =>
                          setNewExperience({ ...newExperience, location: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          placeholder="Start Date"
                          value={newExperience.startDate}
                          onChange={(e) =>
                            setNewExperience({ ...newExperience, startDate: e.target.value })
                          }
                          className="text-base h-12"
                        />
                        {!newExperience.current && (
                          <Input
                            type="date"
                            placeholder="End Date"
                            value={newExperience.endDate}
                            onChange={(e) =>
                              setNewExperience({ ...newExperience, endDate: e.target.value })
                            }
                            className="text-base h-12"
                          />
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newExperience.current}
                          onChange={(e) =>
                            setNewExperience({ ...newExperience, current: e.target.checked })
                          }
                          className="rounded"
                        />
                        I currently work here
                      </label>
                    </div>
                    <textarea
                      placeholder="Describe your responsibilities and achievements..."
                      value={newExperience.description}
                      onChange={(e) =>
                        setNewExperience({ ...newExperience, description: e.target.value })
                      }
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base mb-4"
                    />
                    <Button onClick={addExperience} className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                )}

                {/* Experience List */}
                {profileData.experience.length > 0 ? (
                  <div className="space-y-6">
                    {profileData.experience.map((exp) => (
                      <div key={exp.id} className="border-l-4 border-blue-500 pl-6 relative">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{exp.title}</h4>
                            <p className="text-blue-600 font-medium">{exp.company}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                              {exp.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {exp.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                              </span>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              onClick={() => removeExperience(exp.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No work experience added yet</p>
                    <p className="text-sm mb-4">
                      Add your professional experience to showcase your career journey
                    </p>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        Add Experience
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "education" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Education</h3>
                      <p className="text-sm text-gray-600">Your academic background</p>
                    </div>
                  </div>
                </div>

                {/* Add Education Form */}
                {isEditing && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Add Education</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <Input
                        placeholder="Degree"
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, degree: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      <Input
                        placeholder="Institution"
                        value={newEducation.institution}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, institution: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      <Input
                        placeholder="Location"
                        value={newEducation.location}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, location: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      <Input
                        placeholder="GPA (optional)"
                        value={newEducation.gpa}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, gpa: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      <Input
                        type="date"
                        placeholder="Start Date"
                        value={newEducation.startDate}
                        onChange={(e) =>
                          setNewEducation({ ...newEducation, startDate: e.target.value })
                        }
                        className="text-base h-12"
                      />
                      {!newEducation.current && (
                        <Input
                          type="date"
                          placeholder="End Date"
                          value={newEducation.endDate}
                          onChange={(e) =>
                            setNewEducation({ ...newEducation, endDate: e.target.value })
                          }
                          className="text-base h-12"
                        />
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newEducation.current}
                          onChange={(e) =>
                            setNewEducation({ ...newEducation, current: e.target.checked })
                          }
                          className="rounded"
                        />
                        I currently study here
                      </label>
                    </div>
                    <Button onClick={addEducation} className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                )}

                {/* Education List */}
                {profileData.education.length > 0 ? (
                  <div className="space-y-6">
                    {profileData.education.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-indigo-500 pl-6 relative">
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="text-indigo-600 font-medium">{edu.institution}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                              {edu.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {edu.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                              </span>
                              {edu.gpa && (
                                <span className="flex items-center gap-1">
                                  <Award className="w-3 h-3" />
                                  GPA: {edu.gpa}
                                </span>
                              )}
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              onClick={() => removeEducation(edu.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No education added yet</p>
                    <p className="text-sm mb-4">
                      Add your educational background to showcase your qualifications
                    </p>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        Add Education
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "skills" && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Skills</h3>
                      <p className="text-sm text-gray-600">Your technical and soft skills</p>
                    </div>
                  </div>
                </div>

                {/* Add Skill Form */}
                {isEditing && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                    <h4 className="text-lg font-semibold mb-4">Add Skill</h4>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        className="flex-1 text-base h-12"
                      />
                      <Button onClick={addSkill} className="px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                {/* Skills List */}
                {profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {profileData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            onClick={() => removeSkill(skill)}
                            className="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No skills added yet</p>
                    <p className="text-sm mb-4">
                      Add your skills to help employers find you
                    </p>
                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                      >
                        Add Skills
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6 sm:space-y-8">
            {/* Profile Strength */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Profile Strength</h3>
                  <p className="text-sm text-blue-600 font-medium">{profileCompletion}%</p>
                </div>
              </div>

              <div className="mb-4">
                <Progress value={profileCompletion} className="h-3" />
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Complete your profile to increase visibility to employers
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {profileData.bio ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                    Write about yourself
                  </span>
                  <span className="text-gray-500">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {profileData.skills.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                    Add skills
                  </span>
                  <span className="text-gray-500">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {profileData.experience.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                    Add work experience
                  </span>
                  <span className="text-gray-500">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {profileData.education.length > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                    Add education
                  </span>
                  <span className="text-gray-500">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {profileData.resume ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                    Upload resume
                  </span>
                  <span className="text-gray-500">+10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {profileData.socialLinks.linkedin ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                    )}
                    Add social links
                  </span>
                  <span className="text-gray-500">+15%</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
                    <p className="text-sm text-gray-600">Connect your profiles</p>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {[
                  { key: "linkedin", icon: Linkedin, label: "LinkedIn", color: "text-blue-600" },
                  { key: "github", icon: Github, label: "GitHub", color: "text-gray-800" },
                  { key: "portfolio", icon: Globe, label: "Portfolio", color: "text-green-600" },
                  { key: "twitter", icon: Twitter, label: "Twitter", color: "text-blue-400" },
                ].map((social) => (
                  <div key={social.key} className="flex items-center gap-3">
                    <social.icon className={`w-5 h-5 ${social.color}`} />
                    <div className="flex-1">
                      {isEditing ? (
                        <Input
                          placeholder={`Your ${social.label} URL`}
                          value={profileData.socialLinks[social.key]}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              socialLinks: {
                                ...profileData.socialLinks,
                                [social.key]: e.target.value,
                              },
                            })
                          }
                          className="text-sm h-10"
                        />
                      ) : profileData.socialLinks[social.key] ? (
                        <a
                          href={profileData.socialLinks[social.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          {social.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">Not added</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Resume</h3>
                  <p className="text-sm text-gray-600">Upload your latest resume</p>
                </div>
              </div>

              {profileData.resume ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-green-800 truncate">
                        {profileData.resume.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {(profileData.resume.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(profileData.resume.url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {uploadSuccess && (
                    <div className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {uploadSuccess}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {isUploading ? "Uploading..." : "Upload your resume"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </label>
                </div>
              )}

              {/* Upload Error */}
              {uploadError && (
                <div className="mt-3 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {uploadError}
                </div>
              )}

              {/* Replace Resume Button */}
              {profileData.resume && (
                <div className="mt-4">
                  <input
                    type="file"
                    id="resume-replace"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label htmlFor="resume-replace">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isUploading}
                      asChild
                    >
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Uploading..." : "Replace Resume"}
                      </span>
                    </Button>
                  </label>
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