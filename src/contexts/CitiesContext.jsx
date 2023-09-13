import { createContext, useState, useEffect, useContext } from "react";

const BASE_URL = "http://localhost:8000";

const citiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        if (!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();
      setCurrentCity(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <citiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </citiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(citiesContext);
  if (!context)
    throw new Error("CitiesContext must be used within a CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
