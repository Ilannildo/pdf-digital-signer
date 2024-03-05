import plainAddPlaceholder from "./pdf/node-signpdf/plain-add-placeholder";
import { addSignatureToPdf, replaceByteRangeInPdf } from "./pdf/node-signpdf/sign";
import { getSignature } from "./signature/digital-signature.service";
import { ISignPdf } from "./types";

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
