"use client";

import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/db";
import { Budgets } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon || "🙂");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(budgetInfo?.name || "");
  const [amount, setAmount] = useState(budgetInfo?.amount || "");
  const { user } = useUser();

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo.icon || "🙂");
      setName(budgetInfo.name || "");
      setAmount(formatNumber(budgetInfo.amount) || "");
    }
  }, [budgetInfo]);

  const formatNumber = (value) => {
    if (!value) return "";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (formattedValue) => {
    return formattedValue.replace(/,/g, "");
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = parseNumber(rawValue);
    if (!isNaN(numericValue)) {
      setAmount(formatNumber(numericValue));
    }
  };

  const onUpdateBudget = async () => {
    try {
      const numericAmount = parseFloat(parseNumber(amount));

      const result = await db
        .update(Budgets)
        .set({
          name,
          amount: numericAmount, // Store the raw number
          icon: emojiIcon,
        })
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();

      if (result) {
        refreshData();
        toast("Budget Updated!");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast("Failed to update budget. Please try again.");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex gap-2">
            <PenBox />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="text-lg"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    {emojiIcon}
                  </Button>
                  {openEmojiPicker && (
                    <div className="absolute z-20">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setEmojiIcon(e.emoji);
                          setOpenEmojiPicker(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home Decor"
                    value={name} // Controlled input
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="text"
                    placeholder="e.g. 1,000,000"
                    value={amount} // Formatted input
                    onChange={handleAmountChange}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)} // Disable button if fields are empty
                onClick={() => onUpdateBudget()}
                className="mt-5 w-full"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;
