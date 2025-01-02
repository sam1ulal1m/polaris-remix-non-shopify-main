import { createContext, useContext, useState, useEffect } from 'react';
import { useLoaderData, redirect } from 'remix';
import * as cookie from 'cookie';

interface User {
  id: string;
  name: string;
  // Add other user properties here
}

const AuthContext = createContext<
  | { user: User | null }
  | { user: null; loading: boolean }
>();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const requestHeaders = useLoaderData();
        const cookies = cookie.parse(requestHeaders.get('Cookie') || '');
        const token = cookies.token;

        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData: User = await response.json();
            setUser(userData);
          } else {
            // Handle token invalidation (e.g., clear cookies)
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
          }
        } else {
          // Redirect to login if no token is found
          throw redirect('/account/login');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      } finally {
        setLoading(false); 
      }
    };

    checkToken();
  }, []);
  return (
      // @ts-ignore
    <AuthContext.Provider value={{ user, loading }}>
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