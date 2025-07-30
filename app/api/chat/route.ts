import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { DataAPIClient } from "@datastax/astra-db-ts"

// Process variables from .env
const { ASTRA_DB_NAMESPACE,
ASTRA_DB_COLLECTION,
ASTRA_DB_API_ENDPOINT,
ASTRA_DB_APPLICATION_TOKEN,
OPENAI_API_KEY
} = process.env

const openai = new OpenAI({
apiKey: OPENAI_API_KEY
})

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE})

export async function POST(req: Request) {
try {
const { messages } = await req.json()
// Passing through the latest message / query
const latestMessage = messages[messages.length -1]?.content

let docContext = "" // The ten things that came back from the db

// Turn the latest message into an embedding
const embedding = await openai.embeddings.create({
model: "text-embedding-3-small",
input: latestMessage,
encoding_format: "float"
})

try {
const collection = await db.collection(ASTRA_DB_COLLECTION)
// Look in db for an answer similar to the query
const cursor = collection.find(null, {
sort: {
$vector: embedding.data[0].embedding,
},
limit: 10 // get 10 similar items
});
const documents = await cursor.toArray() // potential ten documents
const docsMap = documents?.map(doc => doc.text)// If the documents exist
docContext = JSON.stringify(docsMap)
} catch (err) {
console.log("Error querying db...") // If we don't find anything back, query db
docContext = ""
}

const template = {
role: "system" as const,
content: `You are Skidmore College's AI assistant, created by AJ Woods (she is class of 2027, CS major).
Use the below context along with your knowledge to provide helpful information about Skidmore College.
Always provide the most accurate and helpful response possible. Format responses using markdown where applicable and don't return images.
---------------
START CONTEXT
${docContext}
END CONTEXT
---------------
QUESTION: ${latestMessage}
`
} 

const response = await openai.chat.completions.create({
model: "gpt-4",
stream: true,
messages: [template, ...messages],
})

const stream = OpenAIStream(response as any)
return new StreamingTextResponse(stream)
} catch (err) {
throw err
}
}