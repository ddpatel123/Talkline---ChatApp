import React,{useEffect,useRef} from 'react'
import {useChatStore} from '../store/useChatStore.jsx'
import Chatheader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './skeletons/MessageSkeleton.jsx';
import {useAuthStore} from '../store/useAuthStore.jsx';
import { formatMessageTime } from '../lib/utils.js';
const messageendref = useRef(null);


function Chatcontainer() {

  const { messages, selecteduser, getmessages, ismessagesloading ,suscribetomessages,unsuscribefrommessages} = useChatStore();
  const {authuser} = useAuthStore();
  
  useEffect(() => {
    // console.log(selecteduser._id);
    // console.log(authuser._id);
    // console.log(messages);
    getmessages(selecteduser._id);
    suscribetomessages();
  }, [selecteduser, getmessages, suscribetomessages, unsuscribefrommessages]);


  useEffect(() => { 
    if(messages && messageendref.current)
    messageendref.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  if (ismessagesloading) {
    return (<div className="flex-1 flex flex-col h-full overflow-auto">
      <Chatheader />

      <MessageSkeleton />

      <MessageInput />
    </div>)
  }

  
  
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-auto">
      <Chatheader />
     
        
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
       
        {messages.map((message)=>(
        
        <div
            key={message._id}

            className={`chat ${message.senderId===authuser._id ? 'chat-end' : 'chat-start'}`}
            ref = {messageendref}>
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId === authuser._id ? authuser.profilePic || "./profileimage.png" : selecteduser.profilePic || "./profileimage.png"}
                  alt={'profile pic'} />
              </div>
              
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {message.image && (<img src={message.image}
                alt='Attachment'
              className='sm:max-w-[200px] rounded-md mb-2'/>)}

              {message.text && <p>{message.text}</p>}
            </div>

            
              
          </div>
        ))}
      </div>
      

      <MessageInput />
    </div>
  )
}

export default Chatcontainer
