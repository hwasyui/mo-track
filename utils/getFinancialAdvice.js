import { createXai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const xai = createXai({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://api.x.ai/v1"
});

const getFinancialAdvice = async (budgetList, totalBudget, totalIncome, totalSpend) => {
  try {
    // Prepare detailed budget category information
    const budgetDetails = budgetList.map(budget => 
      `Category: ${budget.name}, 
      Budgeted: IDR ${budget.amount}, 
      Spent: IDR ${budget.totalSpend}, 
      Remaining: IDR ${budget.amount - budget.totalSpend}`
    ).join('\n');

    const prompt = `
      Analyze the following comprehensive financial data:
      Total Income: IDR ${totalIncome}
      Total Budget: IDR ${totalBudget}
      Total Expenses: IDR ${totalSpend}

      Detailed Budget Breakdown:
      ${budgetDetails}

      Provide a highly personalized, actionable financial advice that:
      1. Highlights spending patterns
      2. Suggests specific budget optimizations
      3. Recommends strategies for improving financial health
      4. Includes essential financial suggestions based on the current economic situation in Indonesia, such as:
         - Recommended savings percentage
         - Budgeting for essential expenses like food, housing, and transportation
         - Tips for managing debt and building an emergency fund
      5. Uses a friendly, motivational tone
      
      Format the advice in 5-6 concise, impactful sentences.
    `;

    const { text } = await generateText({
      model: xai('grok-2-1212'),
      prompt: prompt,
    });

    return text;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't generate personalized financial advice right now. Please try again later.";
  }
};

export default getFinancialAdvice;