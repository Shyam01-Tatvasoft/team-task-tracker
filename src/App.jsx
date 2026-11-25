import { useState } from 'react'
import Layout from './components/layout/Layout.jsx'
import Card from './components/common/Card.jsx'
import Button from './components/common/Button.jsx'
import SearchInput from './components/common/SearchInput.jsx'
import EmployeeList from './components/employees/EmployeeList.jsx'
import { employees } from './data/employees.js'

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)

  const query = searchText.trim().toLowerCase()
  const visibleEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(query)
  )

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ?? null

  function handleViewProfile(employeeId) {
    setSelectedEmployeeId(employeeId)
  }

  function handleSearchChange(text) {
    setSearchText(text)
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
          <SearchInput
            placeholder="Search by name..."
            onSearchChange={handleSearchChange}
          />
          <EmployeeList
            employees={visibleEmployees}
            isLoading={false}
            onViewProfile={handleViewProfile}
            emptyTitle="No matching employees"
            emptyMessage="Try a different name."
          />
        </Card>
      </div>
    </Layout>
  )
}

export default App