import React from 'react';
import { Camera, MapPin, Mail, Phone, Calendar, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';

const ProfileHeader = ({ 
  user, 
  profilePicture, 
  onProfilePictureChange, 
  onEditPersonalInfo 
}) => {
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onProfilePictureChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative px-8 py-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              )}
            </div>
            <label className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors group-hover:scale-110">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-white">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {user?.name || 'Your Name'}
                </h1>
                <p className="text-xl text-blue-100 mb-4">
                  {user?.title || 'Professional Title'}
                </p>
                <div className="flex flex-wrap gap-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user?.phoneNumber}</span>
                  </div>
                  {user?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                  {user?.dateOfBirth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Born {new Date(user.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={onEditPersonalInfo}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;