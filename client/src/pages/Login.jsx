import { useState } from "react"
import logo from "../assets/logo.svg"
const Login = () => {

    const [state, setState] = useState('Sign Up')

  return (
    <div className="flex items-center justify-center min-h-screen px-6 ">
      <img src= {logo} alt="logo" className="absolute left-5 sm:left-20 top-5 w-28 cursor-pointer"/>
    
        <h2>{state === 'Sign Up'? 'Create account': 'Login'}</h2>

        <p>{state === 'Sign Up'? 'Create your account': 'Login to your account'}</p>

    </div>
  )
}

export default Login
