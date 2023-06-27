import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { Boton, Input, AutorCita, ContenedorCita, TextoCita } from "./styled";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  obtenerCitaDelEstado,
  limpiar,
  obtenerEstadoDelPedido,
  obtenerCitaDeLaAPI,
} from "./citaSlice";
import { obtenerMensaje } from "./utils";


function Cita() {
  const [valorInput, setValorInput] = useState("");
  const { cita = "", personaje = "" } =
    useAppSelector(obtenerCitaDelEstado, shallowEqual) || {};
  const estadoPedido = useAppSelector(obtenerEstadoDelPedido);
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (valorInput) {
      dispatch(obtenerCitaDeLaAPI(valorInput));
    }
  }, [valorInput, dispatch]);

  const onClickObtenerCita = () => {
    if (!valorInput) {
      dispatch(obtenerCitaDeLaAPI(valorInput));
      return;
    }
  
    try {
      if (!isNaN(Number(valorInput))) {
        throw new Error("El nombre debe ser un texto");
      }
  
      dispatch(obtenerCitaDeLaAPI(valorInput));
    } catch (e) {
      setError(error);
    }
  };
  
  
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValorInput(inputValue);

    if (inputValue && !isNaN(Number(inputValue))) {
      setError("El nombre debe ser un texto");
    } else {
      setError("");
    }
  };
  const onClickBorrar = () => {
    dispatch(limpiar());
    setValorInput("");
  };

  return (
    <ContenedorCita>
      <TextoCita>{error ? error : obtenerMensaje(cita, estadoPedido)}</TextoCita>
      <AutorCita>{personaje}</AutorCita>
      <Input
        aria-label="Author Cita"
        value={valorInput}
        onChange={onChangeInput}
        placeholder="Ingresa el nombre del autor"
      />
      <Boton
        aria-label={valorInput ? "Obtener Cita" : "Obtener cita aleatoria"}
        onClick={onClickObtenerCita}
      >
        {valorInput ? "Obtener Cita" : "Obtener cita aleatoria"}
      </Boton>
      <Boton aria-label="Borrar" onClick={onClickBorrar} secondary={true}>
        Borrar
      </Boton>
    </ContenedorCita>
  );
}
export default Cita;
