import './Header.css';
import { useState } from 'react';

function Header() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={isOpen ? 'leftNav' : 'leftNavNarrow'}>
      <nav>
        <button className="menuButton" onClick={toggleMenu}>
          {isOpen ? (
            <img id="logo" src="src/assets/loopifyLogo_dark.svg" alt="Loopify Logo" />
          ) : (
            <img id="menuIcon" src="src/assets/menuIcon.svg" alt="Menu Icon" />
          )}
        </button>
        <ul className="menu">
          {isOpen ? (
            <>
              <li><a href="#">Search</a></li>
              <li><a href="#">Browse</a></li>
              <button id="logInButton">Log Out</button>
            </>
          ) : (
            <>
              <li>
                <a href="#"><img src="src/assets/searchIcon.svg" alt="Search" /></a>
              </li>
              <li>
                <a href="#"><img src="src/assets/playlistIcon.svg" alt="Browse" /></a>
              </li>
              <button id="logInButton">
                <img id="logoutIcon" src="src/assets/logoutIcon.svg" alt="Log Out" />
              </button>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;