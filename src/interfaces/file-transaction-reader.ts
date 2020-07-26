import { ParsedTransactionItem } from "./parsed-transaction-item";

export interface FileTransactionReaderService {
	getLineItems: (filename: string) => Promise<ParsedTransactionItem[]>;
}