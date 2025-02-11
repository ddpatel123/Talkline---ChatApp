import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = 'http://localhost:5000';


export const useAuthStore = create((set,get) => ({
    authuser: null,
    isCheckingAuth: true,
    isloggingin: false,
    issigningup: false,
    isupdatingprofile: false,
    onlineusers: [],
    socket : null,

    checkauth : async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authuser: res.data });
            get().connectsocket();

            
        }
        catch (error) {
            set({authuser: null});
            console.error(error);
        }
        finally {
            set({isCheckingAuth: false});
        }
    }
    ,
    signup: async (formData) => {
        set({ issigningup: true });
        try {
            const res = await axiosInstance.post('/auth/signup', formData);
            toast.success('Account created successfully');
            set({ authuser: res.data });
            get().connectsocket();
        }
        catch (error) { 
            toast.error(error.response.data.message);
        }
        finally { 
            set({issigningup: false});
        } 
        
    },

    login: async (formData) => {
        set({ isloggingin: true });

        try {
            const res = await axiosInstance.post('/auth/login', formData);
            set({ authuser: res.data });
            toast.success('Logged in successfully');

            get().connectsocket();
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
        finally {
            set({ isloggingin: false });
        }
        
    }
    ,

    logout: async () => {
        try {
            await axiosInstance.get('/auth/logout');
            set({ authuser: null });
            toast.success('Logged out successfully');
            get().disconnectsocket();
        }
        catch (error) {
            toast.error(error.response.data.message);
        }

    },

    updateprofile: async (data) => {
        set({ isupdatingprofile: true });
        try {
            const res = await axiosInstance.put('/auth/update/profile', data);
            set({ authuser: res.data });
            toast.success('Profile updated successfully');
         }
        catch (error) {
            toast.error(error.response.data.message);
         }
        finally { 
            set({ isupdatingprofile: false });
        }
    }
    ,
    connectsocket: () => {
        const { authuser } = get();
        if (!authuser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authuser._id
            }
        });
        socket.connect();
        set({ socket });
        socket.on('getonlineusers', (userIds) => {
            set({ onlineusers: userIds });
        })  // function is used for listening to the event as soon as we login,at any time we got this event then we are getting userIds as a data
     }
    ,
    disconnectsocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }

    }



}));    