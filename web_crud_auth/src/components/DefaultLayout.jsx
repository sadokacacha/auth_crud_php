import React from 'react'
import { Link, Navigate, Outlet } from 'react-router'
import { useStateContext } from '../contexts/ContextsProvider'

const DefaultLayout = () => {


   const {user , token}  = useStateContext()

    if (!token) {
        return <Navigate to="/login" /> 
    
    
    }
const onLogout = (event) => { 
event.preventDefault()
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

  {user.name}
            <a href='#' onClick={onLogout} className='btn-logout'>logout</a>


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
