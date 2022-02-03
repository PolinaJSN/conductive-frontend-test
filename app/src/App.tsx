import React, { useEffect, useState } from "react";
import "./App.css";
import SankeyChart from "./SankeyChart";
import { DAG } from "./domain/interfaces";
import { fetchData } from "./domain/Api";

function App() {
  const [data, setData] = useState<DAG>();

  useEffect(() => {
    (async () => {
      setData(await fetchData());
    })();
  }, []);

  return <div className="App">{data && <SankeyChart data={data} />}</div>;
}

export default App;
