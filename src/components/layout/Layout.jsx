import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

function Layout({ title, userName, children }) {
  return (
    <div className="app">
      <Sidebar appName="Task Tracker" />
      <div className="app__main">
        <Header title={title} userName={userName} />
        <main className="app__content">{children}</main>
      </div>
    </div>
  )
}

export default Layout