import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Import all profile components
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalInfoForm from '../components/profile/PersonalInfoForm';
import ResumeSection from '../components/profile/ResumeSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import EducationSection from '../components/profile/EducationSection';
import SkillsSection from '../components/profile/SkillsSection';
import ProjectsSection from '../components/profile/ProjectsSection';

// Import custom hook
import { useProfileData } from '../hooks/useProfileData';

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

  // Get current user
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'candidate') {
        navigate('/dashboard');
        return;
      }
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Use profile data hook
  const {
    user,
    profilePicture,
    resume,
    experiences,
    education,
    skills,
    projects,
    loading,
    updateProfileData,
    updateUserData
  } = useProfileData(currentUser?.id);

  // Event handlers
  const handleProfilePictureChange = (imageData) => {
    updateProfileData({ profilePicture: imageData });
  };

  const handlePersonalInfoSave = (formData) => {
    updateUserData(formData);
    setShowPersonalInfoForm(false);
  };

  const handleResumeUpload = (file, error) => {
    if (error) {
      setUploadError(error);
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resumeData = {
          name: file.name,
          size: file.size,
          type: file.type,
          url: e.target.result,
          uploadedAt: new Date().toISOString()
        };
        updateProfileData({ resume: resumeData });
        setUploadError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeDelete = () => {
    if (window.confirm('Are you sure you want to delete your resume?')) {
      updateProfileData({ resume: null });
    }
  };

  const handleExperiencesUpdate = (newExperiences) => {
    updateProfileData({ experiences: newExperiences });
  };

  const handleEducationUpdate = (newEducation) => {
    updateProfileData({ education: newEducation });
  };

  const handleSkillsUpdate = (newSkills) => {
    updateProfileData({ skills: newSkills });
  };

  const handleProjectsUpdate = (newProjects) => {
    updateProfileData({ projects: newProjects });
  };

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderOpen }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          profilePicture={profilePicture}
          onProfilePictureChange={handleProfilePictureChange}
          onEditPersonalInfo={() => setShowPersonalInfoForm(true)}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  className={`rounded-lg px-6 py-3 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Info, Social Links, About - Single Row on Desktop */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                        <p className="text-gray-600">Your basic details</p>
                      </div>
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-gray-900 font-medium">{user?.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Location</label>
                        <p className="text-gray-900">{user?.location || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Links</h2>
                        <p className="text-gray-600">Your online presence</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {user?.website && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Website</label>
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 truncate">
                            {user.website}
                          </a>
                        </div>
                      )}
                      {user?.linkedin && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                          <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 truncate">
                            {user.linkedin}
                          </a>
                        </div>
                      )}
                      {user?.github && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">GitHub</label>
                          <a href={user.github} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 truncate">
                            {user.github}
                          </a>
                        </div>
                      )}
                      {user?.twitter && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Twitter</label>
                          <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:text-blue-800 truncate">
                            {user.twitter}
                          </a>
                        </div>
                      )}
                      {!user?.website && !user?.linkedin && !user?.github && !user?.twitter && (
                        <p className="text-gray-500 italic">No social links added</p>
                      )}
                    </div>
                  </div>

                  {/* About Me */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">About Me</h2>
                        <p className="text-gray-600">Professional summary</p>
                      </div>
                    </div>
                    <div>
                      {user?.about ? (
                        <p className="text-gray-700 whitespace-pre-line">{user.about}</p>
                      ) : (
                        <p className="text-gray-500 italic">No professional summary added</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Section - Full Width Row */}
              <div className="lg:col-span-3">
                <ResumeSection
                  resume={resume}
                  onResumeUpload={handleResumeUpload}
                  onResumeDelete={handleResumeDelete}
                  uploadError={uploadError}
                />
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <ExperienceSection
              experiences={experiences}
              onUpdate={handleExperiencesUpdate}
            />
          )}

          {activeTab === 'education' && (
            <EducationSection
              education={education}
              onUpdate={handleEducationUpdate}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsSection
              skills={skills}
              onUpdate={handleSkillsUpdate}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsSection
              projects={projects}
              onUpdate={handleProjectsUpdate}
            />
          )}
        </div>

        {/* Personal Info Form Modal */}
        {showPersonalInfoForm && (
          <PersonalInfoForm
            user={user}
            onSave={handlePersonalInfoSave}
            onCancel={() => setShowPersonalInfoForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;