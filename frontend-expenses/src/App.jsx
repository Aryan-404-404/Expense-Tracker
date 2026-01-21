import './App.css'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import GetStarted from './pages/GetStarted'
import ChatDrawer from './components/ChatDrower'
import { useState, useEffect } from 'react'
import api from './api/axios'
import Footer from './components/Footer'
import TransactionsPage from './pages/Transactions'
import ScrollToTop from './hooks/ScrollToTop'

function App() {
  const [user, setuser] = useState(null)
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/info');
        setuser(res.data)
        console.log("info request sent")
      } catch {
        setuser(null)
      }
      finally {
        setloading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
        <p className="text-lg">Waking up the server...</p>
        <p className="text-sm text-gray-400 mt-2">
          (This may take 30s on free hosting. Please wait!)
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {user ? <ChatDrawer /> : ""}
      <ScrollToTop />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <GetStarted />} />
        {/* <Route path='/' element={<Dashboard/>} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/transactions' element={<TransactionsPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
