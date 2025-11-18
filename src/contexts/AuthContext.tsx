import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { strapiClient, StrapiUser } from '../lib/strapi';

type AuthContextType = {
  user: StrapiUser | null;
  client: StrapiUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const [client, setClient] = useState<StrapiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage (session persistence)
    const storedUser = localStorage.getItem('strapiUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setClient(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('strapiUser');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authenticatedUser, error } = await strapiClient.authenticateUser(email, password);
      
      if (error || !authenticatedUser) {
        return { error: new Error(error || 'Error de autenticación') };
      }

      // Store user in state and localStorage
      setUser(authenticatedUser);
      setClient(authenticatedUser);
      localStorage.setItem('strapiUser', JSON.stringify(authenticatedUser));

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setClient(null);
    localStorage.removeItem('strapiUser');
    strapiClient.clearToken(); // Clear JWT token
  };

  return (
    <AuthContext.Provider value={{ user, client, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
