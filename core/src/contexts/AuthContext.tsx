'use client'
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useSupabaseClient } from '../hooks/useSupabaseClient'
import { IUserProfile } from '../types/user'

interface IAuthContext {
    user: User | null
    session: Session | null
    profile: IUserProfile | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const supabase = useSupabaseClient()
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<IUserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        const getSession = async () => {
            const { data: { user }, error } = await supabase.auth.getUser()

            if (!isMounted) return

            if (error || !user) {
                setSession(null)
                setUser(null)
                setProfile(null)
                setLoading(false)
                return
            }

            const { data: { session } } = await supabase.auth.getSession()

            setSession(session)
            setUser(user)

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (isMounted) {
                setProfile(data)
                setLoading(false)
            }
        }

        getSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!isMounted) return

                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .single()

                    if (isMounted) {
                        setProfile(data)
                    }
                } else {
                    setProfile(null)
                }

                if (isMounted) {
                    setLoading(false)
                }
            }
        )

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [supabase])

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        setProfile(null)
    }

    const value = useMemo(
        () => ({
            user,
            session,
            profile,
            loading,
            signOut,
        }),
        [user, session, profile, loading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

AuthProvider.displayName = 'AuthProvider'

