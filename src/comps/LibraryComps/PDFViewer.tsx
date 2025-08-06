import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import "./PDFViewer.css";
import pdfWorker from "/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  // Load PDF document
  const loadPDF = useCallback(async () => {
    if (!pdfUrl || !isOpen) return;

    setLoading(true);
    setError(null);

    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setTotalPages(pdf.numPages);
      setCurrentPage(1);
      await renderPage(pdf, 1);
    } catch (err) {
      console.error("Error loading PDF:", err);
      setError("Failed to load PDF document");
    } finally {
      setLoading(false);
    }
  }, [pdfUrl, isOpen]);

  // Render a specific page
  const renderPage = async (pdf: any, pageNum: number) => {
    if (!canvasRef.current) return;

    const page = await pdf.getPage(pageNum);

    const outputScale = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale, rotation });

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = viewport.width * outputScale;
    canvas.height = viewport.height * outputScale;

    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const transform =
      outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

    const renderContext = {
      canvasContext: context,
      transform,
      viewport,
    };

    await page.render(renderContext).promise;
  };
  
  // Re-render current page when scale or rotation changes
  useEffect(() => {
    if (pdfDocRef.current && currentPage && !loading) {
      renderPage(pdfDocRef.current, currentPage);
    }
  }, [scale, rotation, currentPage, loading]);

  // Load PDF when component opens
  useEffect(() => {
    if (isOpen && pdfUrl) {
      loadPDF();
    }

    return () => {
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
    };
  }, [isOpen, pdfUrl, loadPDF]);

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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
            {/* Page Navigation */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-gray-600 min-w-20 text-center">
              {totalPages > 0 ? `${currentPage} / ${totalPages}` : "- / -"}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="h-6 w-px bg-gray-300 mx-2" />

            {/* Zoom Controls */}
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
        <div className="flex-1 overflow-auto bg-gray-100 relative p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p className="text-lg mb-2">⚠️ Error Loading PDF</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={loadPDF}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="shadow-lg max-w-full h-auto"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          )}
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
