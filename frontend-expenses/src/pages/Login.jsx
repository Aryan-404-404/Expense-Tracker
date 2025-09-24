import { useState } from 'react';
import api from '../api/axios'
import { useNavigate } from 'react-router-dom';
import loadingSvg from '../resources/loading.svg';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [toast, settoast] = useState("")
  const [loading, setLoading] = useState(false);
  const [form, setform] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/user/login', {
          email: form.email,
          password: form.password
        })
        navigate('/')
        window.location.href = "/";
        settoast("Login Successfull!")
        setTimeout(() => {
          settoast("")
        }, 2000);
        console.log("Login Successfull!")
        setform({
          userName: "",
          email: "",
          password: "",
          confirmPassword: ""
        })
      }
      else {
        if (form.password != form.confirmPassword) {
          settoast("password didn't match!")
          setTimeout(() => {
            settoast("")
          }, 2000);
        }
        const res = await api.post('/user/register', {
          userName: form.userName,
          email: form.email,
          password: form.password,
        })
        settoast("Registration Successfull! Sign in please!")
        setTimeout(() => {
          settoast("")
        }, 2000);
        setform({
          userName: "",
          email: "",
          password: "",
          confirmPassword: ""
        })
      }
    }
    catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      settoast(`Unexpected error: ${msg}`);
      setTimeout(() => {
        settoast("")
      }, 2000);
      console.error(err.response?.data || err.message)
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Fill in your information to get started'
              }
            </p>
          </div>

          <div className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name='userName'
                  value={form.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                name='email'
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                name='password'
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name='confirmPassword'
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
          {loading && (
            <div className="flex justify-center my-4">
              <img src={loadingSvg} alt="Loading..." className="w-8 h-8 animate-spin" />
            </div>
          )}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
      {toast && <div className="toast fixed bottom-8 right-8 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl">
        {toast}
      </div>}
    </div>
  );
}