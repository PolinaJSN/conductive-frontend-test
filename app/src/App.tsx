import React, {useEffect, useState} from 'react';
import './App.css';
import SankeyChart from './SankeyChart';
import c from 'csvtojson';
import Transformer from './Transformer';
import { DAG } from './domain/interfaces';

function App() {
  const [data, setData] = useState<DAG>();

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `quidd-bsc-transfers-0x7961Ade0a767c0E5B67Dd1a1F78ba44F727642Ed.csv`
      );
      const data = await c().fromString(await res.text());
      setData(Transformer.transform(data));
    })()
  }, [])
  
  return (
    <div className="App">
      {data && <SankeyChart data={data}/>}
    </div>
  );
}

export default App;
