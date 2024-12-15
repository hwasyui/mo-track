"use client";
import React, { useEffect, useState, useCallback } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/db";
import { Budgets, Expenses } from "@/utils/db/schema";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import { toast } from "sonner";
import ExpensesListTable from "./expenses/_components/ExpensesListTable";

function Dashboard() {
  const { user } = useUser(); // Hook to get user info
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);

  // Fetch budgets with expenses
  const getBudgetList = useCallback(async () => {
    try {
      if (!user) return;

      console.log("Fetching budget list...");
      const budgetResult = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount}::numeric)`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(budgetResult);
      console.log("Budget list fetched:", budgetResult);

      await fetchAllExpenses(); // Fetch expenses after budget list
    } catch (error) {
      console.error("Error fetching budget list:", error);
      toast.error("Failed to fetch budget list. Please try again.");
    }
  }, [user]);

  // Fetch all expenses
  const fetchAllExpenses = useCallback(async () => {
    try {
      if (!user) return;

      console.log("Fetching all expenses...");
      const expenseResult = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expenses.id));

      setExpensesList(expenseResult);
      console.log("Expenses fetched:", expenseResult);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses. Please try again.");
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user, getBudgetList]);

  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl">Hi, {user?.fullName} 👋</h2>
      <p className="text-gray-500">Here's what's happening with your money!</p>

      {/* Card Info Component */}
      <CardInfo budgetList={budgetList} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        {/* Bar Chart */}
        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgetList} />
          <ExpensesListTable
            expensesList={expensesList}
            refreshData={getBudgetList} // Correctly passing the refresh function
          />
        </div>

        {/* Latest Budgets */}
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList.map((budget, index) => (
            <BudgetItem budget={budget} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
