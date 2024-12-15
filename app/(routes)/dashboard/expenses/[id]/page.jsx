"use client"
import { db } from '@/utils/db'
import { Budgets, Expenses } from '@/utils/db/schema'
import { useUser } from '@clerk/nextjs'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem'
import AddExpenses from '../_components/AddExpenses'
import ExpensesListTable from '../_components/ExpensesListTable'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pen, PenBox, Trash } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import EditBudget from '../_components/EditBudget'

function ExpensesScreen({ params }) {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState();
    const [expensesList, setExpensesList] = useState();
    const route = useRouter();
    useEffect(() => {
        user && getBudgetInfo();
    }, [user])
    const getBudgetInfo = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expenses.amount}::numeric)`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number)
        }).from(Budgets)
            .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id, params.id))
            .groupBy(Budgets.id);

        setBudgetInfo(result[0]);
        getExpensesList();
    }
    const getExpensesList = async () => {
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .orderBy(desc(Expenses.id));
        setExpensesList(result);
        console.log(result);
    }
    const deleteBudget = async () => {
        const deleteExpenseResult = await db.delete(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .returning();
        if (deleteExpenseResult) {
            const result = await db.delete(Budgets)
                .where(eq(Budgets.id, params.id))
                .returning();
        }
        toast('Budet Deleted!');
        route.replace('../budgets')
    }
    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>
                <span className='flex gap-2 items-center'><ArrowLeft onClick={() => route.back()} className='cursor-pointer' />My Expenses</span>
                <div className='flex gap-2 items-center'>
                    <EditBudget budgetInfo={budgetInfo} refreshData={() => getBudgetInfo()} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex gap-2" variant="destructive">
                                <Trash />
                                Delete
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your cirrent budget along with the expenses
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? <BudgetItem
                    budget={budgetInfo} /> :
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>
                    </div>}
                <AddExpenses budgetId={params.id} user={user} refreshData={() => getBudgetInfo()} />
            </div>
            <div className='mt-4'>
                <ExpensesListTable expensesList={expensesList} refreshData={() => getBudgetInfo()} />
            </div>
        </div>
    )
}

export default ExpensesScreen