import React, {createContext, useState} from "react";


export const ChatContext = createContext({
    conversation: [],
    isChatActive: false,
    startNewChat: () => {},
    saveConversation: () => {},
})