import { employees } from '../data/employees.js'
import { tasks } from '../data/tasks.js'

const DELAY_MS = 800
const FAIL_RATE = 0 // 0 = never fails, 1 = always fails

function simulate(data) {
  console.log('API request')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FAIL_RATE) {
        reject(new Error('Network error. Please try again.'))
      } else {
        resolve(structuredClone(data))
      }
    }, DELAY_MS)
  })
}

export const fetchEmployees = () => simulate(employees)
export const fetchTasks = () => simulate(tasks)