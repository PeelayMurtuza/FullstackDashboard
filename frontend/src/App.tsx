import React from 'react'
import Signup from '../components/Signup'
import Signin from '../components/Signin'
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <div className='bg-red-500 pt-2 pr-14 h-screen  '>
        <nav className='bg-yellow-400  w-28 '>
          <ul className='flex gap-5   '>
            <li>
              <NavLink to="/signup" >
                SignUP
              </NavLink>
            </li>
            <li>
              <NavLink to="/signin" >
                SignIn
              </NavLink>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/"  />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
