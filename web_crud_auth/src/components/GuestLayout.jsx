import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useStateContext } from '../contexts/ContextsProvider'

const GuestLayout = () => {


    const {token}  = useStateContext()
    
    if (token) {
       return < Navigate  to = "/"  />
    }

  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default GuestLayout
