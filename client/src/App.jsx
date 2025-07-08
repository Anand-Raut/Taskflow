import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import EmailVerify from "./pages/EmailVerify"

const App =() =>{
  return(
    <div>
      <Routes>
        <Route path='/' element= { <Home/> } />
        <Route path='/login' element= { <Login/> } />
        <Route path='/email-verify' element= { <EmailVerify/> } />
      </Routes>
    </div>
  )
}

export default App