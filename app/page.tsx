"use client"
import Image from "next/image"
import { useEffect, useRef } from "react"
import skidChatLogo from "./assets/logo.png"
import { useChat } from "ai/react"
import { Message } from "ai"
import Bubble from "./components/Bubble"
import LoadingBubble from "./components/LoadingBubble"
import PromptSuggestionsRow from "./components/PromptSuggestionsRow"

const Home = () => {
  const { append, isLoading, messages, input, handleInputChange, handleSubmit } = useChat()
  const noMessages = !messages || messages.length === 0
  
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  // Scroll to bottom whenever messages change or loading state changes
  useEffect(() => {
    if (!noMessages) {
      scrollToBottom()
    }
  }, [messages, isLoading, noMessages])

  // Give the prompt a random identifier as an ID
  // Append it to the messages coming in
  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user"
    }
    append(msg)
  }

  return (
    <main>
      <Image
        src={skidChatLogo}
        width="350"
        alt="SkidChat Logo"
        className={noMessages ? "logo-starter": "logo-chat"}
      />
      <section className={noMessages ? "" : "populated"}> {/*<If no messages, no classname, if messages, "populated"/>*/}
        {noMessages ? (
          // If no messages is true
          <>
            <p className="starter-text">
              The go to place for inquiries about Skidmore!
              Ask SkidChat about anything Skidmore-related, and
              it will come back to you with the most up-to-date answers.
              We hope you enjoy!
            </p>
            <br/>
            <PromptSuggestionsRow onPromptClick={handlePrompt}/>
          </>
        ) : (
          // If no messages is false
          <>
            {/*If messages exist*/}
            {messages.map((message, index) => <Bubble key={`message-${index}`} message={message}/>)}
            {isLoading && <LoadingBubble/>}
            {/* Invisible div at the bottom to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
        {/*Handle input, handle input change, and input, all come from useChat ai package*/}
      </section>
      <form onSubmit={handleSubmit}>
        <input className="question-box" onChange={handleInputChange} value={input} placeholder="Ask me something..."/>
        <input type="submit"/>
      </form>
    </main>
  )
}

export default Home