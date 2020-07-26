import { Container } from "inversify";
import "reflect-metadata";
import SERVICE_IDENTIFIER from "../constants/identifiers";
import { FileTransactionReaderService } from "../interfaces/file-transaction-reader";
import { CSVTransactionReaderService } from "../services";
import { FraudDetector } from "../interfaces";
import { FraudDetectionService } from "../services/fraud-detector-service";

const container = new Container();

container.bind<FileTransactionReaderService>(SERVICE_IDENTIFIER.TRANSACTION_READER).to(CSVTransactionReaderService);
container.bind<FraudDetector>(SERVICE_IDENTIFIER.FRAUD_DETECTOR).to(FraudDetectionService);


export default container;