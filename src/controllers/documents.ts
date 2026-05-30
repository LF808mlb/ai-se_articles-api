import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: 'File is required' }
    });
  }
  
  // Obtain a buffer with the file, and pass it to the parser
  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();
  
    // Chunk the text
  const chunks = chunkText(text);
  
  // Extract the title from the body, or req.file.originalname
  const title = req.body.title || req.file.originalname;
  
  // Create a Document document. See the models/document.ts
  const document = await Document.create({
    title,
    fileName: req.file.originalname,
  });

  // For each chunk, create a Chunk document see models/chunk.ts
  await Promise.all(
    chunks.map((chunk) =>
      Chunk.create({
        documentId: document._id,
        text: chunk,
        embedding: [], // placeholder — real embeddings added in the next lesson
      })
    )
  );

  // Send success response with the created document
  return res.status(201).json({
    success: true,
    data: document,
    error: null
  });
};

export const getDocuments = async (_req: Request, res: Response) => {
  try {
    const documents = await Document.find({});
    return res.status(200).json({
      success: true,
      data: documents,
      error: null
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      data: null,
      error: { message: 'Failed to fetch documents' }
    });
  }
};