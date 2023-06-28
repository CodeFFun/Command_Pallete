import SearchBar from './components/SearchBar'
import { useState } from 'react'
import CommandPallete from './components/CommandPallete'

function App() {
  // window event inorder to open and lose the command pallete
  const windowEvent = () => {
    window.addEventListener('keydown', (e) => {
      if (e.key.toLocaleLowerCase() === 'k' && e.ctrlKey) {
        e.preventDefault()
        setShowPallete(true)
      }
      if (e.key.toLowerCase() === 'escape') {
        e.preventDefault()
        setShowPallete(false)
      }
    })
  }

  const [showPallete, setShowPallete] = useState(false) //state to trigger command pallete

  windowEvent() //call event

  //onclick event on app to close comman pallete
  const onClick = (e) => {
    if (e.target.className === 'App') {
      setShowPallete(false)
    }
  }
  return (
    <div className='App' onClick={onClick}>
      {
        showPallete ? <CommandPallete /> : <SearchBar /> //condition to trigger command pallete the showpallete is state from above
      }
    </div>
  )
}

export default App
