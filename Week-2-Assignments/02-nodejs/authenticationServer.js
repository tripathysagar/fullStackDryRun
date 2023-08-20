/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

  const express = require("express")
  const bodyParser = require("body-parser")
  const PORT = 3000;
  const app = express();
  // write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
  
  const users = []
  
  const signupHandler = (req, resp) => {
    const user = req.body
    console.log(user)
    let status, msg
    if(user["username"] === undefined || user["password"] === undefined || user["firstName"] === undefined || user["lastName"] === undefined)
    {
      msg = "missing mandotary parameters"
      status = 400
    }
    else{
      let userExist = false
      for(let i = 0; i < users.length; i++){
        if(users[i]["username"] === user["username"]){
          msg = "user name is already taken"
          status = 400
          userExist = true
          break
        }
      }
      if(!userExist){
        users.push(user)
        msg = "user created"
        status = 201
      }
    }
  
    resp.status(status).send({"msg": msg})
  }
  
  const loginHandler = (req, resp) => {
    const loginDetails = req.body
    let validDetails = false
    let status, msg
  
    if(loginDetails["username"] === undefined || loginDetails["password"] === undefined){
      msg = "missing mandotary parameters"
      status = 401
    }
    else{
      for(let i = 0; i < users.length; i++){
        if(users[i]["username"] === loginDetails["username"]){
          if(users[i]["password"] === loginDetails["password"]){
            status = 200
            msg = {
              email : users[i]["username"],
              lastName: users[i].lastName,
              firstName: users[i].firstName
            }
          }
          else{
            status = 400
            msg = {
              "msg" : "invalid crediential"
            }
          }
          }
          else{
            status = 400
            msg = {
              "msg" : "user is not present"
            }
          }
        }
    }
    console.log(msg)
    resp.status(status).send(msg)
  }
  
  const dataHandler = (req, resp) => {
    
    console.log(req.headers)
    const password = req.headers.password
    const username = req.headers.username
  
    console.log(username, password)
  
  
    let status, msg
  
  
    if(username === undefined || password === undefined){
      msg = "missing mandotary parameters"
      status = 401
    }
    else{
      for(let i = 0; i < users.length; i++){
        if(users[i]["username"] === username){
          if(users[i]["password"] === password){
            status = 200
            msg = [
               users[i]["username"],
               users[i].lastName,
               users[i].firstName
            ]
          }
          else{
            status = 400
            msg = {
              "msg" : "invalid crediential"
            }
          }
          }
          else{
            status = 400
            msg = {
              "msg" : "user is not present"
            }
          }
        }
    }
    console.log(`msg is ${msg} and status is ${status}`)
    resp.status(status).send(msg)
  
  }
  
  
  
  app.use(bodyParser.json())
  app.post("/signup", signupHandler)
  app.post("/login", loginHandler)
  app.get("/data", dataHandler)
  
  app.all("*", (req, resp) => {
    resp.status(404).send("invaid path")
  })
  
  
  
  app.get("/", (req, resp) =>{
    
    //console.log(resp)
    resp.send(users)
  } )
  app.listen(PORT, () => console.log(`server is listening to ${PORT}`))
  module.exports = app;
  