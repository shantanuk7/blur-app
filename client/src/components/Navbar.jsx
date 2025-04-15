import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IoArrowBackOutline,
  IoSaveOutline,
  IoTrashOutline,
  IoEllipsisVertical,
  IoLogOutOutline,
  IoEyeOutline,
  IoEyeOffOutline
} from 'react-icons/io5';

const Navbar = ({ onSave, onBack, onDelete, blurEnabled, toggleBlur }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  let leftContent = null;
  let centerContent = null;
  let rightContent = null;

  if (location.pathname === '/') {
    leftContent = <div className="navbar-title">Blur</div>;
    if (token) {
      rightContent = (
        <button className="navbar-icon-button" onClick={() => {}} aria-label="Menu">
          <IoEllipsisVertical />
        </button>
      );
    }
  } else if (location.pathname === '/new-note' || location.pathname.startsWith('/edit-note')) {
    leftContent = (
      <button className="navbar-icon-button" onClick={onBack} aria-label="Back">
        <IoArrowBackOutline />
      </button>
    );
    rightContent = (
      <>
        <button className="navbar-icon-button" onClick={toggleBlur} aria-label="Toggle Blur">
          {blurEnabled ? <IoEyeOffOutline /> : <IoEyeOutline />}
        </button>
        <button className="navbar-icon-button" onClick={onSave} aria-label="Save Note">
          <IoSaveOutline />
        </button>
      </>
    );
  } else if (location.pathname.startsWith('/view-note')) {
    leftContent = (
      <button className="navbar-icon-button" onClick={onBack} aria-label="Back">
        <IoArrowBackOutline />
      </button>
    );
    rightContent = (
      <button className="navbar-icon-button" onClick={onDelete} aria-label="Delete Note">
        <IoTrashOutline />
      </button>
    );
  } else if (token) {
    rightContent = (
      <button className="navbar-text-button" onClick={handleLogout}>Logout</button>
    );
  } else {
    centerContent = <div className="navbar-title">Blur</div>;
  }

  return (
    <nav className="navbar">
      <div>{leftContent}</div>
      <div className="navbar-spacer">{centerContent}</div>
      <div style={{ minWidth: '10px', display: 'flex', justifyContent: 'flex-end' }}>{rightContent}</div>
    </nav>
  );
};

export default Navbar;