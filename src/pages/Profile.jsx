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
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Basic Information
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    location: "",
    willingToRelocate: false,
    currentJobTitle: "",
    profileImage: null,
    preferredRoles: [],
    preferredLocations: [],
    employmentType: "",
    expectedSalary: "",
    availableFrom: "",
    remoteWorkPreference: "",
    education: [],
    workExperience: [],
    isFresher: false,
    skills: [],
    certifications: [],
    projects: [],
    resume: null,
    resumeTitle: "",
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      hackerrank: "",
      leetcode: "",
    },
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setProfile(currentUser);
    calculateProfileCompletion(currentUser);
    setIsLoading(false);
  }, [navigate]);

  const calculateProfileCompletion = (userData) => {
    const totalFields = 20;
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
    if (userData.preferredRoles?.length > 0) completedFields++;
    if (userData.preferredLocations?.length > 0) completedFields++;
    if (userData.employmentType) completedFields++;
    if (userData.expectedSalary) completedFields++;
    if (userData.availableFrom) completedFields++;
    if (userData.remoteWorkPreference) completedFields++;

    // Education, Work Experience, Skills, Certifications, Projects, Resume, Social Links
    if (userData.education?.length > 0) completedFields++;
    if (userData.workExperience?.length > 0 || userData.isFresher)
      completedFields++;
    if (userData.skills?.length > 0) completedFields++;
    if (userData.certifications?.length > 0) completedFields++;
    if (userData.projects?.length > 0) completedFields++;
    if (userData.resume) completedFields++;
    if (
      userData.socialLinks &&
      Object.values(userData.socialLinks).some((link) => link)
    )
      completedFields++;

    setProfileCompletion(Math.round((completedFields / totalFields) * 100));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Resume file size exceeds 5MB limit.");
        return;
      }
      setProfile((prev) => ({ ...prev, resume: file, resumeTitle: file.name }));
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u) => u.id === profile.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const updatedUser = {
        ...users[userIndex],
        ...profile,
        resume: profile.resume
          ? {
              name: profile.resume.name,
              size: profile.resume.size,
              type: profile.resume.type,
              data: await fileToBase64(profile.resume),
            }
          : null,
      };

      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = updatedUser;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

      window.dispatchEvent(new Event("userStateChanged"));

      setProfile(userWithoutPassword);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      calculateProfileCompletion(updatedUser);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
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
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {profile.currentJobTitle ||
                    (profile.isFresher ? "Fresher" : "")}
                </p>
                <div className="flex items-center text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location || "Add location"}</span>
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
            <h2 className="text-lg font-medium text-gray-900">
              Profile Completion
            </h2>
            <span className="text-sm font-medium text-blue-600">
              {profileCompletion}%
            </span>
          </div>
          <Progress value={profileCompletion} className="h-2" />
        </div>

        {/* Basic Information */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>
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
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
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
                    value={profile.email}
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
                    value={profile.phoneNumber}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
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
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
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
                    value={profile.dateOfBirth}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }))
                    }
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
                    value={profile.location}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
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
                    value={profile.currentJobTitle}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        currentJobTitle: e.target.value,
                      }))
                    }
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
                  checked={profile.willingToRelocate}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      willingToRelocate: e.target.checked,
                    }))
                  }
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
