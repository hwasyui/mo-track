import { PiggyBank, ReceiptText, Wallet, DollarSign, WalletCards } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({ budgetList, incomeList }) {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [numBudgets, setNumBudgets] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);

    useEffect(() => {
        if (budgetList || incomeList) {
            CalculateCardInfo();
        }
    }, [budgetList, incomeList]);

    const CalculateCardInfo = async () => {
        console.log("Budget List:", budgetList);
        console.log("Income List:", incomeList);
        
        let totalBudget_ = 0;
        let totalSpend_ = 0;
        let totalIncome_ = 0;

        // Calculate budget and spend totals
        const budgets = Array.isArray(budgetList) ? budgetList : budgetList?.array || [];
        budgets.forEach(element => {
            totalBudget_ += Number(element.amount || 0);
            totalSpend_ += Number(element.totalSpend || 0);
        });

        // Calculate income total
        const incomes = Array.isArray(incomeList) ? incomeList : incomeList?.array || [];
        incomes.forEach(element => {
            totalIncome_ += Number(element.amount || 0);
        });

        console.log("Total Budget:", totalBudget_, "Total Spend:", totalSpend_, "Total Income:", totalIncome_);

        setTotalBudget(totalBudget_);
        setTotalSpend(totalSpend_);
        setNumBudgets(budgets.length);
        setTotalIncome(totalIncome_);
    };

    return (
        <div>
            {budgetList?.length > 0 ?
                <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Income</h2>
                            <h2 className='font-bold text-2xl'>IDR. {totalIncome.toLocaleString()}</h2>
                        </div>
                        <WalletCards className='bg-primary p-2 h-10 w-10 rounded-full text-white' />
                    </div>
                    <div className='p-5 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>IDR. {totalBudget.toLocaleString()}</h2>
                        </div>
                        <PiggyBank className='bg-primary p-2 h-10 w-10 rounded-full text-white' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Total Spend</h2>
                            <h2 className='font-bold text-2xl'>IDR. {totalSpend.toLocaleString()}</h2>
                        </div>
                        <ReceiptText className='bg-primary p-2 h-10 w-10 rounded-full text-white' />
                    </div>
                    <div className='p-7 border rounded-lg flex items-center justify-between'>
                        <div>
                            <h2 className='text-sm'>Number of Budgets</h2>
                            <h2 className='font-bold text-2xl'>{numBudgets.toLocaleString()}</h2>
                        </div>
                        <Wallet className='bg-primary p-2 h-10 w-10 rounded-full text-white' />
                    </div>
                </div>
                :
                <div className='mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {[1, 2, 3, 4].map((item, index) => (
                        <div key={index} className='h-[110px] w-full bg-slate-200 animate-pulse rounded-lg'>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}

export default CardInfo;