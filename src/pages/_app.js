// src/pages/_app.js
import '../styles/globals.css';
import { SessionProvider } from '../components/SessionProvider';

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}