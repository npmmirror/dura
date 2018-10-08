import React from 'react'
import enhance from 'c'
import './hello.css'

interface User {
    name: string;
    age: number

}

class Student implements User {
    age: number;
    name: string;

    constructor() {
        this.name = "张三";
        this.age = 12;
    }
}


const Hello = () => <div class="hello">hello</div>


console.log(enhance(new Student().name))
console.log(VERSION)
