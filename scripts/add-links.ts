import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer"
import OpenAI from "openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import "dotenv/config"

// Process variables from .env
const {
    ASTRA_DB_NAMESPACE,
    ASTRA_DB_COLLECTION,
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env

// Connect to OpenAI
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

// Connect to existing database
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE })

// Split into chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

// Add URLs here
const newUrls = [
    'https://www.skidmore.edu/it/about/index.php',
    'https://www.skidmore.edu/it/about/index.php#mission',
    'https://www.skidmore.edu/it/start.php',
    'https://www.skidmore.edu/it/policies/acceptable-use.php',
    'https://www.skidmore.edu/it/email/policies.php',
    'https://www.skidmore.edu/it/policies/capital_request.php',
    'https://www.skidmore.edu/it/policies/email-custodianship.php',
    'https://www.skidmore.edu/it/policies/heoa.php',
    'https://www.skidmore.edu/it/policies/incommon.php',
    'https://www.skidmore.edu/it/accounts/passwords.php',
    'https://www.skidmore.edu/it/policies/vendors.php',
    'https://www.skidmore.edu/it/policies/software_piracy.php',
    'https://www.skidmore.edu/it/policies/page_creation.php',
    'https://www.skidmore.edu/it/policies/copyright_infringement.php',
    'https://www.skidmore.edu/it/policies/copyright_terms.php',
    'https://www.skidmore.edu/it/accounts/index.php',
    'https://www.skidmore.edu/it/accounts/create.php',
    'https://www.skidmore.edu/it/accounts/passwords.php',
    'https://www.skidmore.edu/it/email/policies.php',
    'https://www.skidmore.edu/it/computingandprinting/purchasing.php',
    'https://www.skidmore.edu/it/email/index.php',
    'https://leds.domains.skidmore.edu/zoom/',
    'https://leds.domains.skidmore.edu/zoom-security-best-practices/',
    'https://leds.domains.skidmore.edu/meet-the-staff/',
    'https://leds.domains.skidmore.edu/professional-affiliations/',
    'https://leds.domains.skidmore.edu/learninglab/',
    'https://leds.domains.skidmore.edu/classroom-response-systems/',
    'https://leds.domains.skidmore.edu/web-storytelling/',
    'https://leds.domains.skidmore.edu/distance-communication/',
    'https://leds.domains.skidmore.edu/generative-ai-tools-and-their-uses-for-teaching-learning/',
    'https://leds.domains.skidmore.edu/immersive-learning/',
    'https://leds.domains.skidmore.edu/interactive-presentations/',
    'https://leds.domains.skidmore.edu/learninglab/',
    'https://leds.domains.skidmore.edu/learning-management-system/',
    'https://leds.domains.skidmore.edu/lecture-capture/',
    'https://leds.domains.skidmore.edu/plagiarism-prevention-detection/',
    'https://leds.domains.skidmore.edu/technology-accessibility/',
    'https://leds.domains.skidmore.edu/web-design/',
    'https://leds.domains.skidmore.edu/web-storytelling/#audacity',
    'https://leds.domains.skidmore.edu/box/',
    'https://leds.domains.skidmore.edu/plagiarism-prevention-detection/#plagiarism',
    'https://leds.domains.skidmore.edu/discussion-mailing-lists/',
    'https://leds.domains.skidmore.edu/classroom-response-systems/#iclickers',
    'https://leds.domains.skidmore.edu/interactive-presentations/#mobile',
    'https://leds.domains.skidmore.edu/lecture-capture/#panopto',
    'https://leds.domains.skidmore.edu/support-surveys-qualtrics/',
    'https://leds.domains.skidmore.edu/learning-management-system/#thespring',
    'https://leds.domains.skidmore.edu/training/',
    'https://leds.domains.skidmore.edu/web-design/#wordpress',
    'https://leds.domains.skidmore.edu/useful-info/',
    'https://leds.domains.skidmore.edu/course-continuity-resources/',
    'https://leds.domains.skidmore.edu/useful-info/computing-software/',
    'https://leds.domains.skidmore.edu/new-general-education-requirements/',
]

// Adds new URLs to existing collection
const addNewData = async (urls: string[]) => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    
    for await (const url of urls) {
        try {
            console.log(`Processing: ${url}`)
            const content = await scrapePage(url)
            const chunks = await splitter.splitText(content)
            
            for await (const chunk of chunks) {
                const embedding = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: chunk,
                    encoding_format: "float"
                })
                
                const vector = embedding.data[0].embedding
                await collection.insertOne({
                    $vector: vector,
                    text: chunk
                })
            }
            console.log(`Successfully processed: ${url}`)
        } catch (error) {
            console.error(`Failed to process ${url}:`, error.message)
        }
    }
}

// Scrape function
const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

// Run the script
addNewData(newUrls)