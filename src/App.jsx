import { useState } from 'react'
import Layout from './components/layout/Layout.jsx'
import Card from './components/common/Card.jsx'
import Button from './components/common/Button.jsx'
import Badge from './components/common/Badge.jsx'
import SearchInput from './components/common/SearchInput.jsx'
import EmployeeList from './components/employees/EmployeeList.jsx'
import TaskStats from './components/tasks/TaskStats.jsx'
import TaskList from './components/tasks/TaskList.jsx'
import { employees as initialEmployees, newHires } from './data/employees.js'
import { tasks as initialTasks } from './data/tasks.js'
import { getNextStatus } from './utils/taskStatus.js'

// Pure helper: returns the same list if the hire already exists
function addHire(list, hire) {
  if (list.some((employee) => employee.id === hire.id)) return list
  return [...list, hire]
}

function App() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [tasks, setTasks] = useState(initialTasks)
  const [searchText, setSearchText] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null)

  const query = searchText.trim().toLowerCase()
  const visibleEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(query)
  )

  const selectedEmployee =
    employees.find((employee) => employee.id === selectedEmployeeId) ?? null

  const missingHires = newHires.filter(
    (hire) => !employees.some((employee) => employee.id === hire.id)
  )
  const nextHire = missingHires[0]
  const onLeaveCount = employees.filter((employee) => employee.onLeave).length

  function handleViewProfile(employeeId) {
    setSelectedEmployeeId(employeeId)
  }

  function handleSearchChange(text) {
    setSearchText(text)
  }

  function handleToggleLeave(employeeId) {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === employeeId
          ? { ...employee, onLeave: !employee.onLeave }
          : employee
      )
    )
  }

  function handleRemove(employeeId) {
    setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId))
  }

  function handleAddSampleHire() {
    if (!nextHire) return
    setEmployees((prev) => addHire(prev, nextHire))
  }

  function handleAddAllHires() {
    newHires.forEach((hire) => {
      setEmployees((prev) => addHire(prev, hire))
    })
  }

  function handleMarkAllAvailable() {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.onLeave ? { ...employee, onLeave: false } : employee
      )
    )
  }

  function handleAdvanceStatus(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: getNextStatus(task.status) ?? task.status }
          : task
      )
    )
  }

  return (
    <Layout title="Dashboard" userName="Priya Sharma">
      <div className="dashboard-grid">
        <Card title="Task Overview">
          <TaskStats tasks={tasks} />
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
        <Card title="Tasks">
          <TaskList
            tasks={tasks}
            employees={employees}
            onAdvanceStatus={handleAdvanceStatus}
          />
        </Card>
      </div>

      <div className="dashboard-section">
        <Card title="Team Members">
          <div className="toolbar">
            <SearchInput
              placeholder="Search by name..."
              onSearchChange={handleSearchChange}
            />
            <div className="toolbar__actions">
              {onLeaveCount > 0 && (
                <Button variant="secondary" onClick={handleMarkAllAvailable}>
                  Mark all available ({onLeaveCount})
                </Button>
              )}
              {missingHires.length > 1 && (
                <Button variant="secondary" onClick={handleAddAllHires}>
                  Add all {missingHires.length} hires
                </Button>
              )}
              <Button onClick={handleAddSampleHire}>
                {nextHire ? `Add ${nextHire.name}` : 'No more sample hires'}
              </Button>
            </div>
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