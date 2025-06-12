import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Briefcase,
  GraduationCap,
  Award,
  Github,
  Linkedin,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Link as LinkIcon,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/Button";
import { Progress } from "../components/ui/progress";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const navigate = useNavigate();

  // Basic Information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [location, setLocation] = useState("");
  const [willingToRelocate, setWillingToRelocate] = useState(false);
  const [currentJobTitle, setCurrentJobTitle] = useState("");

  // Career Preferences
  const [preferredRoles, setPreferredRoles] = useState([]);
  const [newPreferredRole, setNewPreferredRole] = useState("");
  const [preferredLocations, setPreferredLocations] = useState([]);
  const [newPreferredLocation, setNewPreferredLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [remoteWorkPreference, setRemoteWorkPreference] = useState("");

  // Education
  const [education, setEducation] = useState([]);

  // Work Experience
  const [workExperience, setWorkExperience] = useState([]);
  const [isFresher, setIsFresher] = useState(false);

  // Skills
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillProficiency, setSkillProficiency] = useState("");

  // Certifications
  const [certifications, setCertifications] = useState([]);

  // Projects
  const [projects, setProjects] = useState([]);

  // Resume
  const [resume, setResume] = useState(null);
  const [resumeTitle, setResumeTitle] = useState("");

  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    hackerrank: "",
    leetcode: "",
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setName(currentUser.name || "");
    setEmail(currentUser.email || "");
    setPhoneNumber(currentUser.phoneNumber || "");
    setGender(currentUser.gender || "");
    setDateOfBirth(currentUser.dateOfBirth || "");
    setLocation(currentUser.location || "");
    setWillingToRelocate(currentUser.willingToRelocate || false);
    setCurrentJobTitle(currentUser.currentJobTitle || "");
    setProfileImage(currentUser.profileImage || null);
    
    setPreferredRoles(currentUser.preferredRoles || []);
    setPreferredLocations(currentUser.preferredLocations || []);
    setEmploymentType(currentUser.employmentType || "");
    setExpectedSalary(currentUser.expectedSalary || "");
    setAvailableFrom(currentUser.availableFrom || "");
    setRemoteWorkPreference(currentUser.remoteWorkPreference || "");
    
    setEducation(currentUser.education || []);
    setWorkExperience(currentUser.workExperience || []);
    setIsFresher(currentUser.isFresher || false);
    setSkills(currentUser.skills || []);
    setCertifications(currentUser.certifications || []);
    setProjects(currentUser.projects || []);
    setResume(currentUser.resume || null);
    setResumeTitle(currentUser.resumeTitle || "");
    setSocialLinks(currentUser.socialLinks || {
      linkedin: "",
      github: "",
      portfolio: "",
      hackerrank: "",
      leetcode: "",
    });

    calculateProfileCompletion(currentUser);
    setIsLoading(false);
  }, [navigate]);

  const calculateProfileCompletion = (userData) => {
    const totalFields = 20; // Approximate count of all possible fields
    let completedFields = 0;

    // Basic Information
    if (userData.name) completedFields++;
    if (userData.email) completedFields++;
    if (userData.phoneNumber) completedFields++;
    if (userData.gender) completedFields++;
    if (userData.dateOfBirth) completedFields++;
    if (userData.location) completedFields++;
    if (userData.currentJobTitle || userData.isFresher) completedFields++;
    
    // Career Preferences
    if (userData.preferredRoles && userData.preferredRoles.length > 0) completedFields++;
    if (userData.preferredLocations && userData.preferredLocations.length > 0) completedFields++;
    if (userData.employmentType) completedFields++;
    if (userData.expectedSalary) completedFields++;
    if (userData.availableFrom) completedFields++;
    if (userData.remoteWorkPreference) completedFields++;

    // Education, Work Experience, Skills, Certifications, Projects, Resume, Social Links
    if (userData.education && userData.education.length > 0) completedFields++;
    if (userData.workExperience && userData.workExperience.length > 0 || userData.isFresher) completedFields++;
    if (userData.skills && userData.skills.length > 0) completedFields++;
    if (userData.certifications && userData.certifications.length > 0) completedFields++;
    if (userData.projects && userData.projects.length > 0) completedFields++;
    if (userData.resume) completedFields++;
    if (userData.socialLinks && Object.values(userData.socialLinks).some(link => link)) completedFields++;

    const completion = (completedFields / totalFields) * 100;
    setProfileCompletion(Math.round(completion));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Career Preferences Handlers
  const handleAddPreferredRole = () => {
    if (newPreferredRole.trim() && !preferredRoles.includes(newPreferredRole.trim())) {
      setPreferredRoles([...preferredRoles, newPreferredRole.trim()]);
      setNewPreferredRole("");
    }
  };

  const handleRemovePreferredRole = (roleToRemove) => {
    setPreferredRoles(preferredRoles.filter(role => role !== roleToRemove));
  };

  const handleAddPreferredLocation = () => {
    if (newPreferredLocation.trim() && !preferredLocations.includes(newPreferredLocation.trim())) {
      setPreferredLocations([...preferredLocations, newPreferredLocation.trim()]);
      setNewPreferredLocation("");
    }
  };

  const handleRemovePreferredLocation = (locationToRemove) => {
    setPreferredLocations(preferredLocations.filter(loc => loc !== locationToRemove));
  };

  // Education Handlers
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        degree: "",
        specialization: "",
        university: "",
        yearOfPassing: "",
        grades: "",
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  // Work Experience Handlers
  const handleAddWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        jobTitle: "",
        companyName: "",
        durationFrom: "",
        durationTo: "",
        employmentType: "",
        responsibilities: "",
      },
    ]);
  };

  const handleRemoveWorkExperience = (index) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperience = [...workExperience];
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setWorkExperience(newWorkExperience);
  };

  // Skills Handlers
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim(), proficiency: skillProficiency }]);
      setNewSkill("");
      setSkillProficiency("");
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Certifications Handlers
  const handleAddCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: "",
        issuingOrganization: "",
        validity: "",
        certificateFile: null,
      },
    ]);
  };

  const handleRemoveCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setCertifications(newCertifications);
  };

  const handleCertificateFileUpload = (index, file) => {
    const newCertifications = [...certifications];
    newCertifications[index].certificateFile = file;
    setCertifications(newCertifications);
  };

  // Projects Handlers
  const handleAddProject = () => {
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        technologiesUsed: "",
        githubLink: "",
        liveLink: "",
      },
    ]);
  };

  const handleRemoveProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  // Resume Handlers
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Resume file size exceeds 5MB limit.");
        return;
      }
      setResume(file);
      setResumeTitle(file.name);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const updatedUser = {
        ...users[userIndex],
        name,
        phoneNumber,
        gender,
        dateOfBirth,
        location,
        willingToRelocate,
        currentJobTitle,
        profileImage,
        preferredRoles,
        preferredLocations,
        employmentType,
        expectedSalary,
        availableFrom,
        remoteWorkPreference,
        education,
        workExperience,
        isFresher,
        skills,
        certifications,
        projects,
        resume: resume ? { name: resume.name, size: resume.size, type: resume.type, data: await fileToBase64(resume) } : null, // Store resume as base64
        resumeTitle,
        socialLinks,
      };

      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      
      window.dispatchEvent(new Event('userStateChanged'));
      
      setUser(userWithoutPassword);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      calculateProfileCompletion(updatedUser);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Utility function to convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-white overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-image-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
                  >
                    <Upload className="h-4 w-4" />
                    <input
                      id="profile-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="text-lg text-gray-600 mt-1">{currentJobTitle || (isFresher ? "Fresher" : "")}</p>
                <div className="flex items-center text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{location || "Add location"}</span>
                </div>
              </div>
              <Button
                variant={isEditing ? "danger" : "blue"}
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-900">Profile Completion</h2>
            <span className="text-sm font-medium text-blue-600">{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
          {profileCompletion < 100 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Suggestions to complete your profile:</h3>
              <ul className="space-y-2">
                {!name && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Add your full name
                  </li>
                )}
                {!currentJobTitle && !isFresher && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Add your current job title or mark as Fresher
                  </li>
                )}
                {!location && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Add your location
                  </li>
                )}
                {preferredRoles.length === 0 && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Add your preferred job roles
                  </li>
                )}
                {education.length === 0 && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Add your education details
                  </li>
                )}
                {!isFresher && workExperience.length === 0 && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Add your work experience
                  </li>
                )}
                {skills.length === 0 && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Add your skills
                  </li>
                )}
                {!resume && (
                  <li className="flex items-center text-sm text-gray-600">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    Upload your resume
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    disabled={true}
                    className="pl-10 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    disabled={!isEditing}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Location
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, State, Country"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Job Title
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    value={currentJobTitle}
                    onChange={(e) => setCurrentJobTitle(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., Software Engineer"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="willing-to-relocate"
                  checked={willingToRelocate}
                  onChange={(e) => setWillingToRelocate(e.target.checked)}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="willing-to-relocate"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Willing to relocate
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Career Preferences */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Career Preferences</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Preferred Job Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Job Roles
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {preferredRoles.map((role, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {role}
                    {isEditing && (
                      <button
                        onClick={() => handleRemovePreferredRole(role)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newPreferredRole}
                    onChange={(e) => setNewPreferredRole(e.target.value)}
                    placeholder="e.g., Software Engineer, Data Scientist"
                    className="flex-1"
                  />
                  <Button
                    variant="blue"
                    onClick={handleAddPreferredRole}
                    disabled={!newPreferredRole.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Preferred Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Locations
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {preferredLocations.map((loc, index) => (
                  <div
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {loc}
                    {isEditing && (
                      <button
                        onClick={() => handleRemovePreferredLocation(loc)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newPreferredLocation}
                    onChange={(e) => setNewPreferredLocation(e.target.value)}
                    placeholder="e.g., Bangalore, Hyderabad"
                    className="flex-1"
                  />
                  <Button
                    variant="blue"
                    onClick={handleAddPreferredLocation}
                    disabled={!newPreferredLocation.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employment Type
                </label>
                <div className="mt-1">
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    disabled={!isEditing}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  >
                    <option value="">Select employment type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expected Salary (INR per annum)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., 800000 or Negotiable"
                    className="pl-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Available From
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remote Work Preference
                </label>
                <div className="mt-1">
                  <select
                    value={remoteWorkPreference}
                    onChange={(e) => setRemoteWorkPreference(e.target.value)}
                    disabled={!isEditing}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  >
                    <option value="">Select preference</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Education</h2>
            {isEditing && (
              <Button variant="blue" onClick={handleAddEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            )}
          </div>
          <div className="p-6 space-y-6">
            {education.length === 0 && !isEditing ? (
              <p className="text-gray-500">No education details added yet.</p>
            ) : (
              education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Degree</label>
                      <Input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., B.Tech"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialization</label>
                      <Input
                        type="text"
                        value={edu.specialization}
                        onChange={(e) => handleEducationChange(index, "specialization", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">University/College</label>
                      <Input
                        type="text"
                        value={edu.university}
                        onChange={(e) => handleEducationChange(index, "university", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., XYZ University"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Year of Passing</label>
                      <Input
                        type="text"
                        value={edu.yearOfPassing}
                        onChange={(e) => handleEducationChange(index, "yearOfPassing", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Grades/CGPA (optional)</label>
                      <Input
                        type="text"
                        value={edu.grades}
                        onChange={(e) => handleEducationChange(index, "grades", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., 8.5/10 or A+"
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button variant="danger" onClick={() => handleRemoveEducation(index)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Education
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
            {isEditing && !isFresher && (
              <Button variant="blue" onClick={handleAddWorkExperience}>
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            )}
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="is-fresher"
                checked={isFresher}
                onChange={(e) => setIsFresher(e.target.checked)}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is-fresher"
                className="ml-2 block text-sm text-gray-700"
              >
                I am a Fresher
              </label>
            </div>

            {!isFresher ? (
              workExperience.length === 0 && !isEditing ? (
                <p className="text-gray-500">No work experience added yet.</p>
              ) : (
                workExperience.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Job Title</label>
                        <Input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => handleWorkExperienceChange(index, "jobTitle", e.target.value)}
                          disabled={!isEditing}
                          placeholder="e.g., Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <Input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => handleWorkExperienceChange(index, "companyName", e.target.value)}
                          disabled={!isEditing}
                          placeholder="e.g., Google"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration From</label>
                        <Input
                          type="date"
                          value={exp.durationFrom}
                          onChange={(e) => handleWorkExperienceChange(index, "durationFrom", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration To</label>
                        <Input
                          type="date"
                          value={exp.durationTo}
                          onChange={(e) => handleWorkExperienceChange(index, "durationTo", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                        <select
                          value={exp.employmentType}
                          onChange={(e) => handleWorkExperienceChange(index, "employmentType", e.target.value)}
                          disabled={!isEditing}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                        >
                          <option value="">Select type</option>
                          <option value="full-time">Full-time</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                      <textarea
                        rows={3}
                        value={exp.responsibilities}
                        onChange={(e) => handleWorkExperienceChange(index, "responsibilities", e.target.value)}
                        disabled={!isEditing}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                        placeholder="Describe your responsibilities..."
                      />
                    </div>
                    {isEditing && (
                      <div className="flex justify-end">
                        <Button variant="danger" onClick={() => handleRemoveWorkExperience(index)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Experience
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )
            ) : (
              <p className="text-gray-500">You are marked as a Fresher. Work experience section is hidden.</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Skills</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {skill.name}{skill.proficiency && ` (${skill.proficiency})`}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., React, Node.js"
                  className="col-span-2"
                />
                <select
                  value={skillProficiency}
                  onChange={(e) => setSkillProficiency(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                >
                  <option value="">Select proficiency</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <Button
                  variant="blue"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim() || !skillProficiency}
                  className="col-span-3 sm:col-span-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Certifications</h2>
            {isEditing && (
              <Button variant="blue" onClick={handleAddCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            )}
          </div>
          <div className="p-6 space-y-6">
            {certifications.length === 0 && !isEditing ? (
              <p className="text-gray-500">No certifications added yet.</p>
            ) : (
              certifications.map((cert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                      <Input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., AWS Certified Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Issuing Organization</label>
                      <Input
                        type="text"
                        value={cert.issuingOrganization}
                        onChange={(e) => handleCertificationChange(index, "issuingOrganization", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., Amazon Web Services"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Validity (optional)</label>
                      <Input
                        type="text"
                        value={cert.validity}
                        onChange={(e) => handleCertificationChange(index, "validity", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., 2 years or Lifetime"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Upload Certificate (optional)</label>
                      <div className="mt-1 flex items-center">
                        <label htmlFor={`certificate-upload-${index}`} className={`flex items-center justify-center p-2 border border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 text-sm ${
                          !isEditing && "opacity-50 cursor-not-allowed"
                        }`}>
                          <Upload className="h-4 w-4 mr-2" />
                          {cert.certificateFile ? "Change File" : "Choose File"}
                          <input
                            id={`certificate-upload-${index}`}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => handleCertificateFileUpload(index, e.target.files[0])}
                            disabled={!isEditing}
                          />
                        </label>
                        {cert.certificateFile && (
                          <span className="ml-2 text-sm text-gray-600">{cert.certificateFile.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button variant="danger" onClick={() => handleRemoveCertification(index)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Certification
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Projects (Optional)</h2>
            {isEditing && (
              <Button variant="blue" onClick={handleAddProject}>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
          <div className="p-6 space-y-6">
            {projects.length === 0 && !isEditing ? (
              <p className="text-gray-500">No projects added yet.</p>
            ) : (
              projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Title</label>
                      <Input
                        type="text"
                        value={project.title}
                        onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., Job Portal Platform"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
                      <Input
                        type="text"
                        value={project.technologiesUsed}
                        onChange={(e) => handleProjectChange(index, "technologiesUsed", e.target.value)}
                        disabled={!isEditing}
                        placeholder="e.g., React, Node.js, MongoDB"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GitHub Link (optional)</label>
                      <Input
                        type="url"
                        value={project.githubLink}
                        onChange={(e) => handleProjectChange(index, "githubLink", e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://github.com/your-project"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Live Link (optional)</label>
                      <Input
                        type="url"
                        value={project.liveLink}
                        onChange={(e) => handleProjectChange(index, "liveLink", e.target.value)}
                        disabled={!isEditing}
                        placeholder="https://your-live-project.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                      disabled={!isEditing}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                      placeholder="Describe your project..."
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end">
                      <Button variant="danger" onClick={() => handleRemoveProject(index)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Project
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Resume Upload Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Resume Upload</h2>
          </div>
          <div className="p-6 space-y-4">
            {resume ? (
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{resumeTitle || "Resume"}</p>
                  <p className="text-xs text-gray-500">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {isEditing && (
                  <Button
                    variant="danger"
                    onClick={() => { setResume(null); setResumeTitle(""); }}
                    className="ml-4"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Resume
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="resume-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                    !isEditing && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, or DOCX (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={!isEditing}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Social Links</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        linkedin: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GitHub URL
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="url"
                    value={socialLinks.github}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        github: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Portfolio/Personal Website
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="url"
                    value={socialLinks.portfolio}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        portfolio: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://your-portfolio.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  HackerRank URL (optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="url"
                    value={socialLinks.hackerrank}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        hackerrank: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://www.hackerrank.com/username"
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  LeetCode URL (optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="url"
                    value={socialLinks.leetcode}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        leetcode: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="https://leetcode.com/username"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-lg mt-6">
            <div className="max-w-4xl mx-auto flex justify-end">
              <Button
                variant="blue"
                onClick={handleSave}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 