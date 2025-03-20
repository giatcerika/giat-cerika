import api from './api';

export const getAllMateri = () => api.get('/materi');

export const getMateriById = (id) => api.get(`/materi/${id}`);

export const createMateri = (formData) => {
  return api.post('/materi', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateMateri = (id, formData) => {
  return api.put(`/materi/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteMateri = (id) => api.delete(`/materi/${id}`);