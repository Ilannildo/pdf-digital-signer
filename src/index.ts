import plainAddPlaceholder from "./pdf/node-signpdf/plain-add-placeholder";
import forge from "node-forge";
import {
  addSignatureToPdf,
  replaceByteRangeInPdf,
} from "./pdf/node-signpdf/sign";
import * as certUtil from "./signature/cert.util";
import {
  getCertificate,
  getKeyBags,
  getPrivateKey,
  getRawSignature,
  getSignature,
  getSigner,
} from "./signature/digital-signature.service";
import { IGetCertData, ISignPdf } from "./types";

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

export function getCertData({ certBuffer, certPassword }: IGetCertData) {
  try {
    const p12Data = certUtil.getDataFromP12Cert(certBuffer, certPassword);

    const certBags = certUtil.getCertBags(p12Data);
    const keyBags = getKeyBags(p12Data);
    const privateKey = getPrivateKey(keyBags);

    const p7 = forge.pkcs7.createSignedData();

    const certificate: forge.pki.Certificate = getCertificate(
      p7,
      certBags,
      privateKey
    );
    console.log("CERTIFICADO => ", certificate);

    return certificate;
  } catch (error) {
    return null;
  }
}
