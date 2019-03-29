import { fetchJson } from './api-helpers'

// eslint-disable-next-line
import { pink } from '../logger'

// Errors are handled by fetchJson()
export default {
  todos: {
    async read() {
      const data = await fetchJson(
        '/api/todo',
        {
          method: 'GET',
        }
      )
      return data.data
    },
    async create(todo) {
      const data = await fetchJson(
        '/api/todo',
        {
          method: 'POST',
          body: JSON.stringify(todo)
        }
      )
      return data.data
    }
  }
}