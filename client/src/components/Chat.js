import React, {useState, useEffect, useRef, useContext} from 'react'
import annyang from 'annyang'
import compromise from 'compromise'
import axios from 'axios';
import { ChatContext } from '../contexts/chatContext';
import { database } from '../contexts/firebase';
import { push, ref, set } from 'firebase/database';

const { v4: uuidv4 } = require( 'uuid' );

function Chat() {
  const {conversation, setConversation,  saveConversation} = useContext(ChatContext)
  const [voiceInput, setVoiceInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatResponses, setChatResponses] = useState([])
  const textAreaRef = useRef(null)
  const apiUrl = process.env.REACT_APP_API_URL

  // useEffect(() => {
  //   setConversation([])
  // }, [startNewChat])

  useEffect(() => {
    scrollToBottom()
  }, [chatResponses]);

  const scrollToBottom = () => {
    if(textAreaRef.current){
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }

  useEffect(()=> {
    annyang.start(); // initialise annyang

    //set up speech recog
    annyang.addCallback('result', (phrases) => {
      const voiceText = phrases[0]
      setVoiceInput(voiceText)
      processVoiceInput(voiceText)
    });
    return () => {
      annyang.abort();
    }
  }, [])

  const startRecording = () => {
    setIsRecording(true);
    annyang.start();
  }
  const stopRecording = () => {
    setIsRecording(false);
    annyang.abort();
  }
  const processVoiceInput = (input) => {
    const doc = compromise(input)
    const nouns = doc.nouns().out('array');
    const verbs = doc.verbs().out('array');

    console.log('Nouns: ', nouns)
    console.log('Verbs: ', verbs)
    setTextInput((prevText) => prevText + input + ' ')
  }
  
  const submitForm = async (e) => {
    e.preventDefault()
    if (!textInput) return;
    try{
      const response = await axios.post(`${apiUrl}/chat`, {
        message: [textInput],
      })

      const  chatResponse = response.data.text;
      const responseId = chatResponse.id || uuidv4()

      const chatRef = ref(database, 'chats');
      const newChatRef = push(chatRef);
      set(newChatRef, {
        userInput: textInput,
        response: chatResponse,
        id: responseId
      })

      setTextInput("")
      setChatResponses([...chatResponses, {userInput: textInput, response: chatResponse, id: responseId}])
      setConversation([...conversation, {userInput: textInput, response: chatResponse, id: responseId}])
      saveConversation(conversation)
    }catch (error){
      console.error("Error:", error)
    }
  }


  return (
    <div className='flex flex-col w-3/4 h-screen container gap-2 bg-gray-900'>
    <div className=' flex'>
        <div className='sticky rounded-md w-screen top-0 mb-1.5 flex items-center justify-between text-white z-10 h-14 bg-gray-800 font-semibold dark:bg-grey'>
            <div className='flex items-center pl-2 tracking-wider text-xl font-bold'>ChrisGPT 1.0</div>
            <div className='flex pr-1 '>
              <button
               className='btn relative btn-neutral btn-small flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-lg border border-token-border-medium focus:ring-0'>
                <div className='flex w-full gap-2 items-center justify-center'>
                  <svg width="24" height="24" viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='icon-md'>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2929 2.29289C11.6834 1.90237 12.3166 1.90237 12.7071 2.29289L16.7071 6.29289C17.0976 6.68342 17.0976 7.31658 16.7071 7.70711C16.3166 8.09763 15.6834 8.09763 15.2929 7.70711L13 5.41421V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V5.41421L8.70711 7.70711C8.31658 8.09763 7.68342 8.09763 7.29289 7.70711C6.90237 7.31658 6.90237 6.68342 7.29289 6.29289L11.2929 2.29289ZM4 13C4.55228 13 5 13.4477 5 14V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V14C19 13.4477 19.4477 13 20 13C20.5523 13 21 13.4477 21 14V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V14C3 13.4477 3.44772 13 4 13Z" fill="currentColor"></path>
                  </svg>
                </div>
              </button>
            </div>
        </div>
        </div>

        <div className='flex h-[70%] pt-4 gap-4 justify-center bg-gray-900 items-center mx-5 border rounded-2xl border-yellow-100'>
        <div className=' w-[90%] h-[90%] text-white flex flex-col items-center justify-end'>
          <p className='italic text-purple-800 underline font-bold mb-4'>How may we help you today?</p> 
          <textarea
            className='rounded-lg bg-transparent italic text-lg ml-2 mr-2 w-full h-full text-center text-bottom'
            readOnly={true}
            value={chatResponses.map(response => `You: ${response.userInput}\nChrisGPT: ${response.response}`).join('\n\n')}
            rows={8}
            cols={60}
            ref={textAreaRef}
          />
        </div>
        </div>

          <div className='fixed bottom-0 w-[75%] flex flex-col  '>
          <form  className='flex flex-row gap-12 p-4 flex-grow items-center justify-center rounded-3xl border-red-500 mx-2 ' onSubmit={submitForm}>
            <div className='flex flex-row gap-4 w-[50%] border rounded-3xl'>
              <textarea 
              className='h-px-200 overflow-hidden text-white h-[50px] m-0 w-full resize-none border-transparent rounded-3xl bg-transparent py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-3.5 md:pr-12 placeholder-black/50 dark:placeholder-white/50 pl-3 md:pl-4'
              placeholder='Message ChrisGpt...'
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              ></textarea>
              <button
              type='button'
              onClick={isRecording ? stopRecording : startRecording}
              className={` right-4 top-1/2 transform-translate-y-1/2 ${
                isRecording ? "bg-red-500" : "bg-green-500"
              } dark:hover:bg-gray-900 dark:disabled:hover:bg:trasnparent dark:disabled:bg-white disabled:bg-black disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white transition-colors`}
              >
                <div className='flex w-full gap-2 items-center justify-center'>
                {isRecording ? (
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='text-white dark:text-black'>
                    <path d='M6 2L18 12L6 22V2Z' fill='currentColor'></path>
                  </svg>
                ) : (
                  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='text-white dark:text-black'>
                    <path d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14h2V8h-2v8zm0-10h2v2h-2V6z' fill='currentColor'></path>
                  </svg>
                )}
                </div>
              </button>
            </div>
            <button className='flex justify-end md:bottom-3 md:right-3 border rounded-lg bg-gray-500 hover:bg-gray-100'
            >
            <div className='flex w-full gap-2 items-center justify-center '>
                  <svg width="24" height='24' viewBox='0 0 24 24' fill='none' className='text-white dark:text-black'>
                    <path d='M7 11L12 6L17 11M12 18V7' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'></path>
                  </svg>
                </div>
            </button>
          </form>
          <footer className='text-center text-white text-xs py-1'>
            ChrisGPT can make mistakes. Consider checking important information.
          </footer>
          </div>

          </div>
  )
}

export default Chat