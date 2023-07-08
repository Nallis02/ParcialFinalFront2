import { EstadoCita } from "../features/quote/citaSlice";
import CitasReducer, {
  limpiar,
  obtenerCitaAsync,
} from "../features/quote/citaSlice";
import { ESTADO_FETCH } from "../features/quote/constants";
import { ICita } from "../features/quote/types";

describe("reducer", () => {
  const initialState: EstadoCita = {
    data: null,
    estado: ESTADO_FETCH.INACTIVO,
  };

  const cita: ICita = {
    cita: "Shut up, brain. I got friends now. I don't need you anymore.",
    personaje: "Lisa Simpson",
    imagen:
      "https://cdn.glitch.com/3c3ffadc-3406-4440-bb95-d40ec8fcde72%2FLisaSimpson.png?1497567511084",
    direccionPersonaje: "Right",
  };

  describe("as default", () => {
    it("Debería devolver el estado inicial null", () => {
      const estadoActual = CitasReducer(initialState, { type: "any" });
      expect(estadoActual).toEqual(initialState);
    });
  });

  describe("pending", () => {
    it("Debería mostrar el estado de carga", () => {
      const mockState: EstadoCita = {
        data: null,
        estado: ESTADO_FETCH.CARGANDO,
      };

      const estadoActual = CitasReducer(mockState, obtenerCitaAsync.pending);
      expect(estadoActual.estado).toEqual(ESTADO_FETCH.CARGANDO);
      expect(estadoActual.data).toBeNull();
    });
  });

  describe("Quote displayed", () => {
    it("Debería devolver una cita", () => {
      const estadoActual = CitasReducer(initialState, {
        type: obtenerCitaAsync.fulfilled,
        payload: cita,
      });
      const citaActual = estadoActual?.data;
      expect(citaActual?.personaje).toBe("Lisa Simpson");
    });
  });

  describe("Error", () => {
    it("Devuelve error", () => {
      const mockState: EstadoCita = {
        data: null,
        estado: ESTADO_FETCH.ERROR,
      };
      const estadoActual = CitasReducer(mockState, obtenerCitaAsync.rejected);
      expect(estadoActual.estado).toBe(ESTADO_FETCH.ERROR);
    });
  });

  describe("limpiar", () => {
    it("Vuelve al estado inicial", () => {
      const mockState: EstadoCita = {
        data: cita,
        estado: ESTADO_FETCH.INACTIVO,
      };
      const estadoActual = CitasReducer(mockState, limpiar());
      expect(estadoActual.data).toBeNull();
    });
  });
});
