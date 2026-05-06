import { useEffect, useState } from "react";
import Papa from "papaparse";

export function useCSV(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(path, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (res) => {
        setData(res.data);
        setLoading(false);
      }
    });
  }, [path]);

  return { data, loading };
}