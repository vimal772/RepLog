import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
    const { name, email, password } = req.body 
    res.send({name, email, password})
})

export default router