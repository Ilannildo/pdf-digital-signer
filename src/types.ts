import { SignatureOptions } from "./pdf/model/signature-options";

export type ISignPdf = {
  pdfBuffer: Buffer;
  certBuffer: Buffer;
  certPassword: string;
  signatureOptions: SignatureOptions;
}