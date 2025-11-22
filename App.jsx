import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CodeMaker from './pages/codeMaker.jsx'
import NotesMaker from './pages/notesMaker.jsx'
import NutritionTracker from './pages/nutritionTracker.jsx'
// import Chat from './pages/chat.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/code-maker" element={<CodeMaker />} />
          <Route path='/notes-generator' element={<NotesMaker/>}></Route>
          <Route path='/nutrition-tracker' element={<NutritionTracker/>}></Route>
          {/* <Route path='chat' element={<Chat/>}></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
