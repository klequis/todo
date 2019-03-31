import express from 'express'
import { omit, merge } from 'ramda'
/* User */
import { find, findById, insertOne, findOneAndDelete, findOneAndUpdate, objectIdFromHexString } from '../db'
/* Dev */
import { red, yellow } from '../logger'

const router = express.Router()

/*
    - assumes only { title: string } is sent
    - { completed: false } will be added to all new todos
 */

router.post('/', async (req, res) => {
  try {
    const td1 = req.body
    const td2 = {
      title: td1.title,
      completed: false,
    }
    const inserted = await insertOne(
      'todos',
      td2
    )
    res.send(inserted)
  } catch (e) {
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  yellow('get')
  try {
    const todos = await find('todos')
    res.send(todos)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  yellow('get')

  const id = req.params.id
  yellow('id', id)
  try {
    const todos = await findById('todos', id)
    res.send(todos)
  } catch (e) {
    res.status(400).send(e)
  }
})

// router.get('/user/:userId', async (req, res) => {

//   try {
//     const events = await find('events', { userId: req.params.userId, 'dates.endDateTime': { $gt: new Date().toISOString() } })
//     res.send(events)
//   } catch (e) {
//     res.status(400).send(e)
//   }
// })



// router.get('/:id', async (req, res) => {
//   const id = req.params.id
//   try {
//     let event = await findById('events', id)
//     if (!event) {
//       return res.status(404).send()
//     }
//     res.send(event)

//   } catch (e) {
//     res.status(400).send(e)
//   }
// })

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    let todo = await findOneAndDelete('todos', id)
    if (!todo) {
      return res.status(404).send()
    }
    res.send(todo)
  } catch (e) {
    res.status(400).send()
  }
})

// router.patch('/:id', async (req, res) => {

//   try {
//     const id = req.params.id
//     const eventSent = req.body
//     const postalCodeId = objectIdFromHexString(eventSent.postalCodeId)
//     const postalData = await findById(
//       'postalCodes',
//       postalCodeId,
//       { cityName: 1, postalCode: 1, stateCode: 1, _id: 0 }
//     )
//     const a = omit(['postalCode_id'], eventSent)
//     const b = merge(a, postalData.data[0])
//     const eventToReturn = await findOneAndUpdate(
//       'events',
//       id,
//       b,
//     )
//     if (!eventToReturn) {
//       return res.status(404).send()
//     }
//     res.send(eventToReturn)
//   } catch (e) {
//     red('catch', e)
//     res.status(400).send()
//   }

// })

export default router
