const pPDFEmbedAPIWrapper = {
      displayPDF: function (urlToPDF) {
        fetch(urlToPDF)
          .then(pPDFEmbedAPIWrapper.errorHandler)
          .then((response) => response.blob())
          .then((blob) => {
            pPDFEmbedAPIWrapper.embedView(blob, urlToPDF);
          })
          .catch((error) => {
            console.log(error);
          });
      },

      embedView: function (blob, urlToPDF) {
        if (window.adobeDCView) {
          window.adobeDCView = null;
        }
        window.adobeDCView = new AdobeDC.View({
          clientId: pPDFEmbedAPIWrapper.clientId,
          divId: pPDFEmbedAPIWrapper.divId
        });
        window.adobeFilePreview = adobeDCView.previewFile(
          {
            content: { promise: blob.arrayBuffer() },
            metaData: { fileName: urlToPDF.split("/").slice(-1)[0] }
          },
          pPDFEmbedAPIWrapper.viewerOptions
        );
      },

      errorHandler: function (response) {
        if (!response.ok) {
          if (typeof badResponse === "function") {
            badResponse(response); // modify the DOM here
          }
          throw Error("Fetch Response Status: " + response.status + " - " + response.statusText);
        }
        if (response.headers.get("Content-Type") != "application/pdf") {
          if (typeof notPDF === "function") {
            notPDF(response); // modify the DOM here
          }
          throw Error("The content at the requested URL is not a PDF file. Content-Type: " + response.headers.get("Content-Type"));
        }
        return response;
      },

    }

    pPDFEmbedAPIWrapper.clientId = "658cd1d6ab42411697dddbcf76b43790"; // This clientId can be used for any CodePen example;
    pPDFEmbedAPIWrapper.viewerOptions = {
      embedMode: "SIZED_CONTAINER",
      defaultViewMode: "FIT_PAGE",
      showDownloadPDF: false,
      showPrintPDF: false,
      showLeftHandPanel: true,
      showAnnotationTools: false
    };
    pPDFEmbedAPIWrapper.divId = "embeddedView";


    document.addEventListener("adobe_dc_view_sdk.ready", (event) => {
      document.getElementById("embedView01").addEventListener("click", function () {
        pPDFEmbedAPIWrapper.displayPDF("https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf")
      });
      document.getElementById("embedView02").addEventListener("click", function () {
        pPDFEmbedAPIWrapper.displayPDF("not an actual url")
      });
      document.getElementById("embedView03").addEventListener("click", function () {
        pPDFEmbedAPIWrapper.displayPDF("https://documentcloud.adobe.com/link/review?uri=urn:aaid:scds:US:966b466d-7cea-4066-b2a3-195771984e9a")
      });
      pPDFEmbedAPIWrapper.displayPDF("https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf");
    });

    function badResponse(response) {
      var messageElement = document.createElement("div");
      messageElement.classList.add("error-message");
      messageElement.appendChild(document.createTextNode("Fetch Response Status: " + response.status + " - " + response.statusText));
      document.getElementById("embeddedView").clearChildren();
      document.getElementById("embeddedView").appendChild(messageElement);
    }

    function notPDF(response) {
      var messageElement = document.createElement("div");
      messageElement.classList.add("error-message");
      messageElement.appendChild(document.createTextNode("The MIME type of the requested content is " + response.headers.get("Content-Type") + ". The content must be MIME type application/pdf."));
      document.getElementById("embeddedView").clearChildren();
      document.getElementById("embeddedView").appendChild(messageElement);
    }

    // Helper functions
    // Add arrayBuffer if necessary i.e. Safari
    (function () {
      if (Blob.arrayBuffer != "function") {
        Blob.prototype.arrayBuffer = myArrayBuffer;
      }

      function myArrayBuffer() {
        return new Promise((resolve) => {
          let fileReader = new FileReader();
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
          fileReader.readAsArrayBuffer(this);
        });
      }
    })();

    if (typeof Element.prototype.clearChildren === 'undefined') {
      Object.defineProperty(Element.prototype, 'clearChildren', {
        configurable: true,
        enumerable: false,
        value: function () {
          while (this.firstChild) this.removeChild(this.lastChild);
        }
      });
    }