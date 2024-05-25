import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

export const signUp = async (userData) => {
    return await api.post('/user/sign_up', userData);
};

export const login = async (userData) => {
    return await api.post('/user/login', userData);
};

// Προσθέστε περισσότερες λειτουργίες ανάλογα με τις ανάγκες σας
