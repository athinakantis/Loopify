import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';
import Header from './components/Header/Header.jsx';

function App() {
  return (
    <>
      <Header/>
      <main>
        <SearchAndDisplay placeholder='Search...' />
      </main>
    </>
  );
}

export default App;
