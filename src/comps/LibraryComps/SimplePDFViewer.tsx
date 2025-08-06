import { useState, useEffect } from "react";
import { X, ExternalLink, AlertCircle } from "lucide-react";

interface SimplePDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  documentTitle: string;
}

export default function SimplePDFViewer({
  isOpen,
  onClose,
  pdfUrl,
  documentTitle,
}: SimplePDFViewerProps) {
  const [showError, setShowError] = useState(false);

  // Disable keyboard shortcuts for download/print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "s" || e.key === "p")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I")
      ) {
        e.preventDefault();
        return false;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = e.currentTarget;
    try {
      // Check if iframe loaded successfully
      if (!iframe.contentDocument) {
        setTimeout(() => setShowError(true), 2000);
      }
    } catch (err) {
      setShowError(true);
    }
  };

  const openInNewTab = () => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {documentTitle}
            </h3>
            <p className="text-sm text-gray-500">PDF Viewer - View Only Mode</p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={openInNewTab}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </button>

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
          {showError ? (
            // Error state when iframe is blocked
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8 max-w-lg">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  PDF Display Blocked
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  <strong>This is normal!</strong> Chrome blocks PDFs in iframes
                  for security reasons. This happens with most PDFs from
                  external sources and protects you from potential security
                  risks.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={openInNewTab}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 font-medium"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View PDF in New Tab
                  </button>
                  <button
                    onClick={() => {
                      setShowError(false);
                      // Force iframe reload
                      const iframe = document.querySelector(
                        "iframe[data-pdf-viewer]"
                      ) as HTMLIFrameElement;
                      if (iframe) {
                        iframe.src = iframe.src;
                      }
                    }}
                    className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Why is this happening?</strong>
                    <br />
                    Modern browsers block external PDFs to prevent malicious
                    content. Opening in a new tab is the secure way to view the
                    document.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Normal iframe view
            <>
              <iframe
                data-pdf-viewer
                src={pdfUrl}
                className="w-full h-full border-none"
                onLoad={handleIframeLoad}
                onError={() => setShowError(true)}
                title={`PDF Viewer - ${documentTitle}`}
                sandbox="allow-same-origin allow-scripts"
              />

              {/* Loading indicator */}
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 pointer-events-none">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              🔒 This document is for viewing only. Download and printing may be
              restricted.
            </p>
            {!showError && (
              <button
                onClick={() => setShowError(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Having issues? Click here
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
