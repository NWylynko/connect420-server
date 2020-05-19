import { NODE_ENV, VERSION } from "../../env.js";
import { Request as IRequest, Response as IResponse } from "express";

export const handleVersion = async (
  req: IRequest,
  res: IResponse
): Promise<string> => {
  try {
    const response: {
      version: string;
      development?: boolean;
    } = {
      version: VERSION,
    };
    if (NODE_ENV === "development") {
      response.development = true;
    }
    res.json({ error: null, ...response });
    return "Good";
  } catch (error) {
    res.json({ error, version: "???", development: false });
    throw new Error(error);
  }
};
