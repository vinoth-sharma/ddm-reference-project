export class PdfUtility {
    static saveBlob(blob: Blob, fileName: string = 'download') {
        if (blob) {
            const downloadElement = document.createElement('a');
            downloadElement.href = window.URL.createObjectURL(blob);
            downloadElement.download = fileName;
            downloadElement.click();
        }
    }
}