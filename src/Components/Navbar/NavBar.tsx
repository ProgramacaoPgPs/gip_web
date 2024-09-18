import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { Container } from 'react-bootstrap';

type NavBarProps = {
    list?: any[],
    page?: string, 
    icon?: string,
    children?: React.ReactNode,
}

const NavBar: React.FC<NavBarProps> = (props: any) => {
    const [isBgListActive, setIsBgListActive] = useState(false);

    const handleToggleClick = () => {
        setIsBgListActive(!isBgListActive);
    };

    return (
        <Navbar expand="" id='navGipp' className="align-items-start bg-transparent">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggleClick} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {props.list && props.list.length > 0 ? (
                            props.list.map((item: any, index: any) => (
                                <Nav.Link key={index} as={Link} to={item.page || "/home"}>
                                   <div className={item.icon} ></div> {item.children || "Default Text"}
                                </Nav.Link>
                            ))
                        ) : (
                            <p>No items to display</p>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
/*
    4. Filtros de Pesquisa
    Você pode filtrar os ícones por estilo:

    Sólido ( fas)
    Normal ( far)
    Luz ( fal)
    Marcas ( fab), que inclui ícones de marcas como GitHub, Facebook, etc.
*/

export default NavBar;
