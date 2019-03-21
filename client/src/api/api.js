import { fetchJson } from './api-helpers'

// eslint-disable-next-line
import { pink } from '../logger'

export default {
  todos: {
    async read() {
      try {
        const data = await fetchJson(
          '/api/todo',
          {
            method: 'GET',
          }
        )
        return data.data
      }
      catch (e) {
        const error = await e.error
        throw error
      }
    },
  }
}