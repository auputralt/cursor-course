"use client"
import { useState, useEffect } from 'react'
import { auth, authState, AuthSession } from '@/lib/auth'

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(session?.user || null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const initialSession = await auth.getSession()
        setSession(initialSession)
        setUser(initialSession?.user || null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = authState.onAuthStateChange((session) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData?: {
    first_name?: string
    last_name?: string
  }) => {
    setLoading(true)
    try {
      const result = await auth.signUp(email, password, userData)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await auth.signIn(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      await auth.resetPassword(email)
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (password: string) => {
    setLoading(true)
    try {
      await auth.updatePassword(password)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: {
    first_name?: string
    last_name?: string
    avatar_url?: string
  }) => {
    setLoading(true)
    try {
      await auth.updateProfile(updates)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    isAuthenticated: !!user
  }
}
