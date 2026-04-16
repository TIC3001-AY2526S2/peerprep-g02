import './App.css';
import LandingPage from "./page/LandingPage";
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <LandingPage />
    </UserProvider>
  );
}

export default App;
