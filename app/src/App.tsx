import React, { useEffect, useState } from "react";
import "./App.css";
import SankeyChart from "./SankeyChart";
import csvtojson from "csvtojson";
import { transform } from "./domain/Transformer";
import { DAG } from "./domain/interfaces";
import { getDataUrl } from "./domain/Api";

function App() {
  const [data, setData] = useState<DAG>();

  useEffect(() => {
    (async () => {
      const res = await fetch(getDataUrl());
      setData(transform(await csvtojson().fromString(await res.text())));
    })();
  }, []);

  return <div className="App">{data && <SankeyChart data={data} />}</div>;
}

export default App;
