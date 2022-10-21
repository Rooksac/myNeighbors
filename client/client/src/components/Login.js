import React from 'react'
import SignUp from './SignUp'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'


export default function Login({onLogin, user}) {
    const navigate = useNavigate()
    let initialState = {name:'', password:''}
    const [userData, setUserData] = useState(initialState)
    function handleChange(e){
        let {name, value} = e.target
        setUserData({...userData, [name]:value})
    }
    function handleSubmit(e){
      e.preventDefault()
        fetch('/login', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData),
})
  .then((response) => response.json())
  .then((data) => {
    onLogin(data)
    console.log('Success:', data);
  })
  setUserData(initialState)
  navigate('/')
    }
  return (
    <div>
        <form onSubmit = {handleSubmit}>
            <input type = 'text' name = 'name' value = {userData.name} onChange = {handleChange}/>
            <input type = 'text' name = 'password' value = {userData.password} onChange = {handleChange}/>
            <button type = 'submit'>Log in</button>
        </form>
        <SignUp/>
    </div>
  )
}
