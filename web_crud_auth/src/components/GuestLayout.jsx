import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useStateContext } from '../contexts/ContextsProvider'

const GuestLayout = () => {


    const {token}  = useStateContext()
debugger;
    if (token) {
       return < Navigate  to = "/"  />
    }

  return (
    <div>
        <h1>RAW YE5DM AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA 9a3d y5dm</h1>
      <Outlet/>
    </div>
  )
}

export default GuestLayout
