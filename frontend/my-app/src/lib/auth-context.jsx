import { createContext, useContext, useState } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, _password, role) => {
    const mockUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name:
        role === "admin"
          ? "Admin User"
          : role === "staff"
          ? "Staff Member"
          : "Student User",
      email,
      role,
    }

    setUser(mockUser)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
