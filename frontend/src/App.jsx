import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Navbar from './components/Navbar'
import RegisterPage from './components/authPages/RegisterPage'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser, loginAuthUser, loginIsAuthenticated } from './slices/authSlice'
import { useEffect } from 'react'
import Footer from './components/Footer'
import ResetPassword from './components/authPages/ResetPassword'
import UserHome from './components/authPages/UserHome'
import BottomMenu from './components/BottomMenu/BottomMenu'
import SingleUser from './components/viewUsers/SingleUser'
import ProfileSetting from './components/authPages/ProfileSetting'
import ProtectedRoute from './routes/ProtectedRoute'
import ChatPage from './components/Chat/ChatPage'
import AdminHome from './components/Admin/AdminHome'
import Dashboard from './components/Admin/Dashboard'
import UsersAdmin from './components/Admin/UsersAdmin'
import SingleUserAdmin from './components/Admin/SingleUserAdmin'


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  const isAuthenticated = useSelector(loginIsAuthenticated)
  const user = useSelector(loginAuthUser)

  const location = useLocation()
  const isAdmin = user?.role === "admin"
  const isChatPage = location.pathname === '/chat-home'
  return (
    <>
      <Navbar />
      <div className="" style={{ minHeight: isChatPage ? '80vh' : '100vh' }}>
        <Routes>
          <Route path='/' element={isAuthenticated ? <ProtectedRoute isUser={true}><UserHome /> </ProtectedRoute> : <Home />} />
          <Route path='/register-form' element={<ProtectedRoute><RegisterPage /> </ProtectedRoute>} />
          <Route path='/profile/:id' element={<ProtectedRoute><SingleUser /></ProtectedRoute>} />
          <Route path='/password/reset/:token' element={<ResetPassword />} />
          <Route path='/profile-settings' element={<ProtectedRoute isUser={true}><ProfileSetting /></ProtectedRoute>} />
          <Route path='/chat-home' element={<ProtectedRoute isUser={true}><ChatPage /></ProtectedRoute>} />
          
        </Routes>

        <Routes>
                <Route path="/admin" element={<AdminHome />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="user/:id" element={<SingleUserAdmin />} />

                </Route>
            </Routes>
      </div>
      <BottomMenu />
      {isChatPage || !isAdmin && <Footer />}
    </>
  )
}

export default App
