import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faEyedropper, faCopy, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export interface ResultInterface {
  prompt: string
  author?: string
  length: string
  output: string
  timestamp?: number
}

interface ResultProps extends ResultInterface {
  index: number
  handleExtract: (index: number) => void
  handleDelete: (index: number) => void
}

function Result(props: ResultProps) {
  const [copied, setCopied] = React.useState(false)

  function handleCopy () {
    navigator.clipboard.writeText(props.output)
      .then(() => setCopied(true))
  }

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  return (
    <div>
      <div className={'pt-2 pb-1 px-4 rounded-t-xl bg-gray-300 border-b border-black/25'}>
        <div className={'flex items-baseline justify-between'}>
            <h2 className={'text-2xl all-small-caps font-serif'}>Result</h2>
          {
            props.timestamp && <span className={'text-xs font-sans text-gray-700'}
                                     title={'Generated at'}>{new Date(props.timestamp * 1000).toLocaleString()}</span>
          }
        </div>
        <div className={'flex items-center justify-between'}>
          <p className={'font-serif text-sm w-2/3 sm:w-auto'}>
            {props.prompt.charAt(0).toUpperCase() + props.prompt.slice(1)}
            {
              props.author
                ? (
                  <span className={'italic block sm:inline'}> in the style of <span className={'font-semibold'}>{props.author}</span></span>
                )
                : null
            }
          </p>
          <div className={'flex gap-x-1'}>
            <button type={'button'} className={''}
                    title={'Copy'}
                    onClick={() => handleCopy()}
            >
              { copied
                ? (
                  <div className={'flex gap-x-1 items-center'}>
                    <span className={'text-xs opacity-50'}>Copied!</span>
                    <FontAwesomeIcon icon={faCheckCircle} className={'text-green-600/75'}/>
                  </div>
                )
                : <FontAwesomeIcon icon={faCopy} className={'opacity-25 hover:opacity-100 hover:text-yellow-200'}/>
              }
            </button>
            <button type={'button'} className={'opacity-25 hover:opacity-100 hover:text-blue-400'}
                    title={'Extract'}
                    onClick={() => props.handleExtract(props.index)}
            >
              <FontAwesomeIcon icon={faEyedropper}/>
            </button>
            <button type={'button'} className={'opacity-25 hover:opacity-100 hover:text-red-400'}
                    title={'Delete'}
                    onClick={() => props.handleDelete(props.index)}
            >
              <FontAwesomeIcon icon={faTimesCircle}/>
            </button>
          </div>
        </div>
      </div>
      <div className={'py-2 px-4 rounded-b-xl border border-black/10 border-t-0 bg-gray-200'}>
        <p className={'whitespace-pre-line w-full'}>{props.output}</p>
      </div>
    </div>
  )
}

export default Result