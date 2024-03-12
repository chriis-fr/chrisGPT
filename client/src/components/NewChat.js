import React, { useState, useContext, useEffect } from 'react'
import { useUserAuth } from '../contexts/UserAuthContext'
import { ChatContext } from '../contexts/chatContext';
import axios from 'axios';
import { database } from '../contexts/firebase';
import { onValue, ref } from 'firebase/database';

function NewChat() {
  const [outDiv, setOutdiv] = useState(false)
  const {user, logOut} = useUserAuth();
  const { startNewChat, conversation, isChatActive, saveConversation, setConversation  } = useContext(ChatContext)
  const apiUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const chatsRef = ref(database, `users/${user.uid}/conversations`);
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val()
      if(data){
        const chats = Object.values(data)
        setConversation(chats)
      }
    });
    return () => {
      unsubscribe()
    }
    
  }, [user.uid])

  const handleStartNewSesh = async () => {
    try {
      const response = await axios.post(`${apiUrl}/reset`); // Trigger server reset
      if (response.data.message === 'Server reset successful') {
        startNewChat();
      } else {
        // Handle server reset failure
        console.error('Server reset failed:', response.data.error);
        // Inform the user about the failure (e.g., using an alert or notification)
      }
    } catch (error) {
      console.error('Error resetting server:', error);
      // Inform the user about the error (e.g., using an alert or notification)
    }
  };
  

  console.log(user)

  const handleLogOut = async () => {
    setOutdiv(false)
    try{
      await logOut()
    } catch(err){
      console.log(err.message)
    }
  }

  return (
   <div className='h-screen bg-sky-900 w-1/4 flex  flex-col justify-center items-center'>
    <div className='border border-2 border-slate-600 w-[25%] text-white top-0 hover:bg-gray-900 rounded-lg py-3 items top-0 fixed flex justify-center' onClick={handleStartNewSesh}>
      <p className='font-bold text-rose-200 text-lg tracking-wider'>
        - New Chat -
      </p>
    </div>

    <div className='border border-2 border-yellow-900 w-full flex text-center h-[80%] rounded-lg'>
      <div className='font-bold  h-[5%] w-full text-orange-500'>
        <p className='italic tracking-wider underline'>Previous conversations</p>
      </div>
      {conversation.map((chat, index) => (
        <div key={index} className='border rounded-lg h-[5%] w-full '>
          <p>User: {chat.userInput}</p>
          <p>ChrisGPT: {chat.response}</p>
        </div>
      ))}
    </div>

    {outDiv &&
    <div className='flex justify-center pointer text-white font-bold bg-red-500 hover:bg-red-900 py-3 rounded-lg fixed bottom-14 w-[15%]'
    onClick={handleLogOut}>
      LOG OUT
    </div>}
    <div className='flex justify-center sm:bg-green-900 text-white sm:text-xs font-bold hover:bg-gray-900 py-3  rounded-lg fixed bottom-0 w-[25%]'
    onClick={() => setOutdiv(!outDiv)}
    >
      <div>
        {user && user.email}
      </div>
    </div>
   </div>
  )
}

export default NewChat