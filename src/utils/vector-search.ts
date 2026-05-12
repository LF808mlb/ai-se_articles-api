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

export const rankBySimilarity = (
  _queryEmbedding: number[],
  _items: ChunkCandidate[],
  _limit = 5
): ScoredChunk[] => {
  // TODO: implement
  return [];
};
