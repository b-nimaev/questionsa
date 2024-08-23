"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDocuments = void 0;
const qdrant_client_1 = require("qdrant-client");
const qdrantClient = new qdrant_client_1.QdrantClient({
    url: process.env.QDRANT_URL || "http://localhost:6333",
});
const searchDocuments = async (query) => {
    try {
        const result = await qdrantClient.search({
            collection_name: "my_collection",
            query_vector: query,
            top: 10,
        });
        return result;
    }
    catch (error) {
        console.error("Qdrant search error:", error);
        throw new Error("Search failed");
    }
};
exports.searchDocuments = searchDocuments;
