function Header({ title, userName }) {
    return (
      <header className="header">
        <h1 className="header__title">{title}</h1>
        <div className="header__user">
          <span className="header__avatar">{userName.charAt(0)}</span>
          <span>{userName}</span>
        </div>
      </header>
    )
  }
  
  export default Header