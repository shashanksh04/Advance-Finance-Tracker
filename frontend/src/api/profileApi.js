import axiosInstance from './axiosInstance';

export const getProfile = async () => {
  const response = await axiosInstance.get('/profile');
  return response.data;
};

export const uploadProfilePhoto = async (formData) => {
  const response = await axiosInstance.post('/profile/upload-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
