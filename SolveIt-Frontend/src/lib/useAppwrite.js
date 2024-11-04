import { useEffect, useState } from "react";

// Define um hook personalizado que aceita uma função como argumento
const useAppwrite = (fn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Executa a função 'fn' recebida como argumento para obter os dados
      const res = await fn();
      // Armazena os dados recebidos no estado 'data'
      setData(res);
    } catch (error) {
      console.log("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Executa a função 'fetchData' apenas uma vez, quando o componente é montado
  useEffect(() => {
    fetchData();
  }, []); // O array vazio garante que a função seja chamada apenas uma vez

  // Função que permite ao componente pai chamar a busca de dados manualmente
  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
