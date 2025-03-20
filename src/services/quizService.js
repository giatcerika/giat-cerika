// services/quizService.js
import api from './api';

export const getAllQuizzes = () => api.get('/quiz');

export const getQuizById = (id) => api.get(`/quiz/${id}`);

export const createQuiz = async (formData) => {
  const newFormData = new FormData();

  newFormData.append('title', formData.get('title'));
  newFormData.append('description', formData.get('description'));
  newFormData.append('questions', formData.get('questions'));

  // Handle images
  for (let i = 0; i < 50; i++) {
    const file = formData.get(`image_${i}`);
    if (file) {
      newFormData.append(`image_${i}`, file);
    }
  }

  return api.post('/quiz', newFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Tambahkan fungsi updateQuiz
export const updateQuiz = async (id, formData) => {
  const newFormData = new FormData();

  newFormData.append('title', formData.get('title'));
  newFormData.append('description', formData.get('description'));
  newFormData.append('questions', formData.get('questions'));

  // Handle images
  for (let i = 0; i < 50; i++) {
    const file = formData.get(`image_${i}`);
    if (file instanceof File) {
      newFormData.append(`image_${i}`, file);
    }
  }

  return api.put(`/quiz/${id}`, newFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteQuiz = (id) => api.delete(`/quiz/${id}`);