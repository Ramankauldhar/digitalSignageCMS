import './App.css';
import MainPage from './pages/MainPage';
import RegisterScreen from './pages/RegisterScreen';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import {ScreenIdProvider} from './context/ScreenIdContext';

function App() {
  return (
    <ScreenIdProvider>
       <Router> {/* Wrap your app in BrowserRouter */}
          <Routes>
             {/* Define your routes here */}
             <Route path="/" element={<RegisterScreen />} />
             <Route path="/sync" element={<div>Sync Page</div>} /> {/* sync route */}
             <Route path="/main" element={<MainPage/>}/>
          </Routes>
       </Router>
    </ScreenIdProvider>
  );
}

export default App;
