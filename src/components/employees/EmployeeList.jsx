import EmployeeCard from './EmployeeCard.jsx'
import EmptyState from '../common/EmptyState.jsx'
import SearchInput from '../common/SearchInput.jsx'

function EmployeeList({ employees, isLoading = false, onViewProfile, onSearchChange }) {
  if (isLoading) {
    return <p className="loading-text">Loading team members...</p>
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No team members yet"
        message="Add an employee to get started."
      />
    )
  }

  const count = employees.length

  return (
    <>
      <SearchInput
        placeholder="Search by name..."
        onSearchChange={onSearchChange}
      />
      <p className="employee-count">
        {count} team {count === 1 ? 'member' : 'members'}
      </p>
      <div className="employee-grid">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            id={employee.id}
            name={employee.name}
            role={employee.role}
            department={employee.department}
            email={employee.email}
            onLeave={employee.onLeave}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
    </>
  )
}

export default EmployeeList