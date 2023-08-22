const express = require('express')
const jwt = require('jsonwebtoken')

const app = express();

app.use(express.json()); // middleware for extracting body


let ADMINS = [];
let USERS = [];
let COURSES = [];

const ADMIN_SECRET = "ADMINS"
const USERS_SECRET = "USERS"
const generateJWT = (username, contex) =>{
  const SECRET = (contex === "ADMINS") ? ADMIN_SECRET : USERS_SECRET
  
  return jwt.sign(username, SECRET)
}

const validateJWT = (token, contex ) =>{
  const SECRET = (contex === "ADMINS") ? ADMIN_SECRET : USERS_SECRET
  const arr = (contex === "ADMINS") ? ADMINS : USERS

  const user = jwt.decode(token, SECRET)

  console.log(user, typeof user)

  for(let i =0; i< arr.length; i++){
    console.log(arr[i].username, typeof arr[i].username )
    if(arr[i].username === user){
      return {
        id: i,
        status: 200,
        msg: `user present ${contex}`
      }
    }
  }
  return {
    id : -1,
    msg: `unauthorized`,
    status: 401
  }

}

const validateCredential = (username, password, contex) => {
  let msg, status, id
  console.log(`username : ${username}\npassword : ${password}`)

  const arr = (contex === "ADMINS") ? ADMINS : USERS
  
  if(username !== undefined && password !== undefined){
    for(let i =0; i< arr.length; i++){
      if(arr[i].username === username && arr[i].password === password){
        status = 200
        msg = { 
          message: 'Logged in successfully',
          token: generateJWT(username, contex)
        },
        id = i
      }
    }
    if(status === undefined){
      status = 401
      msg = { message: 'Check username and password' }
    }
  }
  else{
    msg = { message: 'missing mandetory fields' }
    status = 400
  }

  return {
    message: msg,
    status: status,
    id: id
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin

  const username = req.body?.username
  const password = req.body?.password

  let msg, status
  console.log(`username : ${username}\npassword : ${password}`)

  if(username !== undefined && password !== undefined){
    ADMINS.push({
      username: username,
      password: password
    })
    msg = { 
      message: 'Admin created successfully',
      token: generateJWT(username, "ADMINS")
     }
    status = 200
  }
  else{
    msg = { message: 'missing mandetory fields' }
    status = 400
  }

  console.log(ADMINS)
  return res.status(status).send(msg)
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const username = req.body?.username
  const password = req.body?.password

  const userStatus = validateCredential(username,password, "ADMINS")
  
  //console.log(`userStatus is : ${userStatus}`)
  if(userStatus.status === 200){
    res.status(userStatus.status).send(userStatus.message)
  }else{
    res.status(userStatus.status).send(userStatus.message)
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course 
  //console.log(req)
  let Authorization = req.headers?.authorization
  Authorization = Authorization?.split(' ')

  let status, msg
  if(Authorization?.length == 2 && Authorization[0] === "Bearer"){
    let userStatus = validateJWT(Authorization[1], "ADMINS")
    console.log(userStatus.id, userStatus.msg)
    

    if(userStatus.id === -1){
      //if user is not present but jwt is valid
      status = userStatus.status
      msg = {message: userStatus.msg}
    }
    else{
        const title = req.body?.title
        const description = req.body?.description
        const price = req.body?.price
        const imageLink = req.body?.imageLink
        const published = req.body?.published
        console.log(title, description, price, imageLink, published)
        const id = parseInt(Math.random() * 100000000)
    
        if(title !== undefined && description !== undefined && price !== undefined && imageLink !== undefined && published !== undefined){
          COURSES.push({
            id: id,
            title: title,
            description: description,
            price: price,
            imageLink: imageLink,
            published: published
          })
    
          console.log(COURSES)
          status = 200
          msg = { message: 'Course created successfully', courseId: id}
        }
        else{
          status = 400
          msg = { message: 'missing mandetory fields'}
        }
    }
  }
  else{
    // not reciving the authorization headers
    status = 401
    msg = { message: 'Unauthorized'}
    

  }

  res.status(status).send( msg)

  
  
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course

  const courseId = req.params?.courseId

  let Authorization = req.headers?.authorization
  Authorization = Authorization?.split(' ')

  


  

  let status, msg 
  if(Authorization?.length == 2 && Authorization[0] === "Bearer"){
    let userStatus = validateJWT(Authorization[1], "ADMINS")
    console.log(userStatus.id, userStatus.msg)
    

    if(userStatus.id === -1){
      //if user is not present but jwt is valid
      status = userStatus.status
      msg = {message: userStatus.msg}
    }
    else{
      const title = req.body?.title
      const description = req.body?.description
      const price = req.body?.price
      const imageLink = req.body?.imageLink
      const published = req.body?.published
      console.log(title, description, price, imageLink, published)
    
      let index = -1
      for(let i = 0; i< COURSES.length; i++){
        if(COURSES[i].id === parseInt(courseId)){
          index = i
          break
        }
      }

    //if coure is not found
      if(index === -1){
        status = 401
        msg = { message: 'Did not found thee course'}
      }
      else{
        if(title !== undefined){
          COURSES[index].title = title
        }
        if(description !== undefined){
          COURSES[index].description = description
        }
        if(price !== undefined){
          COURSES[index].price = price
        }
        if(imageLink !== undefined){
          COURSES[index].imageLink = imageLink
        }
        if(published !== undefined){
          COURSES[index].published = published
        }
        status = 200
        msg = { message: 'Course updated successfully' }
      }

      console.log(COURSES)
      
    }
  }
  else{
    status = 401
      msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
  
  
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  let Authorization = req.headers?.authorization
  Authorization = Authorization?.split(' ')

  let status, msg
  if(Authorization?.length == 2 && Authorization[0] === "Bearer"){
    let userStatus = validateJWT(Authorization[1], "ADMINS")
    console.log(userStatus.id, userStatus.msg)
    

    if(userStatus.id === -1){
      //if user is not present but jwt is valid
      status = userStatus.status
      msg = {message: userStatus.msg}
    }
    else{
      status = 200
      msg = COURSES
    }
  }else{
    status = 401
      msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const username = req.body?.username
  const password = req.body?.password

  let msg, status
  console.log(`username : ${username}\npassword : ${password}`)

  if(username !== undefined && password !== undefined){
    USERS.push({
      username: username,
      password: password
    })
    msg = { 
      message: 'User created successfully',
      token: generateJWT(username, "USERS")
     }
    status = 200
  }
  else{
    msg = { message: 'missing mandetory fields' }
    status = 400
  }

  console.log(USERS)
  return res.status(status).send(msg)
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const username = req.body?.username
  const password = req.body?.password

  const userStatus = validateCredential(username,password, "USERS")
  
  if(userStatus.status === 200){
    res.status(userStatus.status).send(userStatus.message)
  }else{
    res.status(userStatus.status).send(userStatus.message)
  }

});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  let Authorization = req.headers?.authorization
  Authorization = Authorization?.split(' ')

  let status, msg
  if(Authorization?.length == 2 && Authorization[0] === "Bearer"){
    let userStatus = validateJWT(Authorization[1], "USERS")
    console.log(userStatus.id, userStatus.msg)
    

    if(userStatus.id === -1){
      //if user is not present but jwt is valid
      status = userStatus.status
      msg = {message: userStatus.msg}
    }
    else{
      status = 200
      msg = COURSES
    }
  }else{
    status = 401
      msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course

  

  const courseId = parseInt(req.params?.courseId)

  let Authorization = req.headers?.authorization
  Authorization = Authorization?.split(' ')

  let status, msg 
  if(Authorization?.length == 2 && Authorization[0] === "Bearer"){
    let userStatus = validateJWT(Authorization[1], "USERS")
    console.log(userStatus.id, userStatus.msg)
    
    if(userStatus.id === -1){
      //if user is not present but jwt is valid
      status = userStatus.status
      msg = {message: userStatus.msg}
    }
    else{
      let index = -1
      for(let i = 0; i< COURSES.length; i++){
        if(COURSES[i].id === courseId){
          index = i
          break
        }
      }

    //if coure is not found
      if(index === -1){
        status = 401
        msg = { message: 'Did not found thee course'}
      }
      else{

        if(USERS[userStatus.id].course === undefined){
          USERS[userStatus.id].course = [courseId] 
        }else{
          USERS[userStatus.id].course.push(courseId)
        } 
        
        status = 200
        msg = { message: 'Course purchased successfully' }
      }
    }
  

      console.log(COURSES)
      
    }
    
  
  else{
    status = 401
    msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses

  let Authorization = req.headers?.authorization
  Authorization = Authorization?.split(' ')

  let status, msg 
  if(Authorization?.length == 2 && Authorization[0] === "Bearer"){
    let userStatus = validateJWT(Authorization[1], "USERS")
    console.log(userStatus.id, userStatus.msg)
    
  
    if(userStatus.id === -1){
      //if user is not present but jwt is valid
      status = userStatus.status
      msg = {message: userStatus.msg}
    }
    else{
      const purchasedCourses = USERS[userStatus.id]?.course
      console.log(purchasedCourses)
      msg = []
      for(let i = 0; i < purchasedCourses?.length; i++){
        for(let j = 0; j < COURSES?.length; j++){
          console.log(COURSES[j].id,purchasedCourses[i] )
          if(COURSES[j].id === purchasedCourses[i]){
            msg.push(COURSES[j])
          }
      }}
      status = 200
    }
  }
  else{
    status = 401
    msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
