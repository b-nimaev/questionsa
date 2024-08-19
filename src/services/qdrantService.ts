import { QdrantClient } from "qdrant-client";

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || "http://localhost:6333",
});

export const searchDocuments = async (query: string) => {
  try {
    const result = await qdrantClient.search({
      collection_name: "my_collection",
      query_vector: query,
      top: 10,
    });

    return result;
  } catch (error) {
    console.error("Qdrant search error:", error);
    throw new Error("Search failed");
  }
};
