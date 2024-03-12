import { createContext, useContext, useEffect, useState } from "react";
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
 } from "@firebase/auth";
import { auth } from "./firebase";

const UserAuthContext = createContext();

export function UserAuthContextProvider({children}) {
    const [user, setUser] = useState("")

    function signUp(email, password){
        return createUserWithEmailAndPassword(auth, email, password )
    }
    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }
    function googleSignIn(){
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider)
    }
    function logOut(){
        return signOut(auth)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => {
            unsubscribe();
        }
    }, [])

    return (
        <UserAuthContext.Provider value={{user, signUp, login, googleSignIn, logOut}}>
            {children}
        </UserAuthContext.Provider>
    )
}

export function useUserAuth() {
    return useContext(UserAuthContext);
}