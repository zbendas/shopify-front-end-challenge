import React from 'react'
import Result, { ResultInterface } from './components/Result'
import useOpenAI from './hooks/useOpenAI'
import { ResultsSection } from './components/ResultsSection'
import LoadingAnimation from './components/LoadingAnimation'
import { faPlay, faRotateLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import IconButton from './components/IconButton'

function App() {
  const { getCompletion } = useOpenAI()

  const [prompt, setPrompt] = React.useState('')
  const [author, setAuthor] = React.useState(0)
  const [length, setLength] = React.useState(0)
  const [results, setResults] = React.useState<ResultInterface[]>(() => {
    const savedResults = localStorage.getItem('results')
    if (savedResults) {
      return JSON.parse(savedResults)
    } else {
      return []
    }
  })

  const [loading, setLoading] = React.useState(false)

  const authors = React.useMemo(() => {
    let array = [
      'C. S. Lewis',
      'Charles Dickens',
      'Edgar Allan Poe',
      'Emily Dickinson',
      'J.R.R. Tolkien',
      'George R.R. Martin',
      'Stephen King',
      'Mark Twain',
      'Oscar Wilde',
      'Jane Austen',
      'William Shakespeare',
      'Zora Neale Hurston',
      'Maya Angelou',
      'Henry Wadsworth Longfellow',
      'Terry Pratchett'
    ].sort()
    array.unshift('No one in particular')
    return array
  }, [])

  const lengths = React.useMemo(() => [
    {
      label: 'Short',
      value: 64
    },
    {
      label: 'Medium',
      value: 128
    },
    {
      label: 'Long',
      value: 256
    }
  ], [])

  React.useEffect(() => {
    localStorage.setItem('results', JSON.stringify(results))
  }, [results])

  React.useEffect(() => {
    if (length === -1) setLength(0)
  }, [length])

  React.useEffect(() => {
    if (author === -1) setAuthor(0)
  }, [author])

  function handlePromptChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(event.target.value || '')
  }

  function handleAuthorChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setAuthor(Number(event.target.value) || 0)
  }

  function handleLengthChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setLength(Number(event.target.value) || 0)
  }

  function handleCopyResult(index: number) {
    setPrompt(results[index].prompt)
    setLength(lengths.findIndex(length => length.label === results[index].length))
    if (results[index].author) {
      setAuthor(authors.findIndex(author => author === results[index].author))
    } else {
      setAuthor(0)
    }
  }

  function handleDeleteResult(index: number) {
    setResults(results.filter((result, innerIndex) => index !== innerIndex))
  }

  function handleClearResults() {
    setResults([])
  }

  function clearForm() {
    setPrompt('')
    setAuthor(0)
    setLength(0)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    const authorValue = author === 0 ? undefined : authors[author]
    const lengthValue = lengths[length].value || 64
    try {
      const completion = await getCompletion(prompt, lengthValue, authorValue)
      setResults([{
        prompt: prompt,
        author: authorValue,
        length: lengths[length].label,
        // @ts-ignore
        output: completion.data.choices[0].text.trim() || '',
        timestamp: completion.data.created
      }, ...results])
      clearForm()
    } catch (error: any) { // This error is actually probably <AxiosError>, but I'll leave it this way for now
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else {
        console.log(error.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className={'min-h-screen h-screen w-1/2 mx-auto flex flex-col gap-y-2 items-center'}>
      <header className={'mr-auto'}>
        <h1 className={'text-4xl font-bold my-4'}>From The Desk Of...</h1>
      </header>
      <main className={'h-2/3 w-full grow flex flex-col gap-y-2'}>
        <section>
          <form className={'flex flex-col gap-y-2'} onSubmit={handleSubmit}>
            <div className={'flex flex-col'}>
              <label className={'font-semibold'} htmlFor={'prompt'}>Write...</label>
              <textarea className={'border border-black/25 rounded px-2'}
                        name={'prompt'} rows={10} placeholder={'a poem about a meadow'} value={prompt}
                        onChange={handlePromptChange}
              />
            </div>
            <div className={'flex justify-between'}>
              <div className={'flex gap-x-1 items-baseline'}>
                <label className={'font-semibold'} htmlFor={'author'}>In the style of</label>
                <select className={'border border-black/25 rounded px-1'} value={author}
                        onChange={handleAuthorChange}
                >
                  {
                    authors.map((author, index) =>
                      <option key={index} value={index}
                              className={'checked:font-semibold even:bg-gray-100'}
                      >
                        {author}
                      </option>
                    )
                  }
                </select>
              </div>
              <div className={'flex gap-x-1 items-baseline'}>
                <label className={'font-semibold'} htmlFor={'length'}>Maximum length:</label>
                <select className={'border border-black/25 rounded px-1'} value={length}
                        onChange={handleLengthChange}
                >
                  {
                    lengths.map((length, index) =>
                      <option key={index} value={index}>{length.label}</option>
                    )
                  }
                </select>
              </div>
            </div>
            <div className={'flex gap-x-2 w-full justify-center'}>
              <IconButton type={'button'} className={'btn text-white bg-red-400 bg-opacity-80 hover:bg-opacity-100'}
                          disabled={results.length === 0}
                          onClick={() => handleClearResults()}
                          title={'Clear results'}
                          options={{ icon: faTrashCan }}
              >
                Clear
              </IconButton>
              <IconButton type={'button'} className={'btn btn-secondary'}
                          disabled={prompt === '' && author === 0 && length === 0}
                          onClick={clearForm}
                          title={'Reset form'}
                          options={{
                            icon: faRotateLeft
                          }}
              >
                Reset
              </IconButton>
              <IconButton type={'submit'} className={'btn btn-primary'} disabled={prompt === ''} title={'Generate'}
                          options={{
                            icon: faPlay
                          }}
              >
                Generate
              </IconButton>
            </div>
          </form>
        </section>
        <ResultsSection>
          {
            loading && <LoadingAnimation/>
          }
          {
            results.map((result, index) => <Result key={index} {...result} index={index}
                                                   handleExtract={handleCopyResult} handleDelete={handleDeleteResult}/>)
          }
        </ResultsSection>
      </main>
      <footer className={'w-full px-2 text-sm text-center'}>
        <p>Created for the Shopify Front End Developer Intern Challenge (Fall 2022)</p>
      </footer>
    </div>
  )
}

export default App
