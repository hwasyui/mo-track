import { db } from "@/utils/db";
import { Expenses } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import moment from "moment"; // Import moment.js for date formatting

function ExpensesListTable({ expensesList, refreshData }) {
  // Function to format numbers with commas
  const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const deleteExpenses = async (expense) => {
    const result = await db.delete(Expenses).where(eq(Expenses.id, expense.id)).returning();

    if (result) {
      toast("Expense Deleted!");
      refreshData();
    }
  };

  return (
    <div className="mt-3">
      <h2 className='font-bold text-lg'>Latest Expenses</h2>
      <div className="grid grid-cols-4 bg-slate-200 p-2">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList?.map((expenses, index) => (
        <div
          key={expenses.id || index}
          className="grid grid-cols-4 bg-slate-50 p-2"
        >
          <h2>{expenses.name}</h2>
          <h2>IDR. {formatNumber(expenses.amount)}</h2>
          <h2>
            {moment(expenses.createdAt, "DD/MM/YYYY HH:mm").isValid()
              ? moment(expenses.createdAt, "DD/MM/YYYY HH:mm").format(
                  "MMMM DD, YYYY, hh:mm A"
                )
              : "Invalid Date"}
          </h2>
          <h2>
            <Trash
              className="text-red-600 cursor-pointer"
              onClick={() => deleteExpenses(expenses)}
            />
          </h2>
        </div>
      ))}
    </div>
  );
}

export default ExpensesListTable;
