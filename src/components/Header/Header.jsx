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
                    {isOpen ? (
                        <>
                            <li>
                                <button onClick={() => setPage('Search')}>
                                    Search
                                </button>
                            </li>
                            <li>
                                <button onClick={() => setPage('Playlists')}>
                                    Playlists
                                </button>
                            </li>
                            <li>
                                <button id='logInButton'>Log Out</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <a href='#'>
                                    <img
                                        src='src/assets/searchIcon.svg'
                                        alt='Search'
                                    />
                                </a>
                            </li>
                            <li>
                                <a href='#'>
                                    <img
                                        src='src/assets/playlistIcon.svg'
                                        alt='Browse'
                                    />
                                </a>
                            </li>
                            <button id='logInButton'>
                                <img
                                    id='logoutIcon'
                                    src='src/assets/logoutIcon.svg'
                                    alt='Log Out'
                                />
                            </button>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;
