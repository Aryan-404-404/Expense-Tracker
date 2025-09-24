import { useNavigate } from "react-router-dom"

const GetStarted = () => {
    const navigate = useNavigate()
    const handleGetStarted = () => {
        navigate("/login")
    }

    

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 m-8">
                <div className="max-w-4xl w-full text-center">
                    {/* Hero Section */}
                    <div className="space-y-8">
                        {/* Financial Icons Illustration */}
                        <div className="flex justify-center items-center space-x-6 mb-12">
                            <div className="bg-blue-100 px-4 py-3 rounded-full">
                                <i className="fa-solid fa-wallet text-blue-600"></i>
                            </div>
                            <div className="bg-green-100 px-4 py-3 rounded-full text-blue-600">
                                <i class="fa-solid fa-arrow-trend-up text-blue-600"></i>
                            </div>
                            <div className="bg-indigo-100 px-4 py-3 rounded-full">
                                <i class="fa-solid fa-chart-pie text-blue-600"></i>
                            </div>
                        </div>

                        {/* Headline */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Take control of your
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500"> money</span>
                            </h1>

                            {/* Description */}
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                Track expenses, set budgets, and achieve your financial goals with our simple and intuitive expense tracker.
                                Start building better money habits today.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-8">
                            <button
                                onClick={handleGetStarted}
                                className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
                            >
                                Get Started
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>

                        {/* Features Preview */}
                        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="text-center space-y-3">
                                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                                    <i className="fa-solid fa-wallet text-blue-600 text-3xl p-3 bg-blue-100 rounded-full shadow-sm"></i>
                                </div>
                                <h3 className="font-semibold text-gray-900">Track Expenses</h3>
                                <p className="text-sm text-gray-600">Monitor your spending across categories</p>
                            </div>

                            <div className="text-center space-y-3">
                                <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                                    <i class="fa-solid fa-arrow-trend-up text-blue-600 text-3xl p-3 bg-blue-100 rounded-full shadow-sm"></i>
                                </div>
                                <h3 className="font-semibold text-gray-900">Set Budgets</h3>
                                <p className="text-sm text-gray-600">Create and stick to your financial plans</p>
                            </div>

                            <div className="text-center space-y-3">
                                <div className="bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto">
                                    <i class="fa-solid fa-chart-pie text-blue-600 text-3xl p-3 bg-blue-100 rounded-full shadow-sm"></i>
                                </div>
                                <h3 className="font-semibold text-gray-900">Visualize Data</h3>
                                <p className="text-sm text-gray-600">See your financial progress at a glance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center">
                <p className="text-gray-500 text-sm">
                    ExpenseTracker © 2025
                </p>
            </footer>
        </div>
    )
}

export default GetStarted
