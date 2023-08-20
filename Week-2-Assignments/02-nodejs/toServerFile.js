const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const cors = require('cors')
const path = require('path');


const { ToDo }= require("./todoClass.js")
const todoFile = "./toDo.json"

const app = express()
const port = 3000

const todoLis = new ToDo()

const isError = (msg) => {
    if(typeof msg.error === "undefined")
      return true
    return false
}


const handleGetAllToDo = (req, resp) => {
    fs.readFile(todoFile, "utf-8", (err, data) =>{
        if(err === null){
            todoLis.setter(JSON.parse(data))
            let todos = todoLis.getAll()
            //console.log(todos)
            resp.send(todos)
        }
        else{
            resp.status(500).send(err)
        }
    })
}

const handleGetToDoByID = (req, resp) => {
    fs.readFile(todoFile, "utf-8", (err, data) =>{
        if(err === null){
            const id = parseInt(req.params.id)
            
            todoLis.setter(JSON.parse(data))
            
            const exist = todoLis.get(id) 
            const status = isError(exist) ? 201 : 404
            resp.status(status).send(exist)

            
        }
        else{
            resp.status(500).send(err)
        }
    })
}

const handlePostToDo = (req,resp) => {
    console.log(req.body)
    fs.readFile(todoFile, "utf-8", (err, data) =>{
        if(err === null){
            
            todoLis.setter(JSON.parse(data))
            
            const added = todoLis.add(req.body.title, req.body.completed, req.body.description)

            
            const status = isError(added) ? 202 : 401
            
            //console.log(todoLis.getAll())

            const allToDos = JSON.stringify(todoLis.getAll())
            fs.writeFile(todoFile, allToDos , err => {
                if(err!== null){
                    resp.status(500).send(err)
                }
            })
            resp.status(status).send(added)
            
        }
        else{
            resp.status(500).send(err)
        }
    })
    
  
}

const handlePutToDoByID = (req, resp) => {
    fs.readFile(todoFile, "utf-8", (err, data) =>{
        if(err === null){
            
            todoLis.setter(JSON.parse(data))
            const id = parseInt(req.params.id)

            
            const exist = todoLis.update(id, req.body.title, req.body.completed, req.body.description)

            
            const status = isError(exist) ? 200 : 404
            
            //console.log(todoLis.getAll())

            const allToDos = JSON.stringify(todoLis.getAll())
            fs.writeFile(todoFile, allToDos , err => {
                if(err!== null){
                    resp.status(500).send(err)
                }
            })
            resp.status(status).send(exist)
            
        }
        else{
            resp.status(500).send(err)
        }
    })
    
}

const handleDeleteToDoByID = (req,resp) => {
    fs.readFile(todoFile, "utf-8", (err, data) =>{
        if(err === null){
            const id = parseInt(req.params.id)
            
            todoLis.setter(JSON.parse(data))
            
            const deleted = todoLis.remove(id) 

            
            const status = isError(deleted) ? 202 : 404

            resp.status(status).send(deleted)

            const allToDos = JSON.stringify(todoLis.getAll())
            fs.writeFile(todoFile, allToDos , err => {
                if(err!== null){
                    resp.status(500).send(err)
                }
            })
            
        }
        else{
            resp.status(500).send(err)
        }
    })
    
    
}

app.use(cors())
app.use(bodyParser.json())



app.get('/todos', handleGetAllToDo)
app.get("/todos/:id", handleGetToDoByID)
app.post('/todos', handlePostToDo)
app.put("/todos/:id", handlePutToDoByID)
app.delete("/todos/:id", handleDeleteToDoByID)

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "./index.html"))
})
app.all('*', (req, res) => {
    res.status(404).send('Route not found');
  });

app.listen(port, ()=>{
    `app listening to the port ${port}`
  })