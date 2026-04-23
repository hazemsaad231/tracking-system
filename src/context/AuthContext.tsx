import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'


interface User {
  name: string
  email: string
  phone?: string
  role: 'admin' | 'client'
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user')
    console.log("Initializing AuthContext. Saved User:", savedUser) // ✅ تحقق من البيانات المخزنة في localStorage
    if (!savedUser) return null
    try {
      return JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const isAdmin = () => user?.role === 'admin'

  console.log("AuthContext Rendered. Current User:", user)
  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
