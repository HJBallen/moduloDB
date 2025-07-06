import express from 'express'

import { getUserInfo, getFriends, getUserGroups} from '../Controller/userController.js'

export const userRouter = express.Router()

userRouter.get('/:userId', async (req,res)=>{
  const { userId} = req.params

  try {
    const result = await getUserInfo(userId)
    res.status(201).json(result)
  } catch (error) {
    console.error("Error creating user:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message})
  }
})

userRouter.get('/friends/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const result = await getFriends(userId)
    res.status(201).json(result)
  } catch (error) {
    console.error("Error fetching friends:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})

userRouter.get('/groups/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    const result = await getUserGroups(userId)
    res.status(201).json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ error: "Internal Server Error", message: error.message })
  }
})  



