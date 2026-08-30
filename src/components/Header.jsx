import { useState } from "react";

function Header({ user, onDashboard, onLogout, onHome, onSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName =
    user?.user_metadata?.name || user?.email || "User";

  return (
    <header className="site-header">
      <div className="header-left">
        <button className="logo-button" onClick={onHome}>
          🏏 <span>Cricket Academy</span>
        </button>
      </div>

      <nav className="desktop-nav">
        <button onClick={onHome}>Home</button>
        <button onClick={() => onSection("booking")}>
          Turf Booking
        </button>
        <button onClick={() => onSection("admission")}>
          Admission
        </button>
        <button onClick={() => onSection("players")}>
          Player Stats
        </button>
      </nav>

      <div className="user-area">
        <button
          className="user-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="user-icon">👤</span>
          <span className="user-name">{displayName}</span>
          <span>⌄</span>
        </button>

        {menuOpen && (
          <div className="user-menu">
            <div className="menu-user">
              <strong>{displayName}</strong>
              <small>{user?.email}</small>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                onDashboard();
              }}
            >
              My Dashboard
            </button>

            <button
              className="logout-button"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;