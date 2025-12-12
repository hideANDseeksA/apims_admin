import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CommonDataContext = createContext(null);

export function CommonDataProvider({ children }) {
  const [workstations, setWorkstations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [items, setItems] = useState([]);
  const [subtitute_items, setSubtitute_Items] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wsRes, posRes, itemsRes, subItems] = await Promise.all([
        axios.get(`${API_URL}/workstation/all`),
        axios.get(`${API_URL}/position/all`),
        axios.get(`${API_URL}/ItemTable/available_items`),
        axios.get(`${API_URL}/ItemTable/subtitute_items`),
      ]);

      setWorkstations(wsRes.data);
      setPositions(posRes.data);
      setItems(itemsRes.data);
      setSubtitute_Items(subItems.data);
    } catch (err) {
      console.error("Error loading common data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <CommonDataContext.Provider
      value={{
        workstations,
        positions,
        items,
        subtitute_items,
        loading,
        refresh: fetchData,
      }}
    >
      {children}
    </CommonDataContext.Provider>
  );
}

export function useCommonData() {
  return useContext(CommonDataContext);
}
