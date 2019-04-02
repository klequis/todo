/* Dev */
// eslint-disable-next-line
import { pink } from 'logger'

export const fetchJson = (url, options = {}) => {
  // pink('(3) api-helpers.fetchJson()')
  let headers = {
    ...options.headers,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  return (
    fetch(url, {
      ...options,
      headers,
    }).then(res => {
      const { status } = res
      if (status >= 200 && status < 300) {
        return res.json()
      } else {
        // pink('(4) api-helpers.fetchJson: bad response', res)
        const err = {
          status: res.status,
          statusText: res.statusText,
          url: res.url,
        }
        throw err
      }
    })
  )
}


export default { fetchJson }