import { injectable } from "inversify";
import { FraudDetector, ParsedTransactionItem } from "../interfaces";

@injectable()
export class FraudDetectionService implements FraudDetector {
	public getFraudalentTransactionsByWindowHours(transactionList: ParsedTransactionItem[], amountThreshold: number, windowPeriodInHours: number): string[] {
		const groupedTransactions: GroupedTransaction = this.getTransactionsByCardAndPeriodRange(transactionList, windowPeriodInHours);
		return Object.keys(groupedTransactions).filter((cardNumber: string) => {
			return groupedTransactions[cardNumber].some((period: GroupedTransactionPeriodScope) => period.periodTotalAmount >= amountThreshold);
		});
}

	private addNewCardToGroup(transactionItem: ParsedTransactionItem, groupedTransactions: GroupedTransaction, windowPeriodInHours: number): void {
		groupedTransactions[transactionItem.hashedCardNumber] = !!groupedTransactions[transactionItem.hashedCardNumber] ? groupedTransactions[transactionItem.hashedCardNumber] : [];
		this.addTransactionToScope(transactionItem, groupedTransactions[transactionItem.hashedCardNumber], windowPeriodInHours);
	}

	private addTransactionToScope(transactionItem: ParsedTransactionItem, scopeList: GroupedTransactionPeriodScope[], windowPeriodInHours: number): void {
		scopeList.push({'periodStart': transactionItem.transactionTimestamp,
						'periodEnd': this.getPeriodEnd(transactionItem.transactionTimestamp, windowPeriodInHours),
						'periodTotalAmount': transactionItem.transactionAmount
					});
	}

	private getExistingPeriodForTransaction(transactionItem: ParsedTransactionItem, groupedTransactions: GroupedTransaction, windowPeriodInHours: number): GroupedTransactionPeriodScope | undefined {
		return groupedTransactions[transactionItem.hashedCardNumber].find((currentScope: GroupedTransactionPeriodScope) => {
			return currentScope.periodStart.getTime() <= transactionItem.transactionTimestamp.getTime()  
				&& transactionItem.transactionTimestamp.getTime() <=  currentScope.periodEnd.getTime();
		});
	}

	private getTransactionsByCardAndPeriodRange(transactionList: ParsedTransactionItem[], windowPeriodInHours: number): GroupedTransaction {
		const groupedTransactions: GroupedTransaction = {};
		transactionList.forEach(transactionItem => {
			const doesCardExistInCurrentDetection: boolean = !!groupedTransactions[transactionItem.hashedCardNumber];
			if (!doesCardExistInCurrentDetection) {
				this.addNewCardToGroup(transactionItem, groupedTransactions, windowPeriodInHours);
			} else {
				const existingPeriodForTransaction: GroupedTransactionPeriodScope | undefined = this.getExistingPeriodForTransaction(transactionItem, groupedTransactions, windowPeriodInHours);
				if (!!existingPeriodForTransaction) {
					existingPeriodForTransaction.periodTotalAmount += transactionItem.transactionAmount;
				} else {
					this.addTransactionToScope(transactionItem, groupedTransactions[transactionItem.hashedCardNumber], windowPeriodInHours);
				}
			}
		});
		return groupedTransactions;
	}

	private getPeriodEnd(periodStart: Date, windowPeriodInHours: number): Date {
		const periodUnit = windowPeriodInHours * 60 * 60 * 1000;
		const currentPeriodEndTime: Date = new Date();
		currentPeriodEndTime.setTime(periodStart.getTime() + periodUnit);
		return currentPeriodEndTime;
	}
}

interface GroupedTransaction {[creditCardNumber: string]: GroupedTransactionPeriodScope[]}
interface GroupedTransactionPeriodScope {periodStart: Date, periodEnd: Date, periodTotalAmount: number};