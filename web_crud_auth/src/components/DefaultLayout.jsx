import React from 'react'
import { Link, Navigate, Outlet } from 'react-router'
import { useStateContext } from '../contexts/ContextsProvider'

const DefaultLayout = () => {


   const {user , token}  = useStateContext()

    if (!token) {
        return <Navigate to="/login" /> 
    
    
    }


  return (
    <div  id='defaultLayout'>

    <aside>

    <Link to="/Dashboard">Dashboard</Link>
    <Link to="/users">Users</Link>

    </aside>
    <div className="content">

        <header>
            <div>
                header
            </div>
            <div>
                user info
            </div>
        </header>
        <main>
            <Outlet/>
        </main>
    </div>

    </div>
  )
}

export default DefaultLayout
