import { NextResponse } from "next/server";
import { PineconeClient } from "@pinecone-database/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { createPineconeIndex, updatePinecone } from "@/utils/utils";
import { PINECONE_INDEX_NAME } from "@/config/pinecone";

export async function POST() {
  const loader = new DirectoryLoader("./resources", {
    ".txt": (path) => new TextLoader(path),
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });

  const docs = await loader.load();
  const vectorDimensions = 1536;

  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENV || "",
  });

  try {
    await createPineconeIndex(client, PINECONE_INDEX_NAME, vectorDimensions);
    await updatePinecone(client, PINECONE_INDEX_NAME, docs);
  } catch (err) {
    console.log("error: ", err);
  }

  return NextResponse.json({
    data: "successfully created index and loaded data into pinecone...",
  });
}
