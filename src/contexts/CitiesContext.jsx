import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useCallback,
} from "react";

const BASE_URL = "http://localhost:8000";

const citiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "cities/loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        if (!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: error.message });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (!id || +id === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        if (!response.ok) throw new Error("Something went wrong");
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: error.message });
      }
    },
    [currentCity.id]
  );

  async function createCity(city) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      if (!response.ok) throw new Error("Something went wrong");
      const data = await response.json();
      dispatch({ type: "cities/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error("That was not possible to delete the city");

      dispatch({ type: "cities/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  return (
    <citiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
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
