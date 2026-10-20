import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import router from './auth/signup.js';

const app = express()
const PORT = process.env.PORT || 3821

const corsOptions = {
    origin: 'http//localhost:8080',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello, Express')
})

app.get('/api/health', (req, res) => {
    res.send({
        status: 'ok',
        message: 'RepLog is running'
    })
})

app.use('/api/auth/signup', router)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});