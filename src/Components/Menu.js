import React from 'react';

const Menu = () => {

    return (
        <nav className='navbar'>
            <ul className="navbar__nav">
                <li className="navbar__item">
                    <a href="/searchLiterature" className="navbar__link">
                        <span className="navbar__text">Literature</span>
                        <i className="fas fa-book"></i>
                    </a>
                </li>

                <li className="navbar__item">
                    <a href="/searchLiterature" className="navbar__link">
                        <span className="navbar__text">Music</span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

export default Menu;
