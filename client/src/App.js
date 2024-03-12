import React, {useState} from 'react'
import Login from './components/login'
import { Routes, Route } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import Signup from './components/signUp'
import { UserAuthContextProvider } from './contexts/UserAuthContext'
import After from './components/after'
import ProtectedRoute from './components/ProtectedRoute'
import { ChatContext } from './contexts/chatContext'

function App() {
  const [conversation, setConversation]  = useState([]);
  const [isChatActive, setIsChatActive] = useState(false);

  const startNewChat = () => {
    setIsChatActive(true)
    setConversation([])
    alert("new chat started!!")
  }
  const saveConversation = () => {
    console.log("convo:", conversation)
    alert("saved")
  }

  return (
    <Container>
      <Row>
        <Col>
          <UserAuthContextProvider>
            <Routes>
              <Route path='/home'
              element={
                <ProtectedRoute>
                  <ChatContext.Provider value={{conversation, isChatActive, startNewChat, saveConversation}}>
                    <After />
                  </ChatContext.Provider>
                </ProtectedRoute>
              } />
              <Route path='/' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </UserAuthContextProvider>
        </Col>
      </Row>
    </Container>
  )
}

export default App