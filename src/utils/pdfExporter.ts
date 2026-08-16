import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportOptions {
  filename?: string;
  quality?: number;
}

/**
 * Renders an HTML element directly to a downloadable high-resolution PDF file.
 */
export const exportElementToPdf = async (
  elementId: string,
  options: PdfExportOptions = {}
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`PDF export target element #${elementId} not found.`);
    window.print();
    return false;
  }

  const filename = options.filename?.endsWith('.pdf')
    ? options.filename
    : `${options.filename || 'tailored_cv'}.pdf`;

  try {
    // Render high-res canvas at 2x device scale for crisp print-grade typography
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      windowWidth: Math.max(document.documentElement.clientWidth, 1024),
      onclone: (clonedDoc) => {
        const clonedElem = clonedDoc.getElementById(elementId);
        if (clonedElem) {
          clonedElem.style.margin = '0 auto';
          clonedElem.style.maxWidth = '850px';
          clonedElem.style.width = '850px';
          clonedElem.style.boxShadow = 'none';
          clonedElem.style.border = 'none';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // A4 dimensions in millimeters
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    // Calculate dimensions with 6mm safety margin
    const margin = 6;
    const contentWidth = pdfWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pdfHeight - margin * 2) {
      // Fits on a single page
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight, undefined, 'FAST');
    } else {
      // Multi-page document handling
      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
      heightLeft -= (pdfHeight - margin * 2);

      while (heightLeft > 0) {
        position = position - (pdfHeight - margin * 2);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
        heightLeft -= (pdfHeight - margin * 2);
      }
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF via html2canvas/jspdf:', error);
    // Fallback: trigger browser print
    window.print();
    return false;
  }
};

/**
 * Dedicated clean print trigger that prints only the resume document.
 */
export const printResumeOnly = (elementId: string): void => {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Create isolated print iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Collect all existing stylesheets & fonts
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>RoleFit Resume</title>
        ${styles}
        <style>
          @page {
            size: a4 portrait;
            margin: 10mm;
          }
          body {
            background: #FFFFFF !important;
            color: #121316 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .resume-paper-sheet {
            box-shadow: none !important;
            border: none !important;
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
          }
        </style>
      </head>
      <body>
        <div class="print-container" style="width: 100%; background: #ffffff;">
          ${element.outerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    try {
      iframe.contentWindow?.print();
    } catch (e) {
      window.print();
    }
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 400);
};
