const express = require('express');

const app = express();

app.use(express.json()); // middleware for extracting body


let ADMINS = [];
let USERS = [];
let COURSES = [];

const validateCredential = (username, password, table) => {
  let msg, status, id
  console.log(`username : ${username}\npassword : ${password}`)

  const arr = (table === "ADMINS") ? ADMINS : USERS
  
  if(username !== undefined && password !== undefined){
    for(let i =0; i< arr.length; i++){
      if(arr[i].username === username && arr[i].password === password){
        status = 200
        msg = { message: 'Logged in successfully' },
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
    message: msg.message,
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
    msg = { message: 'Admin created successfully' }
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
  
  res.status(userStatus.status).send({
    message : userStatus.message
  })
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  let username = req.headers.username
  let password = req.headers.password

  console.log(`username : ${username}\npassword : ${password}`)


  const userStatus = validateCredential(username,password, "ADMINS")

  let status, msg 
  if(userStatus.status === 200){
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
  else{
    status = 401
      msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
  
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course

  const courseId = req.params.courseId

  let username = req.headers.username
  let password = req.headers.password

  console.log(`username : ${username}\npassword : ${password}`)


  const userStatus = validateCredential(username,password, "ADMINS")

  let status, msg 
  if(userStatus.status === 200){
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
    
  
  else{
    status = 401
      msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
  
  
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  let username = req.headers.username
  let password = req.headers.password

  console.log(`username : ${username}\npassword : ${password}`)

  let status, msg
  const userStatus = validateCredential(username,password, "ADMINS")


  if(userStatus.status === 200){  
    status = 200
    msg = COURSES

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
    msg = { message: 'User created successfully' }
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
  
  res.status(userStatus.status).send({
    message : userStatus.message
  })

});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  let username = req.headers.username
  let password = req.headers.password

  console.log(`username : ${username}\npassword : ${password}`)

  let status, msg
  const userStatus = validateCredential(username,password, "USERS")


  if(userStatus.status === 200){  
    status = 200
    msg = COURSES

  }else{
    status = 401
      msg = { message: 'unauthorized'}
  }

  res.status(status).send(msg)
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course

  

  const courseId = parseInt(req.params.courseId)

  let username = req.headers.username
  let password = req.headers.password

  console.log(`username : ${username}\npassword : ${password}`)


  const userStatus = validateCredential(username,password, "USERS")

  let status, msg 
  if(userStatus.status === 200){
    
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

  let username = req.headers.username
  let password = req.headers.password

  console.log(`username : ${username}\npassword : ${password}`)


  const userStatus = validateCredential(username,password, "USERS")

  let status, msg 
  if(userStatus.status === 200){

    const purchasedCourses = USERS[userStatus.id].course
    console.log(purchasedCourses)
    msg = []
    for(let i = 0; i < purchasedCourses.length; i++){
      for(let j = 0; j < COURSES.length; j++){
        console.log(COURSES[j].id,purchasedCourses[i] )
        if(COURSES[j].id === purchasedCourses[i]){
          msg.push(COURSES[j])
        }
    }}

    status = 200
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
