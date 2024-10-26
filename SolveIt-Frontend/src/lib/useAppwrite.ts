import { Alert } from "react-native";
import { useEffect, useState } from "react";

// Definindo um tipo genérico para a função que será passada como argumento
type FetchFunction<T> = () => Promise<T[]>;

const useAppwrite = <T>(fn: FetchFunction<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fn(); // Espera um array de tipo T
      setData(res); // Aqui res deve ser do tipo T[]
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
};

export default useAppwrite;
