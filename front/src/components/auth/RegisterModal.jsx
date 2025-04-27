import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import "./RegisterModal.css";

function RegisterModal({ onClose }) {
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
      getusers();
      onClose();
   }

   useEffect(() => {
      getusers();
   }, []);

   return (
      <div className="modal-overlay">
         <div className="modal-content">
            <video autoPlay loop muted className="modal-video-bg">
               <source src="/videos/bg-video.mp4" type="video/mp4" />
               Seu navegador não suporta vídeos em HTML5.
            </video>

            <button className="close-btn" onClick={onClose}>
               X
            </button>

            <form className="form-content">
               <h1>Cadastro</h1>
               <input type="text" placeholder="username" ref={inputusarname} />
               <input type="text" placeholder="email" ref={inputemail} />
               <input type="password" placeholder="senha" ref={inputpassword} />
               <button type="button" onClick={createUsers}>
                  Cadastrar
               </button>
            </form>

            <div className="user-list">
               {users.map((user) => (
                  <div key={user.id} className="card">
                     <p>username: {user.username}</p>
                     <p>email: {user.email}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export default RegisterModal;
