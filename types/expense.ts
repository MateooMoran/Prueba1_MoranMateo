export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  paidBy: string;
  participants: string[];
  receiptUri: string;
}