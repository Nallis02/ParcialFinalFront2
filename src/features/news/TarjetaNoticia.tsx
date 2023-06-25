
import React from "react";
import {
  TarjetaNoticiaContainer,
  FechaTarjetaNoticia,
  DescripcionTarjetaNoticia,
  ImagenTarjetaNoticia,
  TituloTarjetaNoticia,
  BotonLectura,
} from "./styled";

export interface INoticiasNormalizadas {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: number | string;
    esPremium: boolean;
    imagen: string;
    descripcionCorta?: string;
}
interface TarjetaNoticiaProps {
  noticia: INoticiasNormalizadas;
  onVerMasClick: (noticia: INoticiasNormalizadas) => void;
}
const TarjetaNoticia: React.FC<TarjetaNoticiaProps> = ({
  noticia,
  onVerMasClick,
}) => {
  const handleVerMasClick = () => {
    onVerMasClick(noticia);
  };

  return (
    <TarjetaNoticiaContainer>
      <ImagenTarjetaNoticia src={noticia.imagen} />
      <TituloTarjetaNoticia>{noticia.titulo}</TituloTarjetaNoticia>
      <FechaTarjetaNoticia>{noticia.fecha}</FechaTarjetaNoticia>
      <DescripcionTarjetaNoticia>
        {noticia.descripcionCorta}
      </DescripcionTarjetaNoticia>
      <BotonLectura onClick={handleVerMasClick}>Ver más</BotonLectura>
    </TarjetaNoticiaContainer>
  );
};

export default TarjetaNoticia;
