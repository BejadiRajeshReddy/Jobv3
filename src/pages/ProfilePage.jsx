import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  Building,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});
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
      setFormData(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = (section) => {
    // Update localStorage
    const updatedUser = { ...currentUser, ...formData };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setEditingSection(null);

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const handleCancel = () => {
    setFormData(currentUser);
    setEditingSection(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    const newSkill = prompt("Enter a new skill:");
    if (newSkill && newSkill.trim()) {
      const updatedSkills = [...(formData.skills || []), newSkill.trim()];
      handleInputChange("skills", updatedSkills);
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    handleInputChange("skills", updatedSkills);
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
          <p className="mt-2 text-gray-600">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentUser.name}
                </h1>
                <p className="text-lg text-gray-600 capitalize">
                  {currentUser.role}
                </p>
                {currentUser.role === "candidate" && (
                  <p className="text-sm text-gray-500 mt-1">
                    {currentUser.email}
                  </p>
                )}
                {currentUser.role === "recruiter" && currentUser.company && (
                  <p className="text-sm text-gray-500 mt-1">
                    {currentUser.company.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                {editingSection !== "personal" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit("personal")}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {editingSection === "personal" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {currentUser.role === "candidate" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        value={formData.email || ""}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      value={formData.phoneNumber || ""}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="blue"
                      size="sm"
                      onClick={() => handleSave("personal")}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {currentUser.role === "candidate"
                        ? currentUser.email
                        : currentUser.company?.email || "Not provided"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {currentUser.phoneNumber || "Not provided"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Preferred Job Roles - Placeholder Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Preferred Job Roles
                </h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Role
                </Button>
              </div>

              {/* Placeholder Content */}
              <div className="space-y-3">
                {/* Loading skeleton or empty state */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No preferred job roles yet
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Add your preferred job roles to help employers find you more easily.
                  </p>
                  <Button variant="blue" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Role
                  </Button>
                </div>

                {/* Example of what roles might look like when added */}
                <div className="opacity-50 pointer-events-none">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Frontend Developer</h4>
                          <p className="text-sm text-gray-600">React, JavaScript, TypeScript</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Primary</span>
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section - Only for candidates */}
            {currentUser.role === "candidate" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Skills
                  </h3>
                  <Button variant="outline" size="sm" onClick={addSkill}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.skills || []).length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">
                      No skills added yet. Click "Add Skill" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Company Information - Only for recruiters */}
            {currentUser.role === "recruiter" && currentUser.company && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                  <Building className="h-5 w-5 mr-2" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {currentUser.company.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {currentUser.company.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {currentUser.company.location || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {currentUser.company.industry || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500">Member since</span>
                    <div className="text-gray-900">
                      {new Date(currentUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <span className="text-sm text-gray-500">Account type</span>
                    <div className="text-gray-900 capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;