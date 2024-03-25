import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { loginAdmin, error, isLoading } = useLogin()
  const handleLogin = async (e) => {
    e.preventDefault();
   
    await loginAdmin(username,password)

  }
  return (
    <form className="form" onSubmit={handleLogin}>
      <h1>Login</h1>
      <label>username :</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>password :</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>Log in</button>
      {error && <div className="error">{error}</div>}

    </form>
  );
}

export default Login;