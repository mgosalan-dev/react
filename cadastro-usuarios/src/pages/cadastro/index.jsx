import { useEffect, useState, useRef } from "react";
import "./style.css";
import api from "../../services/api";

function Cadastro() {
  const [users, setUsers] = useState([]);

  const inputusarname = useRef();
  const inputemail = useRef();
  const inputpassword = useRef();

  async function getusers() {
    const usersFromApi = await api.get("/cadastro");

    setUsers(usersFromApi.data.usuario);
  }
  async function createUsers() {
    await api.post("/cadastro", {
      username: inputusarname.current.value,
      email: inputemail.current.value,
      password: inputpassword.current.value,
    });
  }
  useEffect(() => {
    getusers();
  }, []);

  return (
    <div className="login-container">
      <form>
        <h1>Cadastro</h1>
        <input
          type="text"
          name="username"
          placeholder="username"
          ref={inputusarname}
        />
        <input type="text" name="email" placeholder="email" ref={inputemail} />
        <input
          type="text"
          name="password"
          placeholder="senha"
          ref={inputpassword}
        />
        <button type="button" onClick={createUsers}>
          Cadastrar
        </button>
      </form>
      {users.map((users) => (
        <div key={users.id} className="card">
          <p>username: {users.username}</p>
          <p>Email: {users.email}</p>
        </div>
      ))}
    </div>
  );
}

export default Cadastro;
