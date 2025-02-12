import { create } from 'zustand'  
import { toast } from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import {useAuthStore} from './useAuthStore';

export const  useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selecteduser: null,
    isusersloading: false,
    ismessagesloading: false,


    getusers: async () => {
        set({ isusersloading: true });
        try {
            const res = await axiosInstance.get('message/users');
            console.log(res.data);
            set({ users: res.data});
        }
        catch(error) {
            toast.error('Error in fetching users');
        }
        finally {
            set({ isusersloading: false });
        }

    },
    getmessages: async (userid) => {
        set({ ismessagesloading: true });
        try {
            const res = await axiosInstance.get(`message/user/${userid}`);
            set({ messages: res.data });

            
        }
        catch(error) {
            toast.error('Error in fetching messages');
        }   
        finally {
            set({ ismessagesloading: false });

        }
        
    },

    sendmessage: async (messageData) => {

        const { selecteduser, messages } = get();
        
        try {
            const res = await axiosInstance.post(`message/send/${selecteduser._id}`, messageData);
            set({ messages: [...messages,res.data] });
        }
        catch(error) {
            toast.error('Error in sending message');
        }   

    },

    suscribetomessages: () => {
        const { selecteduser } = get();
        if (!selecteduser) return;
        
        const  socket  = useAuthStore.getState().socket;

        socket.on('newmessage', (message) => {
            if(message.senderid !== selecteduser._id)
            set({ messages: [...get().messages, message] });
        });
    },
    unsuscribefrommessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newmessage');
    },
    setselecteduser: (user) => {
        set({ selecteduser: user });
    },
}));