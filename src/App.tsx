import { Outlet } from 'react-router-dom'
import classes from "./App.module.css"

function App() {
  
  return (
    <>
      <div className={classes.app}>
        <h1>Busca no Github</h1>
      </div>
      <Outlet/>
    </>
  )
}

export default App
