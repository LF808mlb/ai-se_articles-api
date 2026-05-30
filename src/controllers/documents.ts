import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';

export const uploadDocument = async (req: Request, res: Response) => {
    if (!req.file) {
    // File not found
    return;
  }
  
  // Obtain a buffer with the file, and pass it to the parser
  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  
  // Parse the text
  const { text } = await parser.getText();
  
 
};

export const getDocuments = async (_req: Request, _res: Response) => {};