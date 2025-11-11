// // import axios from 'axios';

// // const API_BASE_URL = 'http://localhost:5000/api';

// // const api = axios.create({
// //   baseURL: API_BASE_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // export const getEnrollmentData = async () => {
// //   try {
// //     const response = await api.get('/enrollment');
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching enrollment data:', error);
// //     throw error;
// //   }
// // };

// // export const getColleges = async () => {
// //   try {
// //     const response = await api.get('/colleges');
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching colleges:', error);
// //     throw error;
// //   }
// // };

// // export const getForecast = async (historicalData) => {
// //   try {
// //     const response = await api.post('/forecast', { historical: historicalData });
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching forecast:', error);
// //     throw error;
// //   }
// // };

// // export const getStats = async (year) => {
// //   try {
// //     const response = await api.get(`/stats?year=${year}`);
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching stats:', error);
// //     throw error;
// //   }
// // };

// // export default api;

// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Enrollment API calls
// export const enrollmentAPI = {
//   // Get all enrollments with optional filters
//   getAll: (filters = {}) => {
//     const params = new URLSearchParams();
//     if (filters.college && filters.college !== 'all') params.append('college', filters.college);
//     if (filters.program && filters.program !== 'all') params.append('program', filters.program);
//     if (filters.year && filters.year !== 'all') params.append('year', filters.year);
//     if (filters.semester && filters.semester !== 'all') params.append('semester', filters.semester);
    
//     return api.get(`/api/enrollments?${params.toString()}`);
//   },

//   // Get single enrollment
//   getById: (id) => api.get(`/api/enrollments/${id}`),

//   // Create new enrollment
//   create: (data) => api.post('/api/enrollments', data),

//   // Bulk insert enrollments (CSV upload)
//   bulkCreate: (data) => api.post('/api/enrollments/bulk', data),

//   // Update enrollment
//   update: (id, data) => api.put(`/api/enrollments/${id}`, data),

//   // Delete enrollment
//   delete: (id) => api.delete(`/api/enrollments/${id}`),

//   // Get statistics
//   getStats: () => api.get('/api/enrollments/stats'),
// };

// export default api;