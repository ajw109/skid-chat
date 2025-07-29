import OpenAI from "openai"
import "dotenv/config"

const { OPENAI_API_KEY } = process.env

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

async function testOpenAI() {
    try {
        console.log("Testing OpenAI connection...")
        
        // Test with a simple, short text
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: "Hello world",
            encoding_format: "float"
        })
        
        console.log("✅ OpenAI connection successful!")
        console.log("Embedding dimension:", embedding.data[0].embedding.length)
        console.log("Usage:", embedding.usage)
        
    } catch (error) {
        console.error("❌ OpenAI connection failed:", error)
        
        if (error instanceof Error) {
            console.error("Error message:", error.message)
        }
    }
}

testOpenAI()