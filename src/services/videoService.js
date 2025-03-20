import api from './api';

export const getAllVideos = () => api.get('/video');

export const getVideoById = (id) => api.get(`/video/${id}`);

export const createVideo = (data) => api.post('/video', data);

export const updateVideo = (id, data) => api.put(`/video/${id}`, data);

export const deleteVideo = (id) => api.delete(`/video/${id}`);