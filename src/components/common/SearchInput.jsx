function SearchInput({ placeholder, onSearchChange }) {
    function handleChange(event) {
      onSearchChange(event.target.value)
    }
  
    return (
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        onChange={handleChange}
      />
    )
  }
  
  export default SearchInput