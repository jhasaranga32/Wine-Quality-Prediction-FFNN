import axios from 'axios';

const BASE = '/api/barrels';

export const getBarrels = () => axios.get(`${BASE}/`);
export const getBarrel = (id) => axios.get(`${BASE}/${id}/`);
export const createBarrel = (data) => axios.post(`${BASE}/`, data);
export const updateBarrel = (id, data) => axios.put(`${BASE}/${id}/`, data);
export const deleteBarrel = (id) => axios.delete(`${BASE}/${id}/`);
