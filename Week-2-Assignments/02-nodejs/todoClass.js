 class ToDo{
 #toDoList
 constructor (){
    this.#toDoList = []
 }
 
 
 get getter(){
    console.log(this.#toDoList)
 }

 set setter(todo){
    //this.getter
    this.#toDoList.push(todo)
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
 add (title, completed, description){
    
    const checkInput = this.checkInputType(title, completed, description)
    if(checkInput !== true)
        return checkInput

    const obj = { "title": title, "completed": completed, "description": description }
    
    this.setter = obj

    return {"id" :this.#toDoList.length}
}

 remove(indexOfTodo) //remove todo from list of todos
 {
    if(indexOfTodo > (this.#toDoList.length) || indexOfTodo <= 0) return this.error("index out of range")

    this.#toDoList.splice(indexOfTodo -1, 1)
    return { "msg" :true}
 }
 
    update(index, title= undefined, completed = undefined, description = undefined) //update todo at given index
    {
        if(index > (this.#toDoList.length) || index <= 0) return this.error("index out of range")

        let changed = false
        const todo = this.get(index )
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
            this.#toDoList.splice(index -1, 1, todo )
        }
        //console.log(this.#toDoList)
        return { "msg" :true}

        
    }


    getAll() //returns all todos
    {
        //let lis = this.#toDoList
        return this.#toDoList
    }

    get(indexOfTodo) //returns todo at given index
    {
        if(indexOfTodo > (this.#toDoList.length) || indexOfTodo <= 0) return this.error("index out of range")
        
        return this.#toDoList.at(indexOfTodo -1)
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

