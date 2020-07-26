
import container from "../config/ioc-config";
import { FraudDetector } from "../interfaces";
import { CardTransactionItem } from "../entities";
import SERVICE_IDENTIFIER from "../constants/identifiers";

const detector = container.get<FraudDetector>(SERVICE_IDENTIFIER.FRAUD_DETECTOR);


describe('FraudDetectionService', () => {
	it('allows single within threshold transaction', () => {
		const items = [
			createTransaction('123GoodCardSingle', '2014-04-29T12:15:51', '12.00')
		]
		const fraudalentCardNumbers: string[] = detector.getFraudalentTransactionsByWindowHours(items, 100, 24);
		expect(fraudalentCardNumbers.length).toEqual(0);
	})


	it('rejects single outside threshold transaction', () => {
		const items = [
			createTransaction('123GoodCardSingle', '2014-04-29T12:15:51', '12.00'),
			createTransaction('123BadCardSingle', '2014-04-29T13:15:51', '120.00')
		]
		const fraudalentCardNumbers: string[] = detector.getFraudalentTransactionsByWindowHours(items, 100, 24);
		expect(fraudalentCardNumbers.length).toEqual(1);
		expect(fraudalentCardNumbers[0]).toEqual('123BadCardSingle');
	})

	it('rejects outside threshold transactions within the same period', () => {
		const items = [
			createTransaction('123BadCardWithinSameDay', '2014-04-04T14:16:51', '60.50'),
			createTransaction('123BadCardWithinSameDay', '2014-04-04T15:18:51', '30.50'),
			createTransaction('123BadCardWithinSameDay', '2014-04-04T16:17:51', '30.50'),
		]
		const fraudalentCardNumbers: string[] = detector.getFraudalentTransactionsByWindowHours(items, 100, 24);
		expect(fraudalentCardNumbers.length).toEqual(1);
	})


	it('allows outside threshold transactions outside the same period', () => {
		const items = [
			createTransaction('123BadCardOutsideSameDay', '2014-04-05T12:16:51', '60.50'),
			createTransaction('123BadCardOutsideSameDay', '2014-04-07T11:18:51', '60.50'),
			createTransaction('123BadCardOutsideSameDay', '2014-04-08T12:18:51', '60.50'),
			// createTransaction('', '', ''),
		]

		const fraudalentCardNumbers: string[] = detector.getFraudalentTransactionsByWindowHours(items, 100, 24);
		expect(fraudalentCardNumbers.length).toEqual(0);
	})

	it('rejects outside threshold transactions with the same period but different days', () => {
		const items = [
			createTransaction('123BadCardWithinSameDayButDifferentDates', '2014-04-10T12:18:51', '60.50'),
			createTransaction('123BadCardWithinSameDayButDifferentDates', '2014-04-11T11:18:51', '60.50'),
		]

		const fraudalentCardNumbers: string[] = detector.getFraudalentTransactionsByWindowHours(items, 100, 24);
		expect(fraudalentCardNumbers.length).toEqual(1);
	})


	it('allows within threshold transactions with the same period but different days', () => {
		const items = [
			createTransaction('123GoodCardWithinSameDayButDifferentDates', '2014-04-12T12:18:51', '60.50'),
			createTransaction('123GoodCardWithinSameDayButDifferentDates', '2014-04-13T10:18:51', '20.50'),
		]

		const fraudalentCardNumbers: string[] = detector.getFraudalentTransactionsByWindowHours(items, 100, 24);
		expect(fraudalentCardNumbers.length).toEqual(0);
	})
})


const createTransaction = (hashedCardNumber: string, transactionTimestamp: string, transactionAmount: string) => {
	const row = {
		hashedCardNumber,
		transactionTimestamp,
		transactionAmount
	}
	return new CardTransactionItem(row);
}
