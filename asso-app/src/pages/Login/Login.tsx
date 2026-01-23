import { useMsal } from "@azure/msal-react"
import { loginRequest } from "@src/authConfig"
import style from './Login.module.css'
import Office from '@assets/Office365.png'

const Login = () => {
  const { instance } = useMsal()

  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
  }


  return <div className={style.LoginMainContainer} >
      <img src={Office} alt="Office365" />
      <button onClick={handleLogin} >Se connecter avec un compte EPITECH</button>
  </div>
}


export default Login;