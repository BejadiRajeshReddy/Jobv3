import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, GraduationCap, Code, FolderOpen } from 'lucide-react';

// Import all the refactored components
import PersonalInfoSection from '../components/profile/PersonalInfoSection';
import SocialLinksSection from '../components/profile/SocialLinksSection';
import ResumeSection from '../components/profile/ResumeSection';
import ExperienceSection from '../components/profile/ExperienceSection';
import EducationSection from '../components/profile/EducationSection';
import SkillsSection from '../components/profile/SkillsSection';
import ProjectsSection from '../components/profile/ProjectsSection';

const CandidateProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    about: '',
    profilePicture: null
  });
  const [socialLinks, setSocialLinks] = useState({
    linkedin: '',
    github: '',
    portfolio: '',
    twitter: ''
  });
  const [resume, setResume] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

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
      loadProfileData(userData.id);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const loadProfileData = (userId) => {
    const savedProfile = localStorage.getItem(`profile_${userId}`);
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setProfile(profileData.profile || profile);
      setSocialLinks(profileData.socialLinks || socialLinks);
      setResume(profileData.resume || null);
      setExperiences(profileData.experiences || []);
      setEducation(profileData.education || []);
      setSkills(profileData.skills || []);
      setProjects(profileData.projects || []);
    }
  };

  const saveProfileData = (updatedData) => {
    if (!currentUser) return;
    
    const profileData = {
      profile,
      socialLinks,
      resume,
      experiences,
      education,
      skills,
      projects,
      ...updatedData
    };
    
    localStorage.setItem(`profile_${currentUser.id}`, JSON.stringify(profileData));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    saveProfileData({ profile: updatedProfile });
  };

  const handleSocialLinksUpdate = (updatedSocialLinks) => {
    setSocialLinks(updatedSocialLinks);
    saveProfileData({ socialLinks: updatedSocialLinks });
  };

  const handleResumeUpdate = (updatedResume) => {
    setResume(updatedResume);
    saveProfileData({ resume: updatedResume });
  };

  const handleExperiencesUpdate = (updatedExperiences) => {
    setExperiences(updatedExperiences);
    saveProfileData({ experiences: updatedExperiences });
  };

  const handleEducationUpdate = (updatedEducation) => {
    setEducation(updatedEducation);
    saveProfileData({ education: updatedEducation });
  };

  const handleSkillsUpdate = (updatedSkills) => {
    setSkills(updatedSkills);
    saveProfileData({ skills: updatedSkills });
  };

  const handleProjectsUpdate = (updatedProjects) => {
    setProjects(updatedProjects);
    saveProfileData({ projects: updatedProjects });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderOpen }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional profile and showcase your skills</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 p-6">
          <div className="flex flex-wrap border-b border-gray-200 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 rounded-lg border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Personal Info and Social Links in same row for laptop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PersonalInfoSection 
                  profile={profile} 
                  onUpdate={handleProfileUpdate} 
                />
                <SocialLinksSection 
                  socialLinks={socialLinks} 
                  onUpdate={handleSocialLinksUpdate} 
                />
              </div>
              
              {/* Resume in full width row */}
              <ResumeSection 
                resume={resume} 
                onUpdate={handleResumeUpdate} 
              />
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
      </div>
    </div>
  );
};

export default CandidateProfile;