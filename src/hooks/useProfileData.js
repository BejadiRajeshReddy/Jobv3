import { useState, useEffect } from 'react';

export const useProfileData = (userId) => {
  const [profileData, setProfileData] = useState({
    user: null,
    profilePicture: null,
    resume: null,
    experiences: [],
    education: [],
    skills: [],
    projects: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadProfileData(userId);
  }, [userId]);

  const loadProfileData = (userId) => {
    try {
      // Load user data
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === userId);

      // Load profile data
      const profileKey = `profile_${userId}`;
      const savedProfile = localStorage.getItem(profileKey);
      const profile = savedProfile ? JSON.parse(savedProfile) : {};

      setProfileData({
        user: user || null,
        profilePicture: profile.profilePicture || null,
        resume: profile.resume || null,
        experiences: profile.experiences || [],
        education: profile.education || [],
        skills: profile.skills || [],
        projects: profile.projects || []
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = (updates) => {
    setProfileData(prev => {
      const newData = { ...prev, ...updates };
      
      // Save to localStorage
      const profileKey = `profile_${profileData.user?.id}`;
      const { user, ...profileToSave } = newData;
      localStorage.setItem(profileKey, JSON.stringify(profileToSave));
      
      return newData;
    });
  };

  const updateUserData = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === profileData.user?.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user in localStorage if it's the same user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id === profileData.user?.id) {
          localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...userData }));
          window.dispatchEvent(new Event('userStateChanged'));
        }
        
        setProfileData(prev => ({
          ...prev,
          user: { ...prev.user, ...userData }
        }));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return {
    ...profileData,
    loading,
    updateProfileData,
    updateUserData,
    refreshData: () => loadProfileData(userId)
  };
};