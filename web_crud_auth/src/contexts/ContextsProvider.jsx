import React  from 'react'
import { useState , useContext  , createContext } from 'react'


const StateContext = createContext({

    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},




})

export const ContextsProvider = ({children}) => {
    const [user, setUser] = useState({
        
    })
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN') || null)


    

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token)
    } else {
            localStorage.removeItem('ACCESS_TOKEN')
        }
}

return (
    <StateContext.Provider value={{
        user,
        token ,
        setUser , 
        setToken , 
    }}>
        {children}
    </StateContext.Provider>

)


}

export const useStateContext = () => useContext(StateContext)