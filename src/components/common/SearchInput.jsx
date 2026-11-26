function SearchInput({ value, onChange, placeholder }) {
    return (
      <input
        type="search"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }
  
  export default SearchInput