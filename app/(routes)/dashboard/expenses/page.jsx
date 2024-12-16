"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import ExpensesListTable from "./_components/ExpensesListTable";
import { db } from "@/utils/db";
import { Budgets, Expenses } from "@/utils/db/schema";
import { getTableColumns, sql, eq, desc } from "drizzle-orm";

function Page() {
  const { user } = useUser();
  const [expensesList, setExpensesList] = useState([]);

  // Fetch all expenses for the current user
  const fetchAllExpenses = async () => {
    if (!user) {
      console.warn("User not logged in or undefined");
      return;
    }

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
    fetchAllExpenses();
  }, [user]);

  return (
    <div className="m-3">
      {/* Expenses Table Component */}
      <ExpensesListTable
        expensesList={expensesList}
        refreshData={fetchAllExpenses}
      />
    </div>
  );
}

export default Page;
