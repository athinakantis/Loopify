import './Header.css';
import { useState } from 'react';

function Header({ setPage }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <header className={isOpen ? 'leftNav' : 'leftNavNarrow'}>
            <nav>
                <button className='menuButton' onClick={toggleMenu}>
                    <img
                        className={isOpen ? 'visible' : 'invisible'}
                        id='logo'
                        src='src/assets/loopifyLogo_dark.svg'
                        alt='Loopify Logo'
                    />
                    <img
                        className={isOpen ? 'invisible' : 'visible'}
                        id='menuIcon'
                        src='src/assets/menuIcon.svg'
                        alt='Menu Icon'
                    />
                </button>
                <ul className='menu'>
                    <li>
                        <button onClick={() => setPage('Search')}>
                            {isOpen ? (
                                'Search'
                            ) : (
                                <img
                                    src='src/assets/searchIcon.svg'
                                    alt='Search'
                                />
                            )}
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setPage('Playlists')}>
                            {isOpen ? (
                                'Playlists'
                            ) : (
                                <img
                                    src='src/assets/playlistIcon.svg'
                                    alt='Browse'
                                />
                            )}
                        </button>
                    </li>
                    <li>
                        <button id='logInButton'>
                            {isOpen ? (
                                'Log Out'
                            ) : (
                                <img
                                    id='logoutIcon'
                                    src='src/assets/logoutIcon.svg'
                                    alt='Log Out'
                                />
                            )}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
