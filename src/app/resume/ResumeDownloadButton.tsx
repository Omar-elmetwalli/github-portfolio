"use client";

import { useState, useEffect } from "react";

interface ResumeDownloadButtonProps {
  pdfPath: string;
}

export default function ResumeDownloadButton({ pdfPath }: ResumeDownloadButtonProps) {
  const [pdfExists, setPdfExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPdfExists = async () => {
      try {
        const response = await fetch(pdfPath, { method: "HEAD" });
        setPdfExists(response.ok);
      } catch {
        setPdfExists(false);
      }
    };
    checkPdfExists();
  }, [pdfPath]);

  if (pdfExists === null) {
    return (
      <div className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg">
        Checking...
      </div>
    );
  }

  if (!pdfExists) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume PDF
          </span>
        </div>
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Upload resume.pdf to /public
        </p>
      </div>
    );
  }

  return (
    <a
      href={pdfPath}
      download
      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download Resume PDF
    </a>
  );
}
