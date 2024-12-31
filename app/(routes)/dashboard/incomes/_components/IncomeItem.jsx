import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, PenBox } from "lucide-react";
import { db } from "@/utils/db";
import { Incomes } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import EditIncome from "./EditIncome";
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
} from "@/components/ui/alert-dialog";

function IncomeItem({ income, refreshData }) {
  const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const onDeleteIncome = async () => {
    const result = await db
      .delete(Incomes)
      .where(eq(Incomes.id, income.id))
      .returning();

    if (result) {
      refreshData();
      toast("Income Deleted!");
    }
  };

  return (
    <div className="p-5 border rounded-lg hover:shadow-md h-[143px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-3xl p-3 px-4 bg-slate-100 rounded-full">
            {income?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{income.name}</h2>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg">
          IDR. {formatNumber(income.amount)}
        </h2>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <EditIncome incomeInfo={income} refreshData={refreshData} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2" variant="destructive">
              <Trash2 />
              Delete
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your current income
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteIncome()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default IncomeItem;