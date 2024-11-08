import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/appwriteConfig';

const GlobalContext = createContext(); 
export const useGlobalContext = () => useContext(GlobalContext); 

const GlobalProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Chama a função para obter o usuário atual
        getCurrentUser()
            .then((res) => {
                if (res) {
                    // Se o usuário for encontrado, atualiza o estado
                    setIsLogged(true);
                    setUser(res);
                } else {
                    // Se não houver usuário, atualiza o estado para indicar que não está logado
                    setIsLogged(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log("Erro ao obter dados do usuario, GlobalProvider",error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []); // O efeito é executado apenas uma vez após a montagem do componente

    return (
        <GlobalContext.Provider
            value={{
                isLogged,       // Estado que indica se o usuário está logado
                setIsLogged,    // Função para atualizar o estado de login
                user,           // Informações do usuário logado
                setUser,        // Função para atualizar as informações do usuárioS
                loading         // Estado que indica se a verificação está em andamento
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;
