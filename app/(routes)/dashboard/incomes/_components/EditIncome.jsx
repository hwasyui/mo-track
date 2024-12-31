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
import { Incomes } from "@/utils/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function EditIncome({ incomeInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(incomeInfo?.icon || "🙂");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(incomeInfo?.name || "");
  const [amount, setAmount] = useState(incomeInfo?.amount || "");
  const { user } = useUser();

  useEffect(() => {
    if (incomeInfo) {
      setEmojiIcon(incomeInfo.icon || "🙂");
      setName(incomeInfo.name || "");
      setAmount(formatNumber(incomeInfo.amount) || "");
    }
  }, [incomeInfo]);

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

  const onUpdateIncome = async () => {
    try {
      const numericAmount = parseFloat(parseNumber(amount));

      const result = await db
        .update(Incomes)
        .set({
          name,
          amount: numericAmount,
          icon: emojiIcon,
        })
        .where(eq(Incomes.id, incomeInfo.id))
        .returning();

      if (result) {
        refreshData();
        toast("Income Updated!");
      }
    } catch (error) {
      console.error("Error updating income:", error);
      toast("Failed to update income. Please try again.");
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
            <DialogTitle>Update Income</DialogTitle>
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
                  <h2 className="text-black font-medium my-1">Income Name</h2>
                  <Input
                    placeholder="e.g. Salary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Income Amount</h2>
                  <Input
                    type="text"
                    placeholder="e.g. 1,000,000"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)}
                onClick={() => onUpdateIncome()}
                className="mt-5 w-full"
              >
                Update Income
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditIncome;