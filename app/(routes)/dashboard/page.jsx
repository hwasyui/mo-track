"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/db";
import { Budgets, Expenses } from "@/utils/db/schema";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpensesListTable from "./expenses/_components/ExpensesListTable";

function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
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

  // Fetch budgets and expenses
  const fetchData = async () => {
    if (!user) {
      console.warn("User not logged in or undefined");
      return;
    }

    try {
      console.log("Fetching budget list...");
      // Fetch budgets with aggregated expense data
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

      // Fetch all expenses
      await fetchAllExpenses();
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  // Fetch all expenses
  const fetchAllExpenses = async () => {
    try {
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
    }
  };

  // Use effect to fetch data when user changes
  useEffect(() => {
    fetchData();
  }, [user]);

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
            refreshData={() => getBudgetInfo()}
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