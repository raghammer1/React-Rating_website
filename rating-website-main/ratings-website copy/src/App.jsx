import './App.css';
import MoviePage from './components/MoviePage';
import MovieSearch from './components/MovieSearch';
import MovieTiles from './components/MovieTiles';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import WatchlistPage from './components/WatchlistPage';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index element={<MovieTiles />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<MovieTiles />} />
          <Route path="/home/:pageNum" element={<MovieTiles />} />
          <Route path="/search/:query" element={<MovieTiles />} />
          <Route path="/search/" element={<MovieTiles />} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
