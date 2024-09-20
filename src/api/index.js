import axios from 'axios';

// Axios 인스턴스 설정
const api = axios.create({
    timeout: 1000,
});

export default api;