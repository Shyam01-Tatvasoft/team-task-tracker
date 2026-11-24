import EmployeeCard from './EmployeeCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

function EmployeeList({ employees, isLoading = false }) {
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
      <p className="employee-count">
        {count} team {count === 1 ? 'member' : 'members'}
      </p>
      <div className="employee-grid">
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            name={employee.name}
            role={employee.role}
            department={employee.department}
            email={employee.email}
            onLeave={employee.onLeave}
          />
        ))}
      </div>
    </>
  )
}

export default EmployeeList