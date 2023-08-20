class ToDo{
    #toDoList
    constructor (obj){
       if(typeof obj === "undefined")
           this.#toDoList = []
       else
           this.#toDoList = obj
    }
    
    
    get getter(){
       console.log(this.#toDoList)
    }
   
   setter(todo){
       //this.getter
       this.#toDoList = []
       todo.map(item => this.#toDoList.push(item) )
       
       //console.log(this.#toDoList)
    }
   
    error(msg){
       return {
           "error" : msg
       }
    }
   
    checkInputType(title, completed, description){
       if (title === undefined || completed ===  undefined || description === undefined)
           return this.error("not entering valid input")
       
       if (typeof completed !== "boolean")
           return this.error("not entering valid input")
       
       return true
       
    }
   
    findIndex(id){
       for(let i = 0; i< this.#toDoList.length ; i++){
           if(this.#toDoList[i].id === id)
               return i
       }
   
       return -1
    }
    add (title, completed, description){
       console.log(title, completed, description)
       const checkInput = this.checkInputType(title, completed, description)
       if(checkInput !== true)
           return checkInput
   
       const obj = { 
           "id": parseInt(Math.random() * 10000000000), 
           "title": title, 
           "completed": completed, 
           "description": description
       }
       
       this.#toDoList.push( obj)
   
       return obj
   }
   
    remove(indexOfTodo) //remove todo from list of todos
    {
       let objIndex = this.findIndex(indexOfTodo)
       if(objIndex === -1){
           return this.error("ID is not available")
       }
   
       this.#toDoList.splice(objIndex, 1)
       
       return { "msg" :true}
    }
    
       update(indexOfTodo, title= undefined, completed = undefined, description = undefined) //update todo at given index
       {
           let objIndex = this.findIndex(indexOfTodo)
   
           let changed = false
           const todo = this.get(indexOfTodo )
   
           if(todo.error !== undefined){
               return todo
           }
           //console.log(todo)
           if(title !== undefined){
               todo.title = title
               changed = true
           }
           if(completed !== undefined){
               if ((typeof completed) === "boolean"){
                   todo.completed = completed
                    changed = true
               }
               else
                   return  this.error("not entering valid input")
           }
   
           if(description !== undefined){
               todo.description = description
               changed = true
   
           }
   
           if(changed) {
               this.#toDoList.splice(objIndex, 1, todo )
           }
           //console.log(this.#toDoList)
           return todo
   
           
       }
   
   
       getAll() //returns all todos
       {
           //let lis = this.#toDoList
           return this.#toDoList
       }
   
       get(indexOfTodo) //returns todo at given index
       {
           let objIndex = this.findIndex(indexOfTodo)
           if(objIndex === -1){
               return this.error("ID is not available")
           }
           return this.#toDoList.at(objIndex)
       }
   
       clear()//deletes all todos
       {
           this.#toDoList.splice(0, this.#toDoList.length)
       }
   
   }
   
   module.exports = {ToDo}
   /*
   const lis = new ToDo()
   lis.getter
   lis.add("blah ", true, "blah blah")
   lis.add("tom ", true, "sayer is a good man")
   lis.getter
   console.log(lis.get(1))
   console.log(lis.update(1,undefined,false, "daft punk"))
   console.log(lis.getAll())
   console.log()
   console.log(lis.update(1,undefined,"false", "daft punk"))
   console.log(lis.update(1,undefined,undefined, undefined))
   
   console.log(lis.update(0,undefined,"false", "daft punk"))
   console.log("++++++++++++++++++++++++++")
   
   console.log(lis.remove(1))
   console.log(lis.getAll())
   */
   
   /*
   const lis = new ToDo()
   
   lis.getter
   lis.add("blah ")
   //lis.getter
   
   lis.add("blah blah")
   //lis.getter
   
   lis.add("blah blah blah")
   lis.getter
   
   lis.add("blah blah blah blah")
   lis.add("blah blah blah blah blah")
   lis.add("blah blah blah blah blah blah")
   
   console.log(lis.add(123343))
   
   lis.getter
   
   lis.remove(1)
   lis.getter
   
   console.log(lis.remove(1000))
   lis.getter
   
   console.log(lis.update(1,"tom sayer"))
   lis.getter
   console.log(lis.update(1,[]))
   console.log(lis.update(1,{}))
   console.log(lis.update(100,{}))
   
   const obj = lis.getAll()
   console.log(obj)
   
   
   console.log(lis.get(3))
   lis.clear()
   
   console.log(lis.getAll())
   
   
   
   */
   
   