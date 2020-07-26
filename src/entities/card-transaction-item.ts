import { injectable } from "inversify";
import { RawTransactionItem } from "../interfaces/raw-transaction-item";
import { ParsedTransactionItem } from "../interfaces";

export class CardTransactionItem implements ParsedTransactionItem {

    public hashedCardNumber: string;
    public transactionTimestamp: Date;
    public transactionAmount: number;

    public constructor(
        item: RawTransactionItem
    ) {
        this.hashedCardNumber = item.hashedCardNumber;
        this.transactionTimestamp = new Date(item.transactionTimestamp);
        this.transactionAmount = parseFloat(item.transactionAmount);
    }

}