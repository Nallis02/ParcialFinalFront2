import { obtenerNoticias } from "./fakeRest";
import { INoticias } from './fakeRest'

export const fetchNoticias = async (): Promise<INoticias[]> => {
  try {
    const noticias = await obtenerNoticias();
    return noticias;
  } catch (error) {
    console.error("Error al obtener las noticias:", error);
    throw error;
  }
};
