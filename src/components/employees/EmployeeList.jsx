import EmployeeCard from './EmployeeCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

function EmployeeList({
  employees,
  isLoading = false,
  onViewProfile,
  emptyTitle = 'No team members yet',
  emptyMessage = 'Add an employee to get started.',
}) {
  if (isLoading) {
    return <p className="loading-text">Loading team members...</p>
  }

  if (employees.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
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