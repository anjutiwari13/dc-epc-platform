// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // 1. Original Specifications Upload (PDF)
  uploadSpecs: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/specs/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 2. Vendor Submittal Sheet Audit (PDF + Metadata)
  verifySubmittal: async (file, vendorName, equipmentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vendor_name', vendorName);
    formData.append('equipment_type', equipmentType);
    const response = await axios.post(`${API_BASE_URL}/compliance/verify`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 3. AI Engineer Chat Query
  chatQuery: async (question) => {
    const response = await apiClient.post(`/chat/query?question=${encodeURIComponent(question)}`);
    return response.data;
  },

  // 4. Fetch History/Dashboard Records
  getHistory: async () => {
    const response = await apiClient.get('/dashboard/history');
    return response.data;
  },
};