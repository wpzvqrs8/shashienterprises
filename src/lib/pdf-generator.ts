import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { QuoteOrder, StoreSettings } from './types';
import { DEFAULT_STORE_SETTINGS } from './constants';

/**
 * Converts numbers into Indian currency words representation.
 * e.g., 133735 -> "One Lakh Thirty Three Thousand Seven Hundred Thirty Five Rupees Only"
 */
export function numberToWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Zero Rupees Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToWords = (n: number): string => {
    if (n < 20) return units[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + numToWords(n % 100) : '');
    return '';
  };

  const integerPart = Math.floor(Math.abs(amount));
  let words = '';

  let crore = Math.floor(integerPart / 10000000);
  let remainder = integerPart % 10000000;

  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;

  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;

  if (crore > 0) words += `${numToWords(crore)} Crore `;
  if (lakh > 0) words += `${numToWords(lakh)} Lakh `;
  if (thousand > 0) words += `${numToWords(thousand)} Thousand `;
  if (remainder > 0) words += `${numToWords(remainder)} `;

  words = words.trim() + ' Rupees Only';
  return words;
}

export interface LoadedImageInfo {
  dataUrl: string;
  width?: number;
  height?: number;
}

/**
 * Loads an image from path / URL / base64 and converts to Data URL format with dimensions.
 * Supports public folder relative paths, http URLs, and base64 strings.
 */
export async function loadImageWithInfo(src: string): Promise<LoadedImageInfo | null> {
  if (!src) return null;

  // If already base64 data URL
  if (src.startsWith('data:image/')) {
    return { dataUrl: src };
  }

  // Node.js environment check
  if (typeof window === 'undefined') {
    try {
      const fs = await import('fs');
      const path = await import('path');

      if (src.startsWith('/')) {
        const localPath = path.join(process.cwd(), 'public', src);
        if (fs.existsSync(localPath)) {
          const buffer = fs.readFileSync(localPath);
          const ext = path.extname(localPath).replace('.', '') || 'png';
          const mime = ext === 'jpg' ? 'jpeg' : ext;
          const dataUrl = `data:image/${mime};base64,${buffer.toString('base64')}`;

          let width: number | undefined;
          let height: number | undefined;
          if (ext.toLowerCase() === 'png' && buffer.length > 24) {
            width = buffer.readUInt32BE(16);
            height = buffer.readUInt32BE(20);
          }
          return { dataUrl, width, height };
        }
      } else if (src.startsWith('http://') || src.startsWith('https://')) {
        const response = await fetch(src);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = response.headers.get('content-type') || 'image/png';
          const dataUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
          return { dataUrl };
        }
      }
    } catch (err) {
      console.warn('Node image loading error:', err);
    }
    return null;
  }

  // Browser environment
  try {
    let finalSrc = src;
    if (src.startsWith('/')) {
      finalSrc = window.location.origin + src;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const w = img.naturalWidth || img.width || 100;
          const h = img.naturalHeight || img.height || 100;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            resolve({ dataUrl, width: w, height: h });
            return;
          }
        } catch (e) {
          console.warn('Canvas conversion failed:', e);
        }
        resolve(null);
      };
      img.onerror = () => resolve(null);
      img.src = finalSrc;
    });
  } catch (err) {
    console.warn('Browser image load error:', err);
    return null;
  }
}

export async function loadImageAsBase64(src: string): Promise<string | null> {
  const info = await loadImageWithInfo(src);
  return info ? info.dataUrl : null;
}

export interface PdfOptions {
  settings?: StoreSettings;
  download?: boolean;
  baseUrl?: string;
}

/**
 * Generates invoice PDF for a QuoteOrder.
 */
export async function generateOrderPdf(
  order: QuoteOrder,
  options: PdfOptions = {}
): Promise<jsPDF> {
  const storeSettings = options.settings || DEFAULT_STORE_SETTINGS;
  const baseUrl = options.baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://www.shashienterprises.store');

  // Initialize jsPDF (A4 page format)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14; // mm

  // ----------------------------------------------------
  // 1. TOP HEADER BANNER
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text('BILL OF SUPPLY', margin, 12);

  // Box for "ORIGINAL FOR RECIPIENT"
  doc.setLineWidth(0.3);
  doc.setDrawColor(160, 160, 160);
  doc.roundedRect(pageWidth - margin - 52, 7, 52, 7, 1, 1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('ORIGINAL FOR RECIPIENT', pageWidth - margin - 50, 11.8);

  // Logo & Store Header
  let currentY = 20;

  // Try loading store logo with aspect ratio preservation
  const logoSrc = storeSettings.logoUrl || '/logo_black_bg.png';
  const logoInfo = await loadImageWithInfo(logoSrc);

  let logoWidth = 18;
  let logoHeight = 18;

  if (logoInfo?.dataUrl) {
    if (logoInfo.width && logoInfo.height && logoInfo.height > 0) {
      const aspect = logoInfo.width / logoInfo.height;
      logoHeight = 18;
      logoWidth = logoHeight * aspect;
      if (logoWidth > 45) {
        logoWidth = 45;
        logoHeight = logoWidth / aspect;
      }
    }

    try {
      let format = 'PNG';
      if (logoInfo.dataUrl.startsWith('data:image/jpeg') || logoInfo.dataUrl.startsWith('data:image/jpg')) {
        format = 'JPEG';
      }
      doc.addImage(logoInfo.dataUrl, format, margin, currentY, logoWidth, logoHeight);
    } catch (e) {
      console.warn('Could not add logo image:', e);
    }
  }

  // Store Details (Top Right / Center alongside logo)
  const storeLeftPos = logoInfo?.dataUrl ? margin + logoWidth + 5 : margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  doc.text(storeSettings.storeName || 'Shashi Enterprises', storeLeftPos, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);

  // Split store address if too long
  const addressLines = doc.splitTextToSize(storeSettings.address || 'Shop No. 275, New Lajpat Rai Market, Chandni Chowk, Delhi - 110006', 115);
  let addrY = currentY + 8.5;
  addressLines.forEach((line: string) => {
    doc.text(line, storeLeftPos, addrY);
    addrY += 3.8;
  });

  doc.text(`Mobile: ${storeSettings.whatsapp || '+91-8796138389'}`, storeLeftPos, addrY);
  addrY += 3.8;
  doc.text(`Email / Website: ${storeSettings.email || 'enterprisesshashi95@gmail.com'}`, storeLeftPos, addrY);
  addrY += 5;

  currentY = Math.max(currentY + logoHeight + 4, addrY + 2);

  // Horizontal dividing bar
  doc.setFillColor(30, 30, 30);
  doc.rect(margin, currentY, pageWidth - margin * 2, 1, 'F');
  currentY += 5;

  // ----------------------------------------------------
  // 2. INVOICE META BAR & BILL TO BOX
  // ----------------------------------------------------
  doc.setFillColor(245, 245, 247);
  doc.rect(margin, currentY, pageWidth - margin * 2, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  
  // Invoice / Order No. with Link
  const orderLabel = `Order / Invoice No.: ${order.orderNumber}`;
  doc.text(orderLabel, margin + 4, currentY + 8);
  
  // Add clickable hyperlink to order URL
  const orderUrl = `${baseUrl}/track/${encodeURIComponent(order.orderNumber)}`;
  const orderLabelWidth = doc.getTextWidth(orderLabel);
  doc.link(margin + 4, currentY + 2, orderLabelWidth, 8, { url: orderUrl });

  // Date
  const invoiceDateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN')
    : new Date().toLocaleDateString('en-IN');
  doc.text(`Date: ${invoiceDateStr}`, pageWidth - margin - 45, currentY + 8);

  currentY += 17;

  // BILL TO Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('BILL TO', margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text(order.businessName || order.contactPerson, margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);

  if (order.contactPerson && order.contactPerson !== order.businessName) {
    doc.text(`Attn: ${order.contactPerson}`, margin, currentY);
    currentY += 4.5;
  }

  const custAddr = `${order.address}, ${order.city} - ${order.pincode}`;
  const custAddrLines = doc.splitTextToSize(custAddr, pageWidth - margin * 2 - 20);
  custAddrLines.forEach((line: string) => {
    doc.text(line, margin, currentY);
    currentY += 4.5;
  });

  doc.text(`Mobile: ${order.phone} | Email: ${order.email}`, margin, currentY);
  currentY += 4.5;

  if (order.gstin) {
    doc.text(`GSTIN: ${order.gstin}`, margin, currentY);
    currentY += 4.5;
  }

  currentY += 4;

  // ----------------------------------------------------
  // 3. PRODUCTS TABLE WITH IMAGES
  // ----------------------------------------------------
  // Pre-load product images as base64
  const itemImageMap: Record<number, string | null> = {};
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    const imgSrc = item.product?.image;
    if (imgSrc) {
      itemImageMap[i] = await loadImageAsBase64(imgSrc);
    } else {
      itemImageMap[i] = null;
    }
  }

  const tableBody = order.items.map((item, index) => {
    return [
      '', // Image thumbnail column
      `${item.product.name}\nSKU: ${item.product.sku || 'SE-ANM'}`,
      `${item.quantity} PCS`,
      `Rs. ${item.selectedTierPrice.toLocaleString('en-IN')}`,
      `Rs. ${item.lineTotal.toLocaleString('en-IN')}`
    ];
  });

  const tableOptions: any = {
    startY: currentY,
    head: [['', 'ITEMS', 'QTY.', 'RATE', 'AMOUNT']],
    body: tableBody,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: [28, 26, 33],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
      cellPadding: 4,
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 16 }, // Thumbnail image column
      1: { cellWidth: 'auto' }, // Items description
      2: { cellWidth: 24, halign: 'center' }, // Qty
      3: { cellWidth: 30, halign: 'right' }, // Rate
      4: { cellWidth: 32, halign: 'right' }  // Amount
    },
    didDrawCell: (data: any) => {
      // Render thumbnail in column 0 of body
      if (data.section === 'body' && data.column.index === 0) {
        const rowIndex = data.row.index;
        const imgData = itemImageMap[rowIndex];
        if (imgData) {
          try {
            const padding = 1.5;
            const imgSize = 13;
            let format = 'PNG';
            if (imgData.startsWith('data:image/jpeg') || imgData.startsWith('data:image/jpg')) {
              format = 'JPEG';
            } else if (imgData.startsWith('data:image/webp')) {
              format = 'WEBP';
            }
            doc.addImage(
              imgData,
              format,
              data.cell.x + padding,
              data.cell.y + padding,
              imgSize,
              imgSize
            );
          } catch (err) {
            console.warn('Failed to draw item image in PDF table:', err);
          }
        }
      }
    },
    didDrawPage: (data: any) => {
      // Add page footer
      const totalPages = doc.internal.pages.length - 1;
      const currentPage = data.pageNumber;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(
        `Page ${currentPage} of ${totalPages}`,
        pageWidth - margin - 20,
        pageHeight - 8
      );
      doc.text(
        `${storeSettings.storeName} — Official B2B Quote & Invoice`,
        margin,
        pageHeight - 8
      );
    }
  };

  if (typeof (doc as any).autoTable === 'function') {
    (doc as any).autoTable(tableOptions);
  } else if (typeof autoTable === 'function') {
    autoTable(doc, tableOptions);
  } else if (typeof (autoTable as any)?.default === 'function') {
    (autoTable as any).default(doc, tableOptions);
  }

  // Get position after table
  const finalY = (doc as any).lastAutoTable.finalY || currentY + 40;
  let summaryY = finalY + 8;

  // Page break check if summary exceeds height
  if (summaryY + 45 > pageHeight - margin) {
    doc.addPage();
    summaryY = margin + 10;
  }

  // ----------------------------------------------------
  // 4. SUBTOTAL & TOTAL SUMMARY BOX
  // ----------------------------------------------------
  const summaryBoxWidth = 85;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;

  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  doc.setFillColor(250, 250, 252);
  doc.setDrawColor(220, 220, 225);
  doc.rect(summaryBoxX, summaryY, summaryBoxWidth, 28, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);

  doc.text(`Total Items Qty:`, summaryBoxX + 4, summaryY + 7);
  doc.setFont('helvetica', 'bold');
  doc.text(`${totalQty} PCS`, summaryBoxX + summaryBoxWidth - 4, summaryY + 7, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text(`Subtotal:`, summaryBoxX + 4, summaryY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${order.subtotal.toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 4, summaryY + 14, { align: 'right' });

  doc.setLineWidth(0.4);
  doc.setDrawColor(28, 26, 33);
  doc.line(summaryBoxX + 4, summaryY + 17, summaryBoxX + summaryBoxWidth - 4, summaryY + 17);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(226, 99, 43); // Ember accent color
  doc.text(`Total Amount:`, summaryBoxX + 4, summaryY + 23);
  doc.text(`Rs. ${order.subtotal.toLocaleString('en-IN')}`, summaryBoxX + summaryBoxWidth - 4, summaryY + 23, { align: 'right' });

  // Total in Words (Left aligned to summary box)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text('Total Amount (in words):', margin, summaryY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);

  const wordsStr = numberToWords(order.subtotal);
  const wordLines = doc.splitTextToSize(wordsStr, summaryBoxX - margin - 10);
  let wordY = summaryY + 13;
  wordLines.forEach((line: string) => {
    doc.text(line, margin, wordY);
    wordY += 4.5;
  });

  // Save / Download if requested
  if (options.download) {
    const fileName = `Invoice_${order.orderNumber || 'Order'}.pdf`;
    doc.save(fileName);
  }

  return doc;
}
