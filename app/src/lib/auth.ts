import { supabase } from './supabase'
import { User, Session } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata?: {
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
}

export interface AuthSession extends Session {
  user: AuthUser
}

// Authentication functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, userData?: {
    first_name?: string
    last_name?: string
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current session
  async getSession(): Promise<AuthSession | null> {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session as AuthSession | null
  },

  // Get current user
  async getUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user as AuthUser | null
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) throw error
  },

  // Update password
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    })
    
    if (error) throw error
  },

  // Update user profile
  async updateProfile(updates: {
    first_name?: string
    last_name?: string
    avatar_url?: string
  }) {
    const { error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) throw error
  }
}

// Auth state management
export const authState = {
  // Listen to auth changes
  onAuthStateChange(callback: (session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session as AuthSession | null)
    })
  }
}
