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

// Even-length queries are slow, odd-length are fast, so races are easy to reproduce
export function searchTasks(query, { signal } = {}) {
    const delay = query.length % 2 === 0 ? 1200 : 300
  
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }
  
      const timer = setTimeout(() => {
        const text = query.toLowerCase()
        resolve(tasks.filter((task) => task.title.toLowerCase().includes(text)))
      }, delay)
  
      signal?.addEventListener(
        'abort',
        () => {
          console.log('aborted:', query)
          clearTimeout(timer)
          reject(new DOMException('Aborted', 'AbortError'))
        },
        { once: true }
      )
    })
  }
  
  const MESSAGES = [
    'Rahul moved "Build login page UI" to In progress',
    'Ananya commented on "Design REST API for reports"',
    'Karan updated the regression test plan',
    'Arjun finished the CI/CD pipeline setup',
  ]
  
  // Returns an unsubscribe function
  export function subscribeToNotifications(callback) {
    let index = 0
    const id = setInterval(() => {
      callback({ id: `${Date.now()}-${index}`, message: MESSAGES[index % MESSAGES.length] })
      index += 1
    }, 8000)
    return () => clearInterval(id)
  }