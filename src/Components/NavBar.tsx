import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <Navbar expand="" id='navGipp' className="align-items-start">
            <Container>
                {/*
                    <Navbar.Brand as={Link} to="/home">
                        GIPP
                    </Navbar.Brand> 
                */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/home">
                            <div className='fa fa-home'></div> Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/configuracao">
                            <div className='fa fa-gear'></div> Configuração
                        </Nav.Link>
                        <Nav.Link as={Link} to="/">
                            <div className='fa fa-sign-out'></div> Sair
                        </Nav.Link>
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
