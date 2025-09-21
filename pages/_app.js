import '../styles/globals.css'
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </>
  );
}
