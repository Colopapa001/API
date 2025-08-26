import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/Card'

function App() {
  const [count, setCount] = useState(0)

  const handleProfileClick = () => {
    alert('Navegando al perfil...')
  }

  return (
    <>
      <Card 
        userName="GitHub"
        onProfileClick={handleProfileClick}
      >
        <h3>GitHub</h3>
        <p>Descripción del usuario</p>
      </Card>
      <Card 
        userName="PerezJ"
        onProfileClick={handleProfileClick}
      >
        <h3>PerezJ</h3>
        <p>Descripción del usuario</p>
      </Card>
    </>
  )
}

export default App
