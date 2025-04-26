"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { isTokenExpired } from "../utils/utils"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [agent, setAgent] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for token on initial load
        const token = localStorage.getItem("token")
        const userType = localStorage.getItem("userType")

        if (token && userType === "agent" && !isTokenExpired(token)) {
            // Load agent data from localStorage
            const storedAgent = localStorage.getItem("agentData")
            if (storedAgent) {
                setAgent(JSON.parse(storedAgent))
                setIsAuthenticated(true)
            }
        }

        setLoading(false)
    }, [])

    const login = (agentData, token) => {
        setAgent(agentData)
        setIsAuthenticated(true)

        // Store in localStorage for persistence
        localStorage.setItem("token", token)
        localStorage.setItem("userType", "agent")
        localStorage.setItem("agentData", JSON.stringify(agentData))
    }

    const logout = () => {
        setAgent(null)
        setIsAuthenticated(false)

        // Clear localStorage
        localStorage.removeItem("token")
        localStorage.removeItem("userType")
        localStorage.removeItem("agentData")
        localStorage.removeItem("userAvatar")
    }

    return (
        <AuthContext.Provider
            value={{
                agent,
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
