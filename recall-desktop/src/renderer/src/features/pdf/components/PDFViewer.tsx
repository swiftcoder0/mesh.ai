import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PDFViewer(): React.JSX.Element {
  const [numPages, setNumPages] = useState<number>(0);

  const pdfFile = ""; // We'll connect this next

  return (
    <div className="flex h-full items-center justify-center rounded-lg bg-white">
      {pdfFile ? (
        <Document
          file={pdfFile}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={1} />
        </Document>
      ) : (
        <p className="text-gray-500 text-lg">
          📂 Select a PDF to begin
        </p>
      )}
    </div>
  );
}

export default PDFViewer;