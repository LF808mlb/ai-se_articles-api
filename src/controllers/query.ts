import type { Request, Response } from 'express';

export const queryDocuments = async (req: Request, res: Response) => {
  // TODO: implement query handler
  // 1. Read question from req.body; return 400 if missing
  // 2. Fetch all chunks from MongoDB
  // 3. Embed the question using createEmbedding
  // 4. Rank chunks by similarity using rankBySimilarity
  // 5. Return the top results
};
