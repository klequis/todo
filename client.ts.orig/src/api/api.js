import { fetchJson } from './api-helpers'

// eslint-disable-next-line
import { pink } from '../logger'
import { create } from 'domain';

// Errors are handled by fetchJson()
export default {
  todos: {
    async read() {
      pink('(2) api.todos.read() called')
      const data = await fetchJson(
        '/api/todo',
        {
          method: 'GET',
        }
      )
      pink('(5) api.todos.read: data', data)
      return data.data
    },
    async create(todo) {
      pink('(2) api.todos.create() called: todo', todo)
      const data = await fetchJson(
        '/api/todo',
        {
          method: 'POST',
          body: JSON.stringify(todo)
        }
      )
      pink('(5) api.todos.create: data', data.data)
      return data.data
    }
  }
}