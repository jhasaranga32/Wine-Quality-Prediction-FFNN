import axios from 'axios';

const BASE = '/api/predictions';

export const predictAndSave = (data) => axios.post(`${BASE}/`, data);
export const previewPrediction = (data) => axios.post(`${BASE}/preview/`, data);
export const getPredictionHistory = () => axios.get(`${BASE}/history/`);
export const getPrediction = (id) => axios.get(`${BASE}/${id}/`);
export const updatePrediction = (id, data) => axios.put(`${BASE}/${id}/`, data);
export const deletePrediction = (id) => axios.delete(`${BASE}/${id}/`);
