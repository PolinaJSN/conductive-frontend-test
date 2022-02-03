import React, { useEffect, useState } from "react";
import "./App.css";
import SankeyChart from "./SankeyChart";
import csvtojson from "csvtojson";
import { transform } from "./domain/Transformer";
import { DAG } from "./domain/interfaces";

function App() {
  const [data, setData] = useState<DAG>();

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `quidd-bsc-transfers-0x7961Ade0a767c0E5B67Dd1a1F78ba44F727642Ed.csv`
      );
      setData(transform(await csvtojson().fromString(await res.text())));
    })();
  }, []);

  return <div className="App">{data && <SankeyChart data={data} />}</div>;
}

export default App;
