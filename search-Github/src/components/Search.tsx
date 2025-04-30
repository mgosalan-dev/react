/**
 * Search Component
 * 
 * Componente responsável pela interface de busca de usuários do GitHub.
 * Apresenta um formulário estilizado com tema de RPG/aventura.
 */

import { useState } from "react";

// Ícones
import { BsSearch } from "react-icons/bs";
import { GiScrollUnfurled } from "react-icons/gi";

// Estilos
import classes from './Search.module.css';

/**
 * Tipagem das props do componente
 */
type SearchProps = {
  loadUser: (userName: string) => Promise<void>
}

/**
 * Componente de busca de usuários
 * 
 * @param {SearchProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const Search = ({ loadUser }: SearchProps) => {
  // Estado para armazenar o nome de usuário digitado
  const [userName, setUserName] = useState("");
  
  /**
   * Função que lida com o envio do formulário
   * 
   * @param {React.FormEvent} e - Evento de formulário
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Só chama a função de carregamento se houver um nome de usuário
    if (userName) {
      loadUser(userName);
    }
  };

  return (
    <div className={classes.container}>
      {/* Cabeçalho da missão */}
      <div className={classes.guildhud}>
        Missão de Busca
      </div>
      
      {/* Container principal com estilo de pergaminho */}
      <div className={`${classes.search} ${classes.pergaminho}`}>
        <h2>
          {/* Ícone de pergaminho à esquerda */}
          <GiScrollUnfurled style={{ marginRight: "8px", verticalAlign: "middle" }} />
          Busque Por um usuário
          {/* Ícone de pergaminho espelhado à direita */}
          <GiScrollUnfurled style={{ marginLeft: "8px", verticalAlign: "middle", transform: "scaleX(-1)" }} />
        </h2>
        <p>Conheça os melhores repositórios e revele os segredos dos códigos ancestrais</p>
      
        {/* Formulário de busca */}
        <form className={classes.search_container} onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Digite o nome do aventureiro" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)} 
          />
          <button type="submit" aria-label="Buscar usuário">
            <BsSearch />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;