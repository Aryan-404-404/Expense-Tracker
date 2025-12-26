import { useState, useEffect } from "react";
import api from "../api/axios";

export const useFinancialData = () => {
    const [data, setdata] = useState({
        balance: 0,
        income: 0,
        expense: 0,
        saving: 0,
        monthCategories: []
    })

    const fetchData = async() => {
        try{
            const res = await api.get('trans/stats');
            setdata({
              income: res.data ? res.data.incomeSum : 0,
              expense: res.data ? res.data.expenseSum : 0,
              balance: res.data ? res.data.balance : 0,
              saving: res.data ? res.data.saving : 0,
              monthCategories: res.data? res.data.categories : []
            })
        }
        catch(err){
            const msg = err.response?.data?.message || err.message || "Something went wrong";
        throw new Error(`Unexpected error: ${msg}`);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    return {
        ...data,
        refetch: fetchData // To refresh data when needed
    };
}