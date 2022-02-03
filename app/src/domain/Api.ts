import csvtojson from "csvtojson";
import { DAG } from "./interfaces";
import { transform } from "./Transformer";

export const getDataUrl = (): string => {
  const DATA_URL: string = process.env.REACT_APP_DATA_URL || "";

  if (DATA_URL === "") {
    throw new Error("REACT_APP_DATA_URL env variable should be specified");
  }

  return process.env.PUBLIC_URL + "/" + DATA_URL;
};

export const fetchData = async (): Promise<DAG> => {
  const res = await fetch(getDataUrl());
  return transform(await csvtojson().fromString(await res.text()));
};
