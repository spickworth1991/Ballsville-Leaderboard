import '../styles/globals.css';
import { LeaderboardProvider } from '../context/LeaderboardContext';

function MyApp({ Component, pageProps }) {
  return (
    <LeaderboardProvider>
      <Component {...pageProps} />
    </LeaderboardProvider>
  );
}

export default MyApp;
