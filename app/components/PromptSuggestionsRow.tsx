import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionsRow = ({ onPromptClick }) => {
    const prompts = [
        "What sports are offered?",
        "Where are the horse stables located?",
        "How can I get involved in sustainability on campus?",
        "Who is the president?"
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) =>
                <PromptSuggestionButton 
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
                />)}
        </div>
    )
}

export default PromptSuggestionsRow