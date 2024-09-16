import React from 'react';
import { Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SidebarAlternative.css';
import 'bootstrap/dist/css/bootstrap.min.css';

type MenuItem = {
  id: string;
  label: string;
  subItems: { label: string; link: string }[];
}

type Participant = {
  name: string;
  photoUrl: string;
}

type SidebarMenuProps = {
  menuItems: MenuItem[];
  participants: Participant[];
}


/**
    const menuItems = [
        {
          id: 'home-collapse',
          label: 'Home',
          subItems: [
            { label: 'Overview', link: '#' },
            { label: 'Updates', link: '#' },
            { label: 'Reports', link: '#' },
          ],
        }
      ];
      
      const participants = [
        { name: 'John Doe', photoUrl: 'https://via.placeholder.com/50' },
        { name: 'Jane Smith', photoUrl: 'https://via.placeholder.com/50' },
        // Adicione outros participantes conforme necessário
      ];
 */
const SidebarMenu: React.FC<SidebarMenuProps> = ({ menuItems, participants }) => {
  const [openCollapse, setOpenCollapse] = React.useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenCollapse(openCollapse === id ? null : id);
  };

  return (
    <div className="d-flex flex-column bg-white bg-menu">
      <div className="position-relative">
        <img
          src={'https://via.placeholder.com/100'}
          alt={'tela'}
          className="rounded-circle fill-image on-color"
        />
      </div>
      <span className="fs-5 fw-semibold border-bottom mb-3">GIPP</span>
      <ul className="list-unstyled ps-0">
        {menuItems.map((item) => (
          <li className="mb-1" key={item.id}>
            <label className="btn btn-toggle align-items-center rounded collapsed" onClick={() => handleToggle(item.id)}>
              {item.label}
            </label>
            <Collapse in={openCollapse === item.id}>
              <div id={`${item.id}-collapse`}>
                <ul className="px-4 btn-toggle-nav list-unstyled fw-normal pb-1 small">
                  {item.subItems.map((subItem, index) => (
                    <li key={index}>
                      <Link to={subItem.link} className="link-dark rounded">{subItem.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Collapse>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-3 border-top">
        <h6 className="fs-6 fw-semibold">Online</h6>
        <div className="d-flex flex-wrap">
          {participants.map((participant, index) => (
            <div key={index} className="d-flex flex-column align-items-center mb-3 me-2">
              <img
                src={participant.photoUrl}
                alt={participant.name}
                className="rounded-circle people-online-image on-color"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
