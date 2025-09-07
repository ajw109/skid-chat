# Skid-Chat: RAG-Powered Skidmore Assistant

Skid-Chat is a Next.js powered custom GPT-4 chatbot designed to answer Skidmore College-related inquiries by using Retrieval-Augmented Generation (RAG) to retrieve relevant documentation before generating responses.

## About The Project

To address the shortcomings of Large Language Models (LLMs) in terms of their lack of true semantic understanding, I implemented a retrieval-augmented generation (RAG) framework that allows an LLM to access external information, resulting in Skid-Chat - a domain-specific chatbot that significantly improves response accuracy and relevance for Skidmore-related queries.

### Key Features

- **RAG-Enhanced Responses**: Combines retrieval of relevant documents with GPT-4's generation capabilities
- **Skidmore-Specific Knowledge**: Trained on Skidmore College documentation and resources
- **Real-time Document Retrieval**: Uses vector similarity search to find relevant context
- **Modern Web Interface**: Built with Next.js and React for optimal user experience
- **Scalable Architecture**: Utilizes DataStax Astra DB for efficient vector storage and retrieval
- **Automated Content Ingestion**: Scripts for processing and indexing new documents

### Built With

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [OpenAI API](https://openai.com/api/) - GPT-4 integration
- [LangChain](https://langchain.com/) - LLM application framework
- [DataStax Astra DB](https://www.datastax.com/products/datastax-astra) - Vector database
- [Puppeteer](https://pptr.dev/) - Web scraping for content ingestion
- [AI SDK](https://sdk.vercel.ai/) - Streamlined AI integration

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js 18+ 
- npm, yarn, pnpm, or bun package manager

You'll also need API keys for:
- OpenAI API
- DataStax Astra DB

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajw109/skid-chat.git
   cd skid-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ASTRA_DB_APPLICATION_TOKEN=your_astra_db_token
   ASTRA_DB_API_ENDPOINT=your_astra_db_endpoint
   ```

4. **Seed the database** (optional - for initial setup)
   ```bash
   npm run seed
   ```

5. **Add content links** (optional - for content ingestion)
   ```bash
   npm run add-links
   ```

## Usage

### Development Server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### API Routes

The chatbot API can be accessed at [http://localhost:3000/api/chat](http://localhost:3000/api/chat). 

API routes are located in the `pages/api` directory and are mapped to `/api/*`.

### Content Management

- **Database Seeding**: Use `npm run seed` to populate the vector database with initial content
- **Link Addition**: Use `npm run add-links` to ingest new web content into the system
- **Custom Scripts**: Located in the `scripts/` directory for content management tasks

## Architecture

### RAG Pipeline

1. **Document Ingestion**: Web scraping and document processing using Puppeteer and LangChain
2. **Vectorization**: Content is embedded and stored in DataStax Astra DB
3. **Query Processing**: User queries are embedded and matched against stored vectors
4. **Context Retrieval**: Most relevant documents are retrieved based on semantic similarity
5. **Response Generation**: GPT-4 generates responses using retrieved context and user query

## Contributing

Contributions are welcome! Here's how you can help:

- **Expand Knowledge Base**: Add new Skidmore-related content and documents
- **Improve RAG Pipeline**: Optimize retrieval algorithms and embedding strategies  
- **Enhance UI**: Improve the chatbot interface
- **Performance Optimization**: Reduce response times
- **Testing**: Add comprehensive testing

### Contributing Steps

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

### Vercel Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

### Environment Variables

Ensure all environment variables are properly configured in your deployment environment:

- `OPENAI_API_KEY`
- `ASTRA_DB_APPLICATION_TOKEN` 
- `ASTRA_DB_API_ENDPOINT`

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

AJ Woods - ajwoods@skidmore.edu

Project Link: [https://github.com/ajw109/skid-chat](https://github.com/ajw109/skid-chat)

## Acknowledgments

- [OpenAI](https://openai.com/) for GPT-4 API access
- [DataStax](https://www.datastax.com/) for Astra DB vector database
- [LangChain](https://langchain.com/) for RAG framework components
- [Vercel](https://vercel.com/) for Next.js framework and deployment platform
- Skidmore College for content

## Citation

If you use this RAG framework or research findings in your work, please cite:

```bibtex
@misc{skid-chat-rag,
  title={Skid-Chat: A RAG-Powered Domain-Specific Chatbot for Investigating LLM Semantic Understanding},
  author={AJ Woods},
  year={2025},
  publisher={GitHub},
  url={https://github.com/ajw109/skid-chat}
}
```
