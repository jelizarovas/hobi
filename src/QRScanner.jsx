import React from "react";
// import jsQR from "jsqr";
import { QRScannerWorker } from "./qr.worker";

// import qrworker from "./qr.worker";
// import WebWorker from "./WebWorker";
//TODO MAKE WORKER WORK
export const QRScanner = ({
  lastDetected = "",
  setLastDetected = () => {},
}) => {
  const worker = React.useRef(null);

  React.useEffect(() => {
    // const worker = new WebWorker(qrworker);

    var video = document.createElement("video");
    var canvasElement = document.getElementById("canvas");
    var canvas = canvasElement.getContext("2d");
    var loadingMessage = document.getElementById("loadingMessage");
    var outputContainer = document.getElementById("output");
    var outputMessage = document.getElementById("outputMessage");
    var outputData = document.getElementById("outputData");

    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();

        worker.current = new QRScannerWorker();
        requestAnimationFrame(() =>
          tick(
            video,
            canvas,
            loadingMessage,
            outputContainer,
            outputMessage,
            outputData
          )
        );

        // requestAnimationFrame(tick);
      });

    // function handleParse(imageData) {
    //   worker.postMessage(imageData);
    // }

    // worker.addEventListener("message", (event) => {
    //     const sortedList = event.data;
    //     this.setState({
    //       users: sortedList,
    //     });
    //   });

    function tick() {
      loadingMessage.innerText = "⌛ Loading video...";
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;

        canvasElement.height = video.videoHeight / 2;
        canvasElement.width = video.videoWidth / 2;
        canvas.drawImage(
          video,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
        var imageData = canvas.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        // var code = handleParse(imageData);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          drawLine(
            code.location.topLeftCorner,
            code.location.topRightCorner,
            "#FF3B58"
          );
          drawLine(
            code.location.topRightCorner,
            code.location.bottomRightCorner,
            "#FF3B58"
          );
          drawLine(
            code.location.bottomRightCorner,
            code.location.bottomLeftCorner,
            "#FF3B58"
          );
          drawLine(
            code.location.bottomLeftCorner,
            code.location.topLeftCorner,
            "#FF3B58"
          );
          outputMessage.hidden = true;
          outputData.parentElement.hidden = false;
          outputData.innerText = code.data;
          if (lastDetected !== code.data) {
            setLastDetected(code.data);
          }
        } else {
          outputMessage.hidden = false;
          outputData.parentElement.hidden = true;
        }
      }
      requestAnimationFrame(tick);
    }
    return () => {
      video &&
        video.srcObject?.getTracks().forEach((track) => {
          track.stop();
        });
      // worker.terminate();
      worker.current?.terminate();
    };
  }, [lastDetected, setLastDetected]);

  return (
    <div className="container mx-auto">
      <div id="loadingMessage" className="h-60">
        🎥 Unable to access video stream (please make sure you have a webcam
        enabled)
      </div>
      <canvas id="canvas" hidden></canvas>
      <div id="output" hidden>
        <div id="outputMessage">No QR code detected.</div>
        <div className="text-xs " hidden>
          <b>Data:</b> <span id="outputData"></span>
        </div>
      </div>
    </div>
  );
};
