/**
 * Home Component
 * 
 * Componente principal responsável pela busca e exibição de perfis de usuários do GitHub.
 * Gerencia estados de carregamento, erros e dados do usuário.
 */

import { useState } from "react";

// Importação de tipos e componentes
import { UserProps } from "../types/export";
import Search from "../components/Search";
import User from "../components/User";


import classes from "./Home.module.css";

/**
 * Home Component
 * 
 * @returns {JSX.Element} Componente renderizado
 */
function Home() {
  // Estados do componente
  const [user, setUser] = useState<UserProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Busca os dados de um usuário no GitHub pela API
   * 
   * @param {string} userName - Nome de usuário a ser buscado
   */
  const loadUser = async (userName: string) => {
    // Reseta o estado de erro e ativa o loading
    setError(null);
    setIsLoading(true);
    
    try {
      // Faz a requisição para a API do GitHub
      const res = await fetch(`https://api.github.com/users/${userName}`);
      
      // Verifica se a resposta foi bem sucedida
      if (!res.ok) {
        throw new Error("Aventureiro não encontrado! Tente outro nome.");
      }
      
      // Converte o resultado para JSON e extrai os dados necessários
      const data = await res.json();
      const { avatar_url, login, location, followers, following } = data;

      // Cria o objeto de usuário com os dados necessários
      const userData: UserProps = {
        avatar_url,
        login,
        location,
        followers,
        following,
      };
      
      // Atualiza o estado com os dados do usuário
      setUser(userData);
      setError(null);
    } catch (error) {
      // Tratamento de erros
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocorreu um erro ao buscar o aventureiro.");
      }
      setUser(null);
    } finally {
      // Finaliza o estado de loading independente do resultado
      setIsLoading(false);
    }
  };

  /**
   * Reseta os estados de usuário e erro
   */
  const resetUser = () => {
    setUser(null);
    setError(null);
  };

  return (
    <div className={classes.home_container}>
      {/* Exibe o componente de busca apenas se não houver um usuário carregado */}
      {!user && <Search loadUser={loadUser} />}
      
      {/* Exibe mensagem de carregamento quando isLoading for true */}
      {isLoading && (
        <div className={classes.loading}>
          Buscando aventureiro...
        </div>
      )}
      
      {/* Exibe mensagem de erro quando houver erro */}
      {error && (
        <div className={classes.error}>
          <p>{error}</p>
          <button onClick={resetUser} className={classes.try_again}>
            Tentar novamente
          </button>
        </div>
      )}
      
      {/* Exibe os dados do usuário quando estiver disponível */}
      {user && <User {...user} resetUser={resetUser} />}
    </div>
  );
}

export default Home;