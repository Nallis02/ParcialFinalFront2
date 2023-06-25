/*
 Utilice el principio de responsabilidad única (SRP) al separar la lógica de obtención de noticias en un archivo api.ts
y el componente de la tarjeta de noticias en TarjetaNoticia.tsx. Esto facilita la reutilización de código y el mantenimiento.
 1. En el archivo api.ts use el principio de inversión de dependencia (DIP) al extraer la lógica de obtención
    de noticias de manera independiente.
    De esta manera, el componente Noticias.tsx no depende directamente de la implementación concreta de obtenerNoticias.
 2. Se aplican buenas prácticas como el uso de key en el mapeo de las tarjetas de noticias y
    el uso de React.Fragment para envolver elementos dentro del componente TarjetaModal y reducir el código redundante.
 Listo eso fue todo.
*/

import React, { useEffect, useState } from "react";
import { fetchNoticias } from "./api";
import {
  ContenedorNoticias,
  ListaNoticias,
  TituloNoticias,
  ContenedorModal,
  TarjetaModal,
  CloseButton,
  ImagenModal,
  CotenedorTexto,
  TituloModal,
  DescripcionModal,
  BotonSuscribir,
} from "./styled";
import TarjetaNoticia from "./TarjetaNoticia";
import { SuscribeImage, CloseButton as Close } from "../../assets";
import { INoticias } from "./fakeRest";
export interface INoticiasNormalizadas {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: number | string;
  esPremium: boolean;
  imagen: string;
  descripcionCorta?: string;
}
const Noticias = () => {
  const [noticias, setNoticias] = useState<INoticiasNormalizadas[]>([]);
  const [modal, setModal] = useState<INoticiasNormalizadas | null>(null);

  useEffect(() => {
    const obtenerInformacion = async () => {
      try {
        const noticiasData = await fetchNoticias();
        const data = transformarNoticias(noticiasData);
        setNoticias(data);
      } catch (error) {
        console.error("Error al obtener las noticias:", error);
      }
    };

    obtenerInformacion();
  }, []);

  const transformarNoticias = (
    noticiasData: INoticias[]
  ): INoticiasNormalizadas[] => {
    return noticiasData.map((n) => {
      const titulo = n.titulo
        .split(" ")
        .map((str) => {
          return str.charAt(0).toUpperCase() + str.slice(1);
        })
        .join(" ");

      const ahora = new Date();
      const minutosTranscurridos = Math.floor(
        (ahora.getTime() - n.fecha.getTime()) / 60000
      );

      return {
        id: n.id,
        titulo,
        descripcion: n.descripcion,
        fecha: `Hace ${minutosTranscurridos} minutos`,
        esPremium: n.esPremium,
        imagen: n.imagen,
        descripcionCorta: n.descripcion.substring(0, 100),
      };
    });
  };

  const handleVerMasClick = (noticia: INoticiasNormalizadas) => {
    setModal(noticia);
  };

  const handleCerrarModal = () => {
    setModal(null);
  };

  const handleSuscribirClick = () => {
    setTimeout(() => {
      alert("Suscripto!");
      setModal(null);
    }, 1000);
  };

  return (
    <ContenedorNoticias>
      <TituloNoticias>Noticias de los Simpsons</TituloNoticias>
      <ListaNoticias>
        {noticias.map((n) => (
          <TarjetaNoticia
            key={n.id}
            noticia={n}
            onVerMasClick={handleVerMasClick}
          />
        ))}
        {modal && (
          <ContenedorModal>
            <TarjetaModal>
              <CloseButton onClick={handleCerrarModal}>
                <img src={Close} alt="close-button" />
              </CloseButton>
              {modal.esPremium ? (
                <React.Fragment>
                  <ImagenModal src={SuscribeImage} alt="mr-burns-excelent" />
                  <CotenedorTexto>
                    <TituloModal>Suscríbete a nuestro Newsletter</TituloModal>
                    <DescripcionModal>
                      Suscríbete a nuestro newsletter y recibe noticias de
                      nuestros personajes favoritos.
                    </DescripcionModal>
                    <BotonSuscribir onClick={handleSuscribirClick}>
                      Suscríbete
                    </BotonSuscribir>
                  </CotenedorTexto>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ImagenModal src={modal.imagen} alt="news-image" />
                  <CotenedorTexto>
                    <TituloModal>{modal.titulo}</TituloModal>
                    <DescripcionModal>{modal.descripcion}</DescripcionModal>
                  </CotenedorTexto>
                </React.Fragment>
              )}
            </TarjetaModal>
          </ContenedorModal>
        )}
      </ListaNoticias>
    </ContenedorNoticias>
  );
};

export default Noticias;
