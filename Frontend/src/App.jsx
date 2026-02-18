import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start' 
import UserLogin from './pages/UserLogin'
import Captainlogin from './pages/Captainlogin'
import UserSignup from './pages/UserSignup'
import CaptainSignup from './pages/CaptainSignup'
import { UserDataContext } from './context/UserContext.jsx'
import Home from './pages/Home.jsx'
import UserProtectWrapper from './pages/UserProtectWrapper.jsx'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper.jsx'
import UserLogout from './pages/UserLogout.jsx'
import CaptainLogout from './pages/CaptainLogout.jsx'
import CaptainHome from './pages/CaptainHome.jsx'
import Riding from './pages/Riding.jsx'
import CaptainRiding from './pages/CaptainRiding'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path='/Userlogin' element={<UserLogin />} />
      <Route path='/captainlogin' element={<Captainlogin />} />
      <Route path='/Usersignup' element={<UserSignup />} />
      <Route path='/Captainsignup' element={<CaptainSignup />} />
      <Route path='/riding' element={<Riding/>}/>
      <Route path='/captain-riding' element={<CaptainRiding />} />
      <Route path='/home' element={
        <UserProtectWrapper>
          <Home />
        </UserProtectWrapper>
      } />
      <Route path='/users/logout' element={
        <UserProtectWrapper>
          <UserLogout/>
        </UserProtectWrapper>
      } />
      <Route path='/captainHome' element={
        <CaptainProtectWrapper>
          <CaptainHome />
        </CaptainProtectWrapper>
      } />
      <Route path='/captain/logout' element={
        <CaptainProtectWrapper>
          <CaptainLogout/>
        </CaptainProtectWrapper>
      } />
    </Routes>
  )
}

export default App