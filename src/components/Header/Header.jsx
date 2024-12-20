import './Header.css';
import { useState } from 'react';
import Player from '../Player/Player';

function Header({
    setPage,
    player,
    setIsPlaying,
    isPlaying,
    displayItem,
    handleLogOut,
}) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <header className={isOpen ? 'leftNav' : 'leftNavNarrow'}>
            <button
                className='menuButton'
                onClick={toggleMenu}
            >
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
            <nav>
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
                        <button
                            id='logInButton'
                            onClick={handleLogOut}
                        >
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

            <Player
                isOpen={isOpen}
                player={player}
                displayItem={displayItem}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
            />
        </header>
    );
}

export default Header;
