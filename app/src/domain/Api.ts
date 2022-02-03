export const getDataUrl = (): string => {
  const DATA_URL: string = process.env.REACT_APP_DATA_URL || "";

  if (DATA_URL === "") {
    throw new Error("REACT_APP_DATA_URL env variable should be specified");
  }

  return process.env.PUBLIC_URL + "/" + DATA_URL;
};
