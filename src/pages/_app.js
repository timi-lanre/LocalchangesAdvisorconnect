// src/pages/_app.js
import '../styles/globals.css';
import { SessionProvider } from '../components/SessionProvider';
import { authService } from '../services/auth';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize auth state listener for automatic sign-in tracking
    authService.initializeAuthTracking();
    
    // Check for existing session and update last sign-in
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Update last sign-in for existing session
          await supabase
            .from('user_profiles')
            .update({ last_sign_in_at: new Date().toISOString() })
            .eq('user_id', session.user.id);
        }
      } catch (error) {
        console.warn('Could not update session timestamp:', error);
      }
    };
    
    checkExistingSession();
  }, []);

  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}