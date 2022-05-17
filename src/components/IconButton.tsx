import React from 'react'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

interface IconButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  options?: FontAwesomeIconProps
}

function IconButton({options, ...props}: IconButtonProps) {
  return (
    <button {...props}>
      { options && <FontAwesomeIcon className={'mr-1'} {...options}/>}
      {props.children}
    </button>
  )
}

export default IconButton