import { render } from "../test-utils";
import Cita from "../features/quote/Cita";
import { screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { setupServer } from "msw/lib/node";
import { mockedCitas } from "../mocks/quotes.mocks";
import { API_URL } from "../app/constants";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import {
  MENSAJE_CARGANDO,
  NOMBRE_INVALIDO,
  NO_ENCONTRADO,
} from "../features/quote/constants";

const randomQuote = mockedCitas[0].data;
const validQueries = mockedCitas.map((q) => q.query);

const handlers = [
  rest.get(`${API_URL}`, (req, res, ctx) => {
    const character = req.url.searchParams.get("character");

    if (character === null) {
      return res(ctx.json([randomQuote]), ctx.delay(150));
    }

    if (validQueries.includes(character)) {
      const quote = mockedCitas.find((quote) => quote.query === character);
      return res(ctx.json([quote?.data]));
    }

    return res(ctx.json([]), ctx.delay(150));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

const renderPorDefecto = () => {
  render(<Cita />);
};
describe("Citas", () => {
  describe("Se renderiza la pagina", () => {
    it("No debe mostrar ninguna cita", async () => {
      renderPorDefecto();
      expect(screen.queryByText(/Moe Szyslak/i)).not.toBeInTheDocument();
    });
    it("Debe mostrar el boton de borrar", () => {
      renderPorDefecto();
      expect(
        screen.getByRole("button", { name: /Borrar/i })
      ).toBeInTheDocument();
    });
    it('Debe mostrar el boton de "Obtener cita aleatoria"', () => {
      renderPorDefecto();
      expect(
        screen.getByRole("button", { name: /Obtener cita aleatoria/i })
      ).toBeInTheDocument();
    });
    it('Cuando se ingresa algo en el input el boton de "obtener cita ateatoria" debe cambiar a "Obtener Cita"', async () => {
      renderPorDefecto();
      const input = screen.getByRole("textbox", { name: "Author Cita" });
      userEvent.click(input);
      await userEvent.type(input, "Moe");
      const botonObtenerCita = await screen.findByRole("button", {
        name: /Obtener Cita/i,
      });
      expect(botonObtenerCita).toBeInTheDocument();
    });
  });
  describe("Cuando se carga una cita correcta o que existe", () => {
    it("Carga la palabra CARGANDO... antes de mostrar la cita aletoria", async () => {
      renderPorDefecto();
      const botonObtenerCita = screen.getByRole("button", {
        name: /Obtener cita aleatoria/i,
      });
      userEvent.click(botonObtenerCita);
      await waitFor(() => {
        expect(screen.getByText(MENSAJE_CARGANDO)).toBeInTheDocument();
      });
    });
    it("Muestra una cita de un personaje aleatorio", async () => {
      renderPorDefecto();
      const botonObtenerCita = screen.getByRole("button", {
        name: /Obtener cita aleatoria/i,
      });
      userEvent.click(botonObtenerCita);
      await waitFor(() => {
        expect(screen.getByText(/Moe Szyslak/i)).toBeInTheDocument();
      });
    });
    it("Cita de personaje al ingresar un nombre valido", async () => {
      renderPorDefecto();
      const input = screen.getByRole("textbox", { name: "Author Cita" });
      userEvent.click(input);
      await userEvent.type(input, "Homer");
      const botonObtenerCita = await screen.findByText(/Obtener Cita/i);
      userEvent.click(botonObtenerCita);
      await waitFor(() => {
        expect(screen.getByText(mockedCitas[1].data.quote)).toBeInTheDocument();
      });
    });
  });

  describe("Se ingresan datos incorrectos", () => {
    it("Se ingresa numeros en el input", async () => {
      renderPorDefecto();
      const input = screen.getByPlaceholderText("Ingresa el nombre del autor");
      userEvent.click(input);
      await userEvent.type(input, "1");
      const botonObtenerCita = screen.getByRole("button", {
        name: /Obtener Cita/i,
      });
      userEvent.click(botonObtenerCita);
      await waitFor(() => {
        expect(
          screen.getByText(/El nombre debe ser un texto/i)
        ).toBeInTheDocument();
      });
    });
    it("Se ingresa un personaje que no existe, en el input", async () => {
      renderPorDefecto();
      const input = screen.getByRole("textbox", { name: "Author Cita" });
      userEvent.click(input);
      await userEvent.type(input, "lissa");
      const botonObtenerCita = await screen.findByText(/Obtener Cita/i);
      userEvent.click(botonObtenerCita);
      await waitFor(() => {
        expect(screen.getByText(NOMBRE_INVALIDO)).toBeInTheDocument();
      });
    });
  });
  describe("Boton de borrar", () => {
    it("El boton borra la cita del autor que se busca y limpia el input, vuelve al estado inicial", async () => {
      renderPorDefecto();
      const botonObtenerCita = await screen.findByText(
        /Obtener cita aleatoria/i
      );
      userEvent.click(botonObtenerCita);
      const botonBorrar = await screen.findByLabelText(/Borrar/i);
      userEvent.click(botonBorrar);
      await waitFor(() => {
        expect(screen.getByText(NO_ENCONTRADO)).toBeInTheDocument();
      });
    });
  });
});
