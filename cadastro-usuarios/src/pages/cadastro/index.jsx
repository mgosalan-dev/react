import "./style.css";

function cadastro() {
  const user = [
    {
      id: "test",
      name: "test",
      email: "test@gmail.com",
      age: "27",
    },
    {
      id: "test2",
      name: "test2",
      email: "test2@gmail.com",
      age: "28",
    },
    {
      id: "test3",
      name: "test3",
      email: "test3@gmail.com",
      age: "29",
    },
  ];

  return (
    <div className="login-container">
      <form>
        <h1>Cadastro</h1>
        <input type="text" name="name" placeholder="nome" />
        <input type="text" name="email" placeholder="email" />
        <input type="number" name="age" placeholder="idade" />
        <button type="button">Cadastrar</button>
      </form>
      {user.map((user) => (
        <div key={user.id} className="card">
          <p>Nome: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Idade: {user.age}</p>
        </div>
      ))}
    </div>
  );
}

export default cadastro;
