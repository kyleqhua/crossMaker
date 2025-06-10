import { useState } from 'react'

import './App.css'
import { CrosswordGrid } from './cw/grid'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <CrosswordGrid size={9} />
      </div>
      <h1>Crossword Grid</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
        Kyle is a good boy.
        </p>
      </div>
    </>
  )
}

export default App
