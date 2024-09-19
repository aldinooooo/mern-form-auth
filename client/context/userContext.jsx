import axios from "axios";
import { createContext,useState,useEffect } from "react";

export const UserContext =createContext({})

export function UserContextProvider({children}) {
    const [user,setUser] = useState(null)
    useEffect(()=>{
        if(!user){
            axios.post('/profile')
            .then(({data})=>{
                setUser(data)
            })
        }
    },[])//eslint-disable-line
    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}