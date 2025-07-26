import '../styles/globals.css';
import { LeaderboardProvider } from '../context/LeaderboardContext';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }) {
  return (
    <LeaderboardProvider>
      <Navbar />
      <Component {...pageProps} />
    </LeaderboardProvider>
  );
}

export default MyApp;
