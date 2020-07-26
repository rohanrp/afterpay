
import container from "./config/ioc-config";
import { FileTransactionReaderService, FraudDetector } from "./interfaces";
import SERVICE_IDENTIFIER from "./constants/identifiers";

const reader = container.get<FileTransactionReaderService>(SERVICE_IDENTIFIER.TRANSACTION_READER);
const detector = container.get<FraudDetector>(SERVICE_IDENTIFIER.FRAUD_DETECTOR);

const defaultTimePeriod = 24;
const threshold: number = parseFloat(process.argv[2]);
const filename: string = process.argv[3];


if (process.argv.length !== 4) {
  throw new Error('invalid arguments')
}

reader.getLineItems(filename).then((items) => {
  const fraudalentCardNumbers: string[] = detector.getFraudalentTransactionsByWindowHours(items, threshold, defaultTimePeriod);
  console.log('Card Numbers with suspected fraud')
  console.log(fraudalentCardNumbers);
}).catch((e) => {
  console.error(e);
  console.error('Unable to parse transaction file');
})


