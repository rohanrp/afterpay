import { ParsedTransactionItem } from "./parsed-transaction-item";

export interface FraudDetector {
	getFraudalentTransactionsByWindowHours: (transactionList: ParsedTransactionItem[], amountThreshold: number, windowPeriodInHours: number) => string[];
}