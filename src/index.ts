import { SignatureOptions } from "./pdf/model/signature-options";
import plainAddPlaceholder from "./pdf/node-signpdf/plain-add-placeholder";
import { addSignatureToPdf, replaceByteRangeInPdf } from "./pdf/node-signpdf/sign";
import { getSignature } from "./signature/digital-signature.service";

export interface ISignPdf {
  pdfBuffer: Buffer;
  certBuffer: Buffer;
  certPassword: string;
  signatureOptions: SignatureOptions;
}

export async function signPdf({
  pdfBuffer,
  certBuffer,
  certPassword,
  signatureOptions,
}: ISignPdf) {
  const pdfWithPlaceholder: Buffer = await plainAddPlaceholder(
    pdfBuffer,
    signatureOptions
  );

  const {
    pdf: pdfWithActualByteRange,
    placeholderLength,
    byteRange,
  } = replaceByteRangeInPdf(pdfWithPlaceholder);

  const signature = getSignature(
    pdfWithActualByteRange,
    certBuffer,
    placeholderLength,
    certPassword
  );

  const signedPdf = addSignatureToPdf(
    pdfWithActualByteRange,
    byteRange[1],
    signature
  );

  return signedPdf;
}
