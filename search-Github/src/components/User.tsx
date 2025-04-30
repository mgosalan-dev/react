/**
 * User Component
 * 
 * Componente responsável por exibir os detalhes do usuário do GitHub
 * com estilização temática de RPG/aventura.
 */

// Importações
import { Link } from "react-router-dom";

// Tipos
import { UserProps } from "../types/export";

// Ícones
import { MdLocationPin } from "react-icons/md";
import { GiSpellBook, GiReturnArrow } from "react-icons/gi";

// Estilos
import classes from "./User.module.css";

/**
 * Tipagem estendida para incluir função de reset
 */
type UserPropsWithReset = UserProps & {
  resetUser?: () => void;
};

/**
 * Componente de exibição de dados do usuário
 * 
 * @param {UserPropsWithReset} props - Props do usuário com função de reset opcional
 * @returns {JSX.Element} Componente renderizado
 */
const User = ({
  login,
  avatar_url,
  followers,
  following,
  location,
  resetUser,
}: UserPropsWithReset) => {
  
  return (
    <div className={`${classes.user_container} ${classes.pergaminho}`}>
      {/* Banner de título */}
      <div className={classes.banner}>Aventureiro Encontrado</div>
      
      {/* Avatar e nome do usuário */}
      <img src={avatar_url} alt={login} className={classes.user_avatar} />
      <h2 className={classes.user_name}>{login}</h2>
      
      {/* Exibe localização apenas se estiver disponível */}
      {location && (
        <p className={classes.location}>
          <MdLocationPin />
          <span>{location}</span>
        </p>
      )}
      
      {/* Container de estatísticas */}
      <div className={classes.stats_container}>
        <div className={classes.stat_box}>
          <p className={classes.stat_label}>Seguidores</p>
          <p className={classes.stat_value}>{followers}</p>
        </div>
        <div className={classes.stat_box}>
          <p className={classes.stat_label}>Seguindo</p>
          <p className={classes.stat_value}>{following}</p>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div>
        {/* Renderização condicional do botão de voltar */}
        {resetUser && (
          <button 
            className={classes.back_button} 
            onClick={resetUser}
          >
            <GiReturnArrow style={{ marginRight: "5px" }} /> Voltar à Busca
          </button>
        )}
        
        {/* Link para os repositórios do usuário */}
        <Link to={`https://github.com/${login}?tab=repositories`} className={classes.repo_link}>
          <GiSpellBook style={{ marginRight: "5px" }} /> Ver Trabalhos
        </Link>
      </div>
    </div>
  );
};

export default User;