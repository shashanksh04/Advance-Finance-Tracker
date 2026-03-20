import React, { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, uploadProfilePhoto } from '../api/profileApi';
import { UserCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/formatters';

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const mutation = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      toast.success('Profile photo updated successfully!');
      queryClient.invalidateQueries(['profile']);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload photo.');
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      mutation.mutate(formData);
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current.click();
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="flex justify-center items-start pt-10">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md text-center">
        <div className="relative w-28 h-28 mx-auto mb-4">
          {profile.profile_photo ? (
            <img
              src={`http://localhost:8000/${profile.profile_photo}`}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full"
            />
          ) : (
            <UserCircle2 size={112} className="text-gray-400" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold">{profile.username}</h2>
        <p className="text-gray-500">{profile.email}</p>
        <p className="text-sm text-gray-400 mt-2">
          Member since: {formatDate(profile.created_at)}
        </p>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={handleChangePhotoClick}
          disabled={mutation.isLoading}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {mutation.isLoading ? 'Uploading...' : 'Change Photo'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
