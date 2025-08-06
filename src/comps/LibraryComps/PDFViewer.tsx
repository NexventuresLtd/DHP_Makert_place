import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import "./PDFViewer.css";

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  documentTitle: string;
}

export default function PDFViewer({
  isOpen,
  onClose,
  pdfUrl,
  documentTitle,
}: PDFViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Disable keyboard shortcuts for download/print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+S (Save), Ctrl+P (Print), F12 (DevTools), etc.
      if (
        (e.ctrlKey && (e.key === "s" || e.key === "p")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Disable right-click
      document.addEventListener("contextmenu", handleContextMenu);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  // Construct iframe URL with parameters to disable download
  const iframeUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=${
    scale * 100
  }&download=0&print=0`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 pdf-viewer">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {documentTitle}
            </h3>
            <p className="text-sm text-gray-500">PDF Viewer - View Only</p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            <span className="text-sm text-gray-600 min-w-16 text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <button
              onClick={handleRotate}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Rotate"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-hidden bg-gray-100 relative">
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.3s ease",
            }}
          >
            <iframe
              src={iframeUrl}
              className="w-full h-full border-none"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                transition: "transform 0.3s ease",
              }}
              onContextMenu={(e) => e.preventDefault()}
              sandbox="allow-same-origin allow-scripts"
              title={`PDF Viewer - ${documentTitle}`}
            />
          </div>

          {/* Overlay to prevent direct interaction with PDF */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1 }}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            🔒 This document is for viewing only. Download, printing, and
            copying are disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
