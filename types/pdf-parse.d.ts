declare module "pdf-parse" {
  interface PdfParseResult {
    numpages: number;
    numrender?: number;
    text: string;
    info?: unknown;
    metadata?: unknown;
    version?: string;
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: Record<string, unknown>
  ): Promise<PdfParseResult>;

  export = pdfParse;
}
