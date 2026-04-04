import type { Request, Response } from 'express';

export const uploadDocument = async (req: Request, res: Response) => {
  // TODO: implement document upload
  // 1. Check that req.file exists; return 400 if not
  // 2. Create a Document record in MongoDB
  // 3. Read the uploaded file buffer and extract text with pdf-parse
  // 4. Split the text into chunks using chunkText
  // 5. Save each chunk to MongoDB (embedding can be [] for now)
  // 6. Return 201 with the created document
};

export const getDocuments = async (req: Request, res: Response) => {
  // TODO: implement get all documents
  // Fetch all documents from MongoDB and return them
};
