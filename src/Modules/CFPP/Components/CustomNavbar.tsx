import React, { useState } from 'react';
import { NavItem } from '../Data/configs';
import { Link } from 'react-router-dom';
import './StyleNavBar.css';


interface NavbarProps {
  items: NavItem[];
}

export default function CustomNavbar({ items }: NavbarProps) {

  const toggleDropdown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  return (
    <nav className="custom-navbar mx-2">
      <ul className="custom-nav ms-auto">
        {items.map((item, index) => (
          <li className={`custom-nav-item ${item.subItems ? 'custom-dropdown' : ''}`} key={index}>
            {item.subItems ? (
              <React.Fragment>
                <a
                  className="custom-nav-link custom-dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={(event) => toggleDropdown(event)}
                >
                  {item.label}
                </a>
                <ul className={`custom-dropdown-menu`}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link className="custom-dropdown-item" to={subItem.path || '#'}>
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            ) : (
              <Link className="custom-nav-link" to={item.path || '#'}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
