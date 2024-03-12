import { useContext, createContext, useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import {app} from './firebase'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser){
      setUser(JSON.parse(storedUser));
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (authUser){
        localStorage.setItem('user', JSON.stringify(authUser));
      } else {
        localStorage.removeItem('user')
      }
    });
    return () => unsubscribe()
  }, [auth])

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error with user feedback or other actions
    }
  };

  return (
    <UserContext.Provider value={{ user, login }}>{children}</UserContext.Provider>
  );
};

export const  UseUser = () => useContext(UserContext);
