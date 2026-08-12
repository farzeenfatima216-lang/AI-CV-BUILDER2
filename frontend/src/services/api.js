import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const requestUrl = `${config.baseURL || ''}${config.url}`
  console.debug('[API REQUEST]', config.method?.toUpperCase(), requestUrl, 'body=', config.data)
  return config
})

api.interceptors.response.use(
  (response) => {
    const requestUrl = `${response.config.baseURL || ''}${response.config.url}`
    console.debug('[API RESPONSE]', response.status, requestUrl, 'data=', response.data)
    return response
  },
  (error) => {
    const response = error?.response
    const requestConfig = response?.config || error?.config || {}
    const requestUrl = `${requestConfig.baseURL || ''}${requestConfig.url || ''}`
    console.error('[API ERROR]', error.message, 'url=', requestUrl, 'status=', response?.status, 'data=', response?.data)
    return Promise.reject(error)
  }
)

// Use /auth/register to match backend alias; dev proxy will forward /api to backend
export const signup = (payload) => api.post('/auth/register', payload)
export const login = (payload) => api.post('/auth/login', payload)
export const getProfile = () => api.get('/auth/me')
export const createResume = (payload) => api.post('/resume/create', payload)
export const getResume = (id) => api.get(`/resume/${id}`)
export const updateResume = (id, payload) => api.put(`/resume/update/${id}`, payload)
export const improveText = (payload) => api.post('/ai/improve', payload)
export const improveSkills = (payload) => api.post('/ai/improve-skills', payload)
export const generateSummary = (payload) => api.post('/ai/summary', payload)
export const generateResumeSummary = (payload) => api.post('/ai/summary', payload)
export const rewriteText = (payload) => api.post('/ai/rewrite', payload)
export const rewriteSummary = (payload) => api.post('/ai/rewrite-summary', payload)
export const rewriteExperience = (payload) => api.post('/ai/experience-rewrite', payload)
export const generateCoverLetter = (payload) => api.post('/ai/cover-letter', payload)
export const generateLinkedInAbout = (payload) => api.post('/ai/linkedin', payload)
export const analyzeAts = (payload) => api.post('/ats/analyze', payload)
export const dashboardStats = () => api.get('/dashboard')

export default api
