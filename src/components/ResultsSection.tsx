import React from 'react'
import { faArrowTurnUp } from '@fortawesome/free-solid-svg-icons'
import IconButton from './IconButton'

export function ResultsSection(props: React.ComponentProps<any>) {
  const sectionRef = React.useRef<HTMLElement>(null)
  const [showScrollToTop, setShowScrollToTop] = React.useState(() => checkScrollable())

  function checkScrollable() {
    if (!sectionRef.current) return false
    return sectionRef.current.scrollHeight > sectionRef.current.clientHeight
  }

  function scrollToTop() {
    if (!sectionRef.current) return
    sectionRef.current.scroll({top: 0, left: 0, behavior: 'smooth'})
  }

  React.useEffect(() => {
    setShowScrollToTop(checkScrollable())
  }, [sectionRef, props.children])

  return (
    <section className={'flex flex-col gap-y-2 max-h-[48rem] overflow-y-auto overflow-x-hidden pr-1'}
             style={{'scrollbarGutter': 'stable'}}
             ref={sectionRef}
    >
      {props.children}
      {
        showScrollToTop && <IconButton type={'button'} className={'btn mx-auto bg-opacity-80 hover:bg-opacity-100 bg-yellow-200 text-black/80'} title={'Back to top'} onClick={() => scrollToTop()} options={{ icon: faArrowTurnUp }}>To Top</IconButton>
      }
    </section>
  )
}