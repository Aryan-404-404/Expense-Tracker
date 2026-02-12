import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState, useEffect } from 'react';
import api from '../api/axios';
import ExportPDF from '../components/ExportPDF';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';

const Dashboard = () => {

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500', /* etc */]
  const navigate = useNavigate()
  const [toast, settoast] = useState("");
  const [showInput, setshowInput] = useState(false)
  const [balanceArray, setbalanceArray] = useState([])
  const [trendArray, settrendArray] = useState([])
  const [range, setrange] = useState(null)
  const [recentTransactions, setrecentTransactions] = useState([])
  const [info, setinfo] = useState({ name: "" })
  const [categories, setcategories] = useState([])

  const [form, setform] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: "",
    description: ""
  })
  const [stats, setstats] = useState({
    income: "",
    expense: "",
    balance: "",
    saving: ""
  })
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user/info');
        setinfo({ name: res.data.userName });
        console.log("info request sent")
      } catch (err) {
        console.log(err.message)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const getstates = async () => {
      try {
        const res = await api.get('/trans/stats/');
        setstats({
          income: res.data ? res.data.incomeSum : 0,
          expense: res.data ? res.data.expenseSum : 0,
          balance: res.data ? res.data.balance : 0,
          saving: res.data ? res.data.saving : 0,
        })
      }
      catch (err) {
        const msg = err.response?.data?.message || err.message || "Something went wrong";
        settoast(`Unexpected error: ${msg}`);
        setTimeout(() => {
          settoast("")
        }, 2000);
      }
    }
    getstates()
  }, [])

  useEffect(() => {
    const getChartData = async () => {
      try {
        const res = await api.get(`/trans/chart?range=${range}`);
        setbalanceArray(res.data.balanceData)
        settrendArray(res.data.trendData)
        setrecentTransactions(res.data.recentTransactions)
      }
      catch (err) {
        const msg = err.response?.data?.message || err.message || "Something went wrong";
        settoast(`Unexpected error: ${msg}`);
        setTimeout(() => {
          settoast("")
        }, 2000);
      }
    }
    getChartData();
  }, [range])

  useEffect(() => {
    const fetchcats = async () => {
      try {
        const res = await api.get('/trans/cat/')
        setcategories(res.data)
      }
      catch (err) {
        const msg = err.response?.data?.message || err.message || "Something went wrong";
        console.error(msg);
      }
    }
    fetchcats()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || !form.category) {
      settoast("Please fill in required fields!");
      setTimeout(() => settoast(""), 2000);
      return;
    }
    try {
      const res = await api.post('/trans/transactions/', form)
      settoast("Transaction added!")
      await refreshDashboardData();
      setTimeout(() => {
        settoast("")
      }, 2000);
      setform({
        type: "expense",
        amount: "",
        category: "",
        date: "",
        description: ""
      })
    }
    catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message;
      settoast(msg);
      setTimeout(() => {
        settoast("")
      }, 2000);
    }
  }
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value })
  }
  const handleCancel = () => {
    setform({
      type: "expense",
      amount: "",
      category: "",
      date: "",
      description: ""
    })
    setshowInput(false)
  }
  const showTransaction = () => {
    setshowInput(!showInput)
  }

  const handleSevenDay = () => {
    setrange("7d")
  }
  const handleOneMonth = () => {
    setrange("30d")
  }
  const handleAllTrans = () => {
    setrange("")
  }
  const handleViewAll = () => {
    navigate('/transactions')
  }

  const refreshDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await api.get('/trans/stats/');
      setstats({
        income: statsRes.data ? statsRes.data.incomeSum : 0,
        expense: statsRes.data ? statsRes.data.expenseSum : 0,
        balance: statsRes.data ? statsRes.data.balance : 0,
        saving: statsRes.data ? statsRes.data.saving : 0,
      });

      // Fetch chart data
      const chartRes = await api.get(`/trans/chart?range=${range}`);
      setbalanceArray(chartRes.data.balanceData);
      settrendArray(chartRes.data.trendData);
      setrecentTransactions(chartRes.data.recentTransactions);

      // Fetch categories
      const catsRes = await api.get('/trans/cat/');
      setcategories(catsRes.data);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {info.name}!</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={showTransaction} className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </button>
            <ExportPDF
              financialData={stats}
              categories={categories}
              recentTransactions={recentTransactions}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Transaction Input Form */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showInput ? "max-h-[800px] opacity-100 mb-8" : "max-h-0 opacity-0 mb-0"
          }`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Transaction</h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      onChange={handleChange}
                      className="sr-only peer"
                      checked={form.type === 'expense'}
                    />
                    <div className="flex items-center px-4 py-2 bg-red-50 border-2 border-red-200 rounded-lg cursor-pointer peer-checked:bg-red-100 peer-checked:border-red-400 transition-all">
                      <TrendingDown className="w-4 h-4 text-red-600 mr-2" />
                      <span className="text-red-700 font-medium">Expense</span>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      onChange={handleChange}
                      checked={form.type === 'income'}
                      className="sr-only peer"
                    />
                    <div className="flex items-center px-4 py-2 bg-green-50 border-2 border-green-200 rounded-lg cursor-pointer peer-checked:bg-green-100 peer-checked:border-green-400 transition-all">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-green-700 font-medium">Income</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    name='amount'
                    placeholder="0.00"
                    onChange={handleChange}
                    value={form.amount}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select onChange={handleChange} name='category' value={form.category} className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black ">
                  <option value="">Select Category</option>
                  <option value="food-dining">🍔 Food & Dining</option>
                  <option value="transportation">🚗 Transportation</option>
                  <option value="bills-utilities">🏠 Bills & Utilities</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="entertainment">🎬 Entertainment</option>
                  <option value="healthcare">🏥 Healthcare</option>
                  <option value="education">📚 Education</option>
                  <option value="personal-care">🎯 Personal Care</option>
                  <option value="subscriptions">📱 Subscriptions</option>
                  <option value="salary">💰 Salary</option>
                  <option value="freelance">💼 Freelance</option>
                  <option value="investment">📈 Investment</option>
                  <option value="others">💸 Others</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  onChange={handleChange}
                  name='date'
                  value={form.date}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 [color-scheme:light] bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                rows="3"
                placeholder="Add a note about this transaction..."
                name='description'
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-black"
              ></textarea>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Balance */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Balance</h3>
            <p className="text-2xl font-bold text-gray-900">${stats.balance}</p>
          </div>

          {/* Total Income */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Income</h3>
            <p className="text-2xl font-bold text-gray-900">${stats.income}</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-red-500 text-sm font-medium flex items-center">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                -%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Expenses</h3>
            <p className="text-2xl font-bold text-gray-900">${stats.expense}</p>
          </div>

          {/* Savings */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <PieChart className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Savings</h3>
            <p className="text-2xl font-bold text-gray-900">${stats.saving}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Spending Chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Spending Overview</h3>
              <div className="flex items-center space-x-2">
                <button onClick={handleSevenDay} className={`px-3 py-1 text-sm rounded-lg cursor-pointer transition-all
      ${range === "7d" ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
    `}>7D</button>
                <button onClick={handleOneMonth} className={`px-3 py-1 text-sm rounded-lg cursor-pointer transition-all
      ${range === "30d" ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
    `}>1M</button>
                <button onClick={handleAllTrans} className={`px-3 py-1 text-sm rounded-lg cursor-pointer transition-all
      ${range === "" ? "bg-blue-600 text-white font-semibold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
    `}>All</button>
              </div>
            </div>
            <div className="h-[350px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <ResponsiveContainer width="95%" height="90%">
                <BarChart data={trendArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Bar dataKey="income" fill="#22C55E" />
                  <Bar dataKey="expense" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Categories</h3>
            <div className="space-y-4">
              {categories.length === 0 ? (
                <p className="text-gray-500">No transactions yet</p>
              ) : (
                categories.map((cat, i) => {
                  return (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${colors[i % colors.length]} rounded-full`}></div>
                        <span className="text-gray-700">{cat.category}</span>
                      </div>
                      <span className={`font-semibold ${cat.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {cat.type === 'income' ? '+' : '-'}${cat.total}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white/80  backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <button onClick={handleViewAll} className="text-blue-600 text-sm font-medium hover:text-blue-700 cursor-pointer">View All</button>
            </div>
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet</p>
            ) : (
              recentTransactions.slice(-10).map((t, i) => {
                return (
                  <div key={t._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 my-3">
                      <div className={`w-3 h-3 ${colors[i % colors.length]} rounded-full`}></div>
                      <span className="text-gray-700">{t.category}</span>
                    </div>
                    <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount}
                    </span>
                  </div>
                )
              })
            )}
          </div>
          {/* Balnce Graph */}
          <div className=" bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Balance Overview</h3>
            </div>
            <div className="h-[450px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <ResponsiveContainer width="95%" height="90%">
                <LineChart data={balanceArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Line type="monotone" dataKey="balance" strokeWidth={3} stroke="#4F46E5" dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast fixed bottom-8 right-8 bg-gray-800 text-white px-6 py-4 rounded-lg shadow-xl">
        {toast}
      </div>}
    </div>
  );
};

export default Dashboard;