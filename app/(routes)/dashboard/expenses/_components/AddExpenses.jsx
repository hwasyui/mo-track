import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/db";
import { Budgets, Expenses } from "@/utils/db/schema";
import { Loader } from "lucide-react";
import moment from "moment/moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpenses({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Function to format number with commas
  const formatNumber = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [loading, setLoading] = useState(false);
  const onAmountChange = (e) => {
    const formattedAmount = formatNumber(e.target.value);
    setAmount(formattedAmount);
  };

  const addNewExpense = async () => {
    setLoading(true)
    const rawAmount = parseInt(amount.replace(/,/g, ""), 10); // Remove commas before saving
    const result = await db.insert(Expenses).values({
      name: name,
      amount: rawAmount,
      budgetId: budgetId,
      createdAt: moment().format("DD/MM/YYYY HH:mm"), // Date and time format
    }).returning({ insertedId: Budgets.id });
    setAmount('');
    setName('');
    if (result) {
      setLoading(false)
      refreshData();
      toast("New Expense Added");
    }
    setLoading(false);
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 100,000"
          value={amount} // Controlled input
          onChange={onAmountChange}
        />
      </div>
      <Button
        disabled={!(name && amount)||loading}
        onClick={() => addNewExpense()}
        className="mt-3 w-full"
      >
        {loading ?
          <Loader className="animate-spin" /> : "Add New Expense"
        }
      </Button>
    </div>
  );
}

export default AddExpenses;
