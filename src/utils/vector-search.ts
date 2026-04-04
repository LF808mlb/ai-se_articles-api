type ChunkCandidate = {
  id: string;
  documentId: string;
  text: string;
  embedding: number[];
};

type ScoredChunk = {
  id: string;
  documentId: string;
  text: string;
  score: number;
};

// TODO: implement dot product of two vectors
const dot = (a: number[], b: number[]): number => {
  return 0;
};

// TODO: implement vector magnitude (euclidean length)
const magnitude = (vec: number[]): number => {
  return 1;
};

export const rankBySimilarity = (
  queryEmbedding: number[],
  items: ChunkCandidate[],
  limit = 5
): ScoredChunk[] => {
  // TODO: score each item by cosine similarity to queryEmbedding,
  // sort descending, and return the top `limit` results
  return [];
};
