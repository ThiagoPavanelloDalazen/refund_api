import express from "express"
import "express-async-errors"
import cors from "cors"
import { routes } from "./routes/index"
import { errorHandling } from "@/middlewares/error-handling"


const app = express()
app.use(cors())
app.use(express.json())

app.use(routes)

app.get("/", (req, res) => {
  res.send("Hello, World!")
})

app.use(errorHandling)

export { app }