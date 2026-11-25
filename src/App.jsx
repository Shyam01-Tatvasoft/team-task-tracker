import { useState } from 'react'
import Layout from './components/layout/Layout.jsx'
import Card from './components/common/Card.jsx'
import Button from './components/common/Button.jsx'
import Badge from './components/common/Badge.jsx'
import SearchInput from './components/common/SearchInput.jsx'
import EmployeeList from './components/employees/EmployeeList.jsx'
import { employees as initialEmployees, newHires } from './data/employees.js'

function App() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchText, setSearchText] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)

  const query = searchText.trim().toLowerCase()
  const visibleEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(query)
  )

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ?? null

  const nextHire = newHires.find(
    (hire) => !employees.some((employee) => employee.id === hire.id)
  )

  function handleViewProfile(employeeId) {
    setSelectedEmployeeId(employeeId)
  }

  function handleSearchChange(text) {
    setSearchText(text)
  }

  function handleToggleLeave(employeeId) {
    setEmployees(
      employees.map((employee) =>
        employee.id === employeeId
          ? { ...employee, onLeave: !employee.onLeave }
          : employee
      )
    )
  }

  function handleRemove(employeeId) {
    setEmployees(employees.filter((employee) => employee.id !== employeeId))
  }

  function handleAddSampleHire() {
    if (!nextHire) return
    setEmployees([...employees, nextHire])
  }

  return (
    <Layout title="Dashboard" userName="Priya Sharma">
      <div className="dashboard-grid">
        <Card title="Task Overview">
          <p>Task statistics will appear here.</p>
        </Card>
        <Card title="Team Activity">
          <p>Recent activity will appear here.</p>
        </Card>
        <Card title="Selected Employee">
          {selectedEmployee ? (
            <div className="selected-employee">
              <p className="selected-employee__name">{selectedEmployee.name}</p>
              <p>{selectedEmployee.role}</p>
              <p>{selectedEmployee.email}</p>
              {selectedEmployee.onLeave && (
                <Badge variant="warning">On leave</Badge>
              )}
              <Button
                variant="secondary"
                onClick={() => setSelectedEmployeeId(null)}
              >
                Clear selection
              </Button>
            </div>
          ) : (
            <p>Click "View profile" on a team member.</p>
          )}
        </Card>
      </div>
      <div className="dashboard-section">
        <Card title="Team Members">
          <div className="toolbar">
            <SearchInput
              placeholder="Search by name..."
              onSearchChange={handleSearchChange}
            />
            <Button onClick={handleAddSampleHire}>
              {nextHire ? `Add ${nextHire.name}` : 'No more sample hires'}
            </Button>
          </div>
          <EmployeeList
            employees={visibleEmployees}
            isLoading={false}
            onViewProfile={handleViewProfile}
            onToggleLeave={handleToggleLeave}
            onRemove={handleRemove}
            emptyTitle={
              employees.length === 0
                ? 'No team members yet'
                : 'No matching employees'
            }
            emptyMessage={
              employees.length === 0
                ? 'Use the add button to bring someone in.'
                : 'Try a different name.'
            }
          />
        </Card>
      </div>
    </Layout>
  )
}

export default App