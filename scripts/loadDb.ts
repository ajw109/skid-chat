import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer"
import OpenAI from "openai"

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import "dotenv/config"

type SimilarityMetric = "dot_product" | "cosine" | "euclidean"

// Process variables from .env
const { ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_API_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN,
    OPENAI_API_KEY
} = process.env

// Connect to open AI (pass key to constructor)
const openai = new OpenAI({ apiKey: OPENAI_API_KEY})

// Define websites that we want to scrape
const skidData = [

    // Maps
    'https://www.skidmore.edu/maps-directions-tours/index.php', // maps and directories
    'https://map.concept3d.com/?id=11#!ct/71761,71762,71765?s/', // full interactive map
    'https://map.concept3d.com/?id=545#!ct/6718,6720,6721,6722,8044,8045?s/', // interactive sustainability map
    'https://map.concept3d.com/?id=11#!ct/21322?s/', // parking map

    // Athletic facilities
    'https://skidmoreathletics.com/facilities', // athletic facilities main page
    'https://skidmoreathletics.com/', // skidmoreathletics.come
    'https://skidmoreathletics.com/facilities/williamson-sports-center/10', // williamson sports center
    'https://skidmoreathletics.com/facilities/mccaffery-wagman-tennis-and-wellness-center/66', // mac wag main page
    'https://www.skidmore.edu/mccaffery-wagman/index.php', // mac wag main page detailed
    'https://skidmoreathletics.com/facilities/wachenheim-field/4', // wachenheim field
    'https://skidmoreathletics.com/facilities/wagner-park/68', // wagner park
    'https://www.skidmore.edu/studentlife/intramural.php', // intramurals
    'https://skidmoreathletics.com/honors/skidmore-college-athletics-hall-of-fame', // hall of fame
    'https://www.skidmore.edu/fosa/benefit/', // friends
    'https://skidmoreathletics.com/calendar', // calendar
    'https://skidmoreathletics.com/sports/2024/11/19/conference-awards.aspx', // conference awards
    'https://skidmoreathletics.com/coverage', // live game coverage
    'https://sideline.bsnsports.com/schools/newyork/saratogasprings/skidmore-college-athletics', // online store
    'https://skidmoreathletics.com/archives', // story archives
    'https://skidmoreathletics.com/on-this-day', // this day in history
    'https://skidmoreathletics.com/sports/2009/2/5/Gen_0205095333.aspx', // thoroughbred society
    'https://skidmoreathletics.com/staff-directory', // athletics directory
    'https://skidmoreathletics.com/sports/2024/6/18/skidmore-rowing-recruiting-information.aspx', // athletics

    // Williamson Sports Center
    'https://skidmoreathletics.com/facilities/williamson-sports-center-main-gym-/71', // brief details
    'https://skidmoreathletics.com/facilities/williamson-sports-center-pool-/72', // pool details

    // Off Campus Athletics
    'https://skidmoreathletics.com/facilities/saratoga-city-rink/3', // baseball field
    'https://skidmoreathletics.com/facilities/turf-baseball-field-coming-soon-/70', // baseball field
    'https://skidmoreathletics.com/facilities/valentine-boathouse/67', // boat house

    // Student Affairs
    'https://www.skidmore.edu/', // skid website main page
    'https://www.skidmore.edu/dean-students/', // dean of students
    'https://www.skidmore.edu/dean-students/ra-ca-unionization.php', // union
    'https://www.skidmore.edu/dean-students/student-event-co-sponsorship.php', // events
    'https://www.skidmore.edu/dean-students/tudor_loans.php', // emergency loans
    'https://www.skidmore.edu/dean-students/student_opp_fund.php', // student opportunity fund
    'https://www.skidmore.edu/dean-students/saig.php', // assessment and intervention group
    'https://www.skidmore.edu/dean-students/offices.php', // offices and services
    'https://www.skidmore.edu/student_handbook/index.php', // handbook
    'https://www.skidmore.edu/dean-students/student_resources.php', // resources

    // Admission and Aid
    'https://www.skidmore.edu/admissions/apply/index.php', // applications
    'https://www.skidmore.edu/admissions/aid/index.php', // aid
    'https://www.skidmore.edu/admissions/aid/typesofaid.php', // types of aid
    'https://www.skidmore.edu/admissions/apply/faqs.php#aid', // faqs
    'https://www.skidmore.edu/admissions/aid/calculators.php', // cost calculator
    'https://www.skidmore.edu/admissions/aid/fafsa-2024.php', // fafsa
    'https://www.skidmore.edu/financialaid/index.php', // office of aid
    'https://www.skidmore.edu/admissions/why/index.php', // why skidmore
    'https://www.skidmore.edu/admissions/connect/index.php', // contact
    'https://www.skidmore.edu/admissions/apply/parents-families.php', // families
    'https://www.skidmore.edu/admissions/diversity/index.php', // diversity
    'https://www.skidmore.edu/admissions/connect/info.php', // request info

    // Academics
    'https://www.skidmore.edu/academics/', // home page
    'https://www.skidmore.edu/academics/majors.php', // majors and minors
    'https://www.skidmore.edu/registrar/datesdeadlines.php', // registrar
    'https://www.skidmore.edu/dof-vpaa/', // dean of the faculty
    'https://www.skidmore.edu/osaa/', // student academic affairs
    'https://www.skidmore.edu/academic_services/', // accessibility services
    'https://www.skidmore.edu/dof-vpaa/summer-research/', // research
    'https://www.skidmore.edu/fye/', // fye
    'https://www.skidmore.edu/hf/', // honors program
    'https://lib.skidmore.edu/', // library
    'https://tang.skidmore.edu/', // museum
    'https://tang.skidmore.edu/about', // about the museum
    'https://www.skidmore.edu/ocse/', // ocse
    'https://www.skidmore.edu/ocse/programs/index.php', // ocse program options
    'https://www.skidmore.edu/opportunity_program/', // opporutnity program
    'https://www.skidmore.edu/precollege/', // summer pre-college
    'https://www.skidmore.edu/summersession/', // summer sessions
    'https://www.skidmore.edu/summer/', // summer institutes

    // About
    'https://www.skidmore.edu/about/', // about main page
    'https://www.skidmore.edu/president/', // leadership
    'https://www.skidmore.edu/ctm/', // creative thought matters
    'https://www.skidmore.edu/360/', // skidmore 360
    'https://www.skidmore.edu/diversity/index.php', // diversity and inclusion
    'https://www.skidmore.edu/about/rankings/', // rankings and awards
    'https://www.skidmore.edu/sustainability/index.php', // sustainability
    'https://www.skidmore.edu/surrey/', // inn
    'https://www.skidmore.edu/zankel/', // zankel
    'https://www.skidmore.edu/about/contacts.php', // contact
    'https://www.skidmore.edu/sgbm/', // title ix
    'https://www.skidmore.edu/hr/', // human resources
    'https://www.skidmore.edu/diningservice/index.php', // dining services

    // Transportation
    'https://www.cdta.org/schedules-route-detail?route_id=452', // cdta
    'https://www.cdta.org/node/182#skidmore', // schedule and route

    // Visit Campus
    'https://www.skidmore.edu/admissions/visit/index.php', // ways to visit
    'https://www.skidmore.edu/admissions/visit/int-tour.php', // video tour

    // IT
    'https://www.skidmore.edu/it/index.php', // main page
    'https://www.skidmore.edu/it/about/index.php#mission', // mission
    'https://www.skidmore.edu/it/start.php', // getting started
    'https://www.skidmore.edu/it/policies/index.php', // policies
    'https://www.skidmore.edu/it/accounts/index.php', // accounts
    'https://www.skidmore.edu/it/computingandprinting/index.php', // printing
    'https://www.skidmore.edu/it/email/index.php', // email
    'https://leds.domains.skidmore.edu/zoom/', // zoom
    'https://www.skidmore.edu/it/enterpriseapps/index.php', // enterprise apps
    'https://www.skidmore.edu/it/Infrastructure/', // infastructure
    'https://leds.domains.skidmore.edu/', // leds
    'https://www.skidmore.edu/it/mediaservices/index.php', // media services

    // Wikipedia
    'https://en.wikipedia.org/wiki/Skidmore_College', // main page
]

// Connect to our database
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE })

// Split into chunks
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512, // num of characters in chunk
    chunkOverlap: 100 // overlapping characters between chunksSimilarityMetric
})

// Create a collection called skid-chat
const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536, // has to match dimension for embeddings method in text-embedding-3-small
            metric: similarityMetric
        }
    })
    console.log(res)
}

// Creating a function that gets the URLs from above and turns into vector embeddings
const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    let successCount = 0
    let failCount = 0
    
    for await ( const url of skidData) {
        try {
            console.log(`Processing: ${url}`)
            const content = await scrapePage(url)
            const chunks = await splitter.splitText(content)
            
            for await ( const chunk of chunks ) {
                const embedding = await openai.embeddings.create({
                    model: "text-embedding-3-small",
                    input: chunk,
                    encoding_format: "float"
                })

                const vector = embedding.data[0].embedding
                const res = await collection.insertOne({
                    $vector: vector, 
                    text: chunk
                })
            }
            successCount++
            console.log(`Successfully processed: ${url}`)
        } catch (error) {
            failCount++
            console.error(`Failed to process ${url}:`, error.message)
        }
    }
    
    console.log(`\nSummary: ${successCount} successful, ${failCount} failed`)
}

// Define scrape function w/ puppeteer
const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: { // Can launch the browser in headless mode
            headless: true
        },
        gotoOptions: { // Waits until the domcontent loads
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => { // Can evaluate the javascript code on the page
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return ( await loader.scrape())?.replace(/<[^>]*>?/gm, '') // Of these exist, we can replace with nothing
}

// Create collection
createCollection().then(() => loadSampleData())