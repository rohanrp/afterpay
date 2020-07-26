import { injectable } from "inversify";
import { FileTransactionReaderService } from "../interfaces/file-transaction-reader";
import csv = require('csv-parser');
import fs = require('fs');
import { ParsedTransactionItem, RawTransactionItem } from "../interfaces";
import { CardTransactionItem } from "../entities";

@injectable()
export class CSVTransactionReaderService implements FileTransactionReaderService {

	public getLineItems(filename: string): Promise<ParsedTransactionItem[]> {
		return new Promise((resolve, reject) => {
			const items: ParsedTransactionItem[] = [];
			fs.createReadStream(filename)
				.pipe(csv())
				.on('data', (row: RawTransactionItem) => {
					items.push(new CardTransactionItem(row));
				})
				.on('end', () => {
					resolve(items);
				})
				.on('error', (e) => {
					reject(e);
				});
		});
	}
}