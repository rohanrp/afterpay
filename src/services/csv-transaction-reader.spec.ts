
import container from "../config/ioc-config";
import SERVICE_IDENTIFIER from "../constants/identifiers";
import { FileTransactionReaderService } from "../interfaces";

const reader = container.get<FileTransactionReaderService>(SERVICE_IDENTIFIER.TRANSACTION_READER);

describe('CSVTransactionReaderService', () => {
	it('parse a transaction file', async () => {
		const items = await reader.getLineItems('assets/transactions.csv');
		expect(items.length).toEqual(12);

		expect(items[0].hashedCardNumber).toEqual('123GoodCardSingle');
		expect(items[0].transactionAmount).toEqual(12);
		expect(items[0].transactionTimestamp.getTime()).toEqual(new Date('2014-04-29T12:15:51').getTime());
	})
})

