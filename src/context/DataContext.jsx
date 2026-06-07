import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { getToken } = useUser();
  const [referenceData, setReferenceData] = useState({
    countries: [],
    currencies: [],
    shipmentStatuses: [],
    containerTypes: [],
    ports: [],
    suppliers: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReferenceData = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_BASE_API;
      
      const [countries, currencies, statuses] = await Promise.all([
        fetch(`${baseUrl}/reference/countries/`, {
          headers: { Authorization: `Token ${token}` },
        }).then(r => r.ok ? r.json() : []),
        fetch(`${baseUrl}/reference/currencies/`, {
          headers: { Authorization: `Token ${token}` },
        }).then(r => r.ok ? r.json() : []),
        fetch(`${baseUrl}/reference/shipment-statuses/`, {
          headers: { Authorization: `Token ${token}` },
        }).then(r => r.ok ? r.json() : []),
      ]);

      setReferenceData(prev => ({
        ...prev,
        countries: countries.results || countries || [],
        currencies: currencies.results || currencies || [],
        shipmentStatuses: statuses.results || statuses || [],
      }));
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch reference data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferenceData();
  }, []);

  return (
    <DataContext.Provider value={{ referenceData, loading, error, refetch: fetchReferenceData }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
