/**
 * Basic implementation of signature extraction.
 *
 * Really basic. Would work in the simplest of cases where there is only one signature
 * in a document and ByteRange is only used once in it.
 *
 * @param {Buffer} pdf
 * @returns {Object} {ByteRange: Number[], signature: Buffer, signedData: Buffer}
 */

export const extractSignature = (
  pdf: Buffer,
  signatureCount = 1
): {
  ByteRange: number[];
  signature: string;
  signedData: Buffer;
  signatureHex: string;
} => {
  if (!(pdf instanceof Buffer)) {
    throw new Error("PDF expected as Buffer.");
  } // const byteRangePos = pdf.indexOf('/ByteRange [');

  const byteRangePos = getSubstringIndex(pdf, "/ByteRange [", signatureCount);

  if (byteRangePos === -1) {
    throw new Error("Failed to locate ByteRange.");
  }

  const byteRangeEnd = pdf.indexOf("]", byteRangePos);

  if (byteRangeEnd === -1) {
    throw new Error("Failed to locate the end of the ByteRange.");
  }

  const byteRange = pdf.slice(byteRangePos, byteRangeEnd + 1).toString();
  const matches = /\/ByteRange \[(\d+) +(\d+) +(\d+) +(\d+) *\]/.exec(
    byteRange
  );

  if (matches === null) {
    throw new Error("Failed to parse the ByteRange.");
  }

  const ByteRange = matches.slice(1).map(Number);
  const signedData = Buffer.concat([
    pdf.slice(ByteRange[0], ByteRange[0] + ByteRange[1]),
    pdf.slice(ByteRange[2], ByteRange[2] + ByteRange[3]),
  ]);
  const signatureHex = pdf
    .slice(ByteRange[0] + ByteRange[1] + 1, ByteRange[2])
    .toString("binary")
    .replace(">", "");
  //.replace(/(?:00|>)+$/, '')
  const signature = Buffer.from(signatureHex, "hex").toString("binary");
  return {
    ByteRange: matches.slice(1, 5).map(Number),
    signature,
    signedData,
    signatureHex,
  };
};

const getSubstringIndex = (str: Buffer, substring: string, n: number) => {
  var times = 0,
    index = undefined;

  while (times < n && index !== -1) {
    if (index) {
      index = str.indexOf(substring, index + 1);
    }
    times++;
  }

  return index;
};
