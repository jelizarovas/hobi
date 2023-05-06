import jsQR from "jsqr";
export const QRScannerWorker = () => {
  self.addEventListener("message", (event) => {
    const imageData = event.data;
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    self.postMessage(code?.data);
  });
};
