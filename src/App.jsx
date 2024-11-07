import './App.css';
import SearchAndDisplay from './components/SearchAndDisplay/SearchAndDisplay.jsx';

function App() {
  return (
    <>
      <header>
        <img
          id='logo'
          src='src/assets/loopifyLogo_dark.svg'
          alt='Loopify Logo'
        />
      </header>
      <main>
        <SearchAndDisplay placeholder='Search...' />
      </main>
    </>
  );
}

export default App;
