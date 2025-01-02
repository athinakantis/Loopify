import { useContext } from 'react';
import './Spinner.css';
import { ThemeContext } from '../../App';

function Spinner() {
  const { theme } = useContext(ThemeContext);
  return (
    <img
      className='spinner'
      src={`src/assets/spinner${
        theme === 'light' ? 'LightMode' : 'DarkMode'
      }.gif`}
      alt='Loading...'
    />
  );
}

export default Spinner;
