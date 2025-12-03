import { PDFDocument, rgb } from 'pdf-lib';

/**
 * Adds a signature image to all pages of a PDF
 * @param pdfUrl - URL of the original PDF
 * @param signatureDataUrl - Base64 data URL of the signature image
 * @returns Base64 encoded string of the signed PDF
 */
export async function addSignatureToPdf(
  pdfUrl: string,
  signatureDataUrl: string
): Promise<string> {
  try {
    // Fetch the original PDF
    const pdfResponse = await fetch(pdfUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    // Convert signature data URL to image
    const signatureImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

    // Get signature dimensions
    const signatureDims = signatureImage.scale(0.3); // Scale down to 30% of original size

    // Get all pages
    const pages = pdfDoc.getPages();

    // Add signature to each page (bottom right corner)
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      
      // Position signature in bottom right corner with margin
      const x = width - signatureDims.width - 50;
      const y = 50; // 50 points from bottom

      page.drawImage(signatureImage, {
        x,
        y,
        width: signatureDims.width,
        height: signatureDims.height,
      });

      // Add "Firmado digitalmente" text below signature
      page.drawText('Firmado digitalmente', {
        x: x + 10,
        y: y - 15,
        size: 8,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Add timestamp
      const now = new Date();
      const timestamp = now.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      page.drawText(timestamp, {
        x: x + 10,
        y: y - 27,
        size: 7,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Convert to base64
    const base64Pdf = btoa(
      Array.from(new Uint8Array(pdfBytes))
        .map(byte => String.fromCharCode(byte))
        .join('')
    );

    return base64Pdf;
  } catch (error) {
    console.error('Error adding signature to PDF:', error);
    throw new Error('No se pudo agregar la firma al PDF');
  }
}

/**
 * Uploads a file to Strapi media library
 * @param base64Data - Base64 encoded file data
 * @param fileName - Name for the file
 * @param token - JWT authentication token
 * @returns Upload response from Strapi
 */
export async function uploadToStrapi(
  base64Data: string,
  fileName: string,
  token: string
): Promise<{ id: number; url: string; name: string }> {
  try {
    // Convert base64 to Blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // Create form data
    const formData = new FormData();
    formData.append('files', blob, fileName);

    // Upload to Strapi
    const response = await fetch('https://dashboard.grupogersan360.com/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi upload error:', errorText);
      throw new Error('Error al subir el archivo a Strapi');
    }

    const uploadedFiles = await response.json();
    return uploadedFiles[0]; // Return first uploaded file
  } catch (error) {
    console.error('Error uploading to Strapi:', error);
    throw new Error('No se pudo subir el archivo');
  }
}

/**
 * Updates a contract with the new signed PDF
 * @param contractDocumentId - Document ID of the contract to update (Strapi v5)
 * @param pdfId - ID of the uploaded PDF in Strapi
 * @param token - JWT authentication token
 */
export async function updateContractPdf(
  contractDocumentId: string,
  pdfId: number,
  token: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://dashboard.grupogersan360.com/api/contratos/${contractDocumentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            pdf: pdfId,
            signed: true,
            signedAt: new Date().toISOString(),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Contract update error:', errorText);
      throw new Error('Error al actualizar el contrato');
    }
  } catch (error) {
    console.error('Error updating contract:', error);
    throw new Error('No se pudo actualizar el contrato');
  }
}
