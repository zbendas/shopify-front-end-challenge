import { Configuration, OpenAIApi } from 'openai'

function useOpenAI() {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_API_KEY
  })
  const openAI = new OpenAIApi(configuration)

  const requestConfig = {
    temperature: 0.7,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  }

  function getCompletion(prompt: string, length: number, author?: string) {
    let processed_prompt = 'write ' + prompt.trim()
    if (author !== undefined) {
      processed_prompt += ` in the style of ${author}`
    }
    return openAI.createCompletion('text-curie-001', {
      ...requestConfig,
      prompt: processed_prompt,
      max_tokens: length
    })
  }

  return { openAI, getCompletion }
}


export default useOpenAI