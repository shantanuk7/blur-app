import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IoArrowBackOutline, IoSaveOutline, IoTrashOutline, IoEllipsisVertical,
  IoLogOutOutline, IoEyeOutline, IoEyeOffOutline
} from 'react-icons/io5';

const Navbar = ({ onSave, onBack, onDelete, blurEnabled, toggleBlur }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isEditorPage = location.pathname.startsWith('/edit-note'); // Only for existing notes
  const isViewPage = location.pathname.startsWith('/view-note');
  const isHomePage = location.pathname === '/';
  const isNewNotePage = location.pathname === '/new-note';

  // **THE FIX**: Logic to determine if the menu button should render at all
  const shouldRenderMenu = isHomePage || isViewPage || isEditorPage;

  const renderMenu = () => (
    <div className="navbar-menu-container">
      <button className="navbar-icon-button" onClick={() => setShowMenu(prev => !prev)} aria-label="Menu">
        <IoEllipsisVertical />
      </button>
      {showMenu && (
        <div className="navbar-menu">
          {isHomePage && (
            <button className="navbar-menu-item" onClick={handleLogout}>
              <IoLogOutOutline /> Logout
            </button>
          )}
          {(isViewPage || isEditorPage) && onDelete && (
            <button className="navbar-menu-item delete" onClick={() => { onDelete(); setShowMenu(false); }}>
              <IoTrashOutline /> Delete Note
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <nav className="navbar">
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
        {(isNewNotePage || isEditorPage || isViewPage) && (
          <button className="navbar-icon-button" onClick={onBack} aria-label="Back">
            <IoArrowBackOutline />
          </button>
        )}
        {isHomePage && <div className="navbar-title">Blur</div>}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        {(isNewNotePage || isEditorPage) && (
          <>
            <button className="navbar-icon-button" onClick={toggleBlur} aria-label="Toggle Blur">
              {blurEnabled ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
            <button className="navbar-icon-button" onClick={onSave} aria-label="Save Note">
              <IoSaveOutline />
            </button>
          </>
        )}
        {shouldRenderMenu && renderMenu()}
      </div>
    </nav>
  );
};

export default Navbar;