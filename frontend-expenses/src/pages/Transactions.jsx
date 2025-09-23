import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react';
import api from '../api/axios';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Fetch transactions from your database
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get('/trans/transactions');
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  // Get unique categories for filter
  const categories = ['all', ...new Set(transactions.map(t => t.category))];

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
      const matchesType = selectedType === 'all' || transaction.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category display name with emoji
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'food-dining': '🍔 Food & Dining',
      'transportation': '🚗 Transportation',
      'bills-utilities': '🏠 Bills & Utilities',
      'shopping': '🛍️ Shopping',
      'entertainment': '🎬 Entertainment',
      'healthcare': '🏥 Healthcare',
      'education': '📚 Education',
      'personal-care': '🎯 Personal Care',
      'subscriptions': '📱 Subscriptions',
      'salary': '💰 Salary',
      'freelance': '💼 Freelance',
      'investment': '📈 Investment',
      'others': '💸 Others'
    };
    return categoryMap[category] || category;
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">Error loading transactions</p>
            <p className="mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-blue-600" />
            All Transactions
          </h1>
          <p className="mt-2 text-gray-600">View and manage all your financial transactions</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalIncome)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalExpenses)}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Balance</p>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalIncome - totalExpenses)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {transactions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200/50 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="lg:w-48">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="lg:w-48">
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-black"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : getCategoryDisplay(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200/50">
          {transactions.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 mb-6">Start by adding your first transaction to see it here.</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            /* No Results State */
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching transactions</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            /* Transactions List */
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">
                          {getCategoryDisplay(transaction.category).split(' ')[0]}
                        </span>
                        <h3 className="font-semibold text-gray-900">
                          {getCategoryDisplay(transaction.category).substring(2)}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="text-gray-600 text-sm mb-1">{transaction.description}</p>
                      )}
                      <p className="text-gray-500 text-sm">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`text-xl font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;