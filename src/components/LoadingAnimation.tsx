import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons'

function LoadingAnimation() {
  return (
    <div className={'w-full py-2 text-center'}>
      <FontAwesomeIcon icon={faFeatherPointed} className={'animate-scribble text-4xl text-white'} title={'Loading...'}/>
    </div>
  )
}

export default LoadingAnimation