import fs from "fs";
import { SignatureOptions } from "../pdf/model/signature-options";
import { signPdf } from "..";

async function signPdfWithImage() {
  const p12Buffer = fs.readFileSync(`./assets/pdf-signer.p12`);
  const pdfBuffer = fs.readFileSync(`./assets/example.pdf`);
  const certPassword = "pdfsigner";
  const signatureOptions: SignatureOptions = {
    reason: "2",
    email: "test@email.com",
    location: "Location, LO",
    signerName: "Test User",
    annotationAppearanceOptions: {
      signatureCoordinates: { left: 0, bottom: 700, right: 190, top: 860 },
      signatureDetails: [
        {
          value: "Signed by: Kiss Béla",
          fontSize: 7,
          transformOptions: {
            rotate: 0,
            space: 1,
            tilt: 0,
            xPos: 20,
            yPos: 20,
          },
        },
        {
          value: "Date: 2019-10-11",
          fontSize: 7,
          transformOptions: {
            rotate: 0,
            space: 1,
            tilt: 0,
            xPos: 20,
            yPos: 30,
          },
        },
      ],
      imageDetails: {
        imagePath: "./assets/certification.jpg",
        transformOptions: {
          rotate: 0,
          space: 200,
          stretch: 50,
          tilt: 0,
          xPos: 0,
          yPos: 10,
        },
      },
    },
  };

  const signedPdf = await signPdf({
    pdfBuffer,
    certBuffer: p12Buffer,
    certPassword,
    signatureOptions,
  });

  fs.writeFileSync('./assets/results/signed-with-image.pdf', signedPdf)

  console.log(`signature successful`);
}

signPdfWithImage()