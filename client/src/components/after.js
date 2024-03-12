import React from "react";
import NewChat from "./NewChat";
import Chat  from "./Chat";


const After = () => {
  return (
    <div className='flex h-screen w-screen overflow-hidden bg-black'>
        <NewChat />
        <Chat />
    </div>
  )
}

export default After