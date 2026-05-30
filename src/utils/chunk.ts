const CHUNK_SIZE = 500;

export const chunkText = (_text: string): string[] => {
  const chunks: string[] = [];
  
  // Iterate through the text, adding CHUNK_SIZE to the i at each iteration
  for (let i = 0; i < _text.length; i += CHUNK_SIZE) {
    // Push the corresponding slice of text onto the chunks array
    chunks.push(_text.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};
