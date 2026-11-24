function Sidebar({ appName }) {
    return (
      <aside className="sidebar">
        <div className="sidebar__brand">{appName}</div>
        <nav className="sidebar__nav">
          <a href="#" className="sidebar__link">Dashboard</a>
          <a href="#" className="sidebar__link">Tasks</a>
          <a href="#" className="sidebar__link">Employees</a>
          <a href="#" className="sidebar__link">Settings</a>
        </nav>
      </aside>
    )
  }
  
  export default Sidebar