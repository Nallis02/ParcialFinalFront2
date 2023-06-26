import { rest } from "msw";
import { API_URL } from "../app/constants";
import { quote, quoteLisa } from "./quotes.mocks";

const handlers = [
  rest.get(`${API_URL}`, (req, res, ctx) => {
    if (req.url.searchParams.get("character") === "lisa") {
      return res(ctx.status(200), ctx.json(quoteLisa));
    }
    return res(ctx.status(200), ctx.json(quote));
  }),
];

export default handlers;
