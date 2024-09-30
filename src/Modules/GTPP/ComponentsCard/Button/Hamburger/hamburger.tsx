import React, { HTMLAttributes, useState } from 'react';
import './Hamburger.css'; // Importando o CSS
import Modalcard from '../modalCard/modalcard';

type HamburgerProps = HTMLAttributes<HTMLDivElement> & {}

const Hamburger: React.FC<HamburgerProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='position-relativ '>
            <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu} {...props} >
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
            <div className='position-absolute' style={{zIndex: 200, top: 40, left: 250}}>
                {isOpen && <Modalcard />}
            </div>
        </div>
    );
};

export default Hamburger;
