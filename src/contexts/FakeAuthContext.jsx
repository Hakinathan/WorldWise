import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

/* FAKE AUTH */
// This is a fake authentication provider. It's not secure and it's not meant to be used in production.
// It's only meant to be used for learning purposes.
const FAKE_USER = {
  name: "Nathan",
  email: "nathan@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({
        type: "LOGIN",
        payload: {
          user: FAKE_USER,
          isAuthenticated: true,
        },
      });
    }
  }
  function logout() {
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
