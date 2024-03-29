import React, {useState} from 'react'
import heapsPermute from '../heapalgo.js'
import {Link} from 'react-router-dom'
import DisplayPerm from './DisplayPerm.js'
import Swal from 'sweetalert2'
import building from './images/vector-cartoon-seafront.jpg'

export default function HardPuzzle() {
    
    const [permutations, setPermutations] = useState(heapsPermute(['a', 'b', 'c', 'd', 'e', 'f']).map(a => a.join('')))
    
    const [testPermutations, setTestPermutations] = useState(heapsPermute(['a', 'b', 'c', 'd', 'e', 'f']).map(a => a.join('')))
    const [showSave, setShowSave] = useState(false)
    
    const [savedClues, setSavedClues] = useState([])
    let initialState = {subject:'placeholder', modifier:'placeholder', relationship:'placeholder', object:'placeholder'}
    const [clueConditions, setClueConditions] = useState(initialState)
    const [clueText, setClueText] = useState(initialState)
    let clue = `${clueText.subject}` + ' ' + `${clueText.modifier}` + ' ' + `${clueText.relationship}` + ' ' + `${clueText.object}`

    let filterPermutations = function(e, fun){
        e.preventDefault()
        let filteredArray = permutations.filter(str =>fun(str))
        setTestPermutations(filteredArray)
        setShowSave(!showSave)

    }

    function saveClue(newClue){
        if(testPermutations.length !== permutations.length){
        let updatedArray = [...testPermutations]
        setPermutations(updatedArray)
        setSavedClues([...savedClues, newClue])
        setClueConditions(initialState)
        setShowSave(false)}
        else{Swal.fire({
            icon: 'warning',
            title: 'Clue Not Saved',
            text: 'That clue is redundant',
            color: '#FFC107',
            confirmButtonColor: '#FFC107',
          background: '#0D6EFD'
          })
          handleReset()}
          
    }


    function savePuzzle() {
    let token = localStorage.getItem("token");
    fetch('/puzzles', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({difficulty: '3', clues: savedClues, solution: permutations[0]}),
        })
        .then((response) => response.json())
        .then((data) => {
        console.log('Success:', data);
        })
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your puzzle has been created!',
            color: '#FFC107',
            confirmButtonColor: '#FFC107',
          background: '#0D6EFD'
          })
    }


    function handleChange(e) {
        let {name, value} = e.target
        let index = e.nativeEvent.target.selectedIndex
        setClueConditions({...clueConditions, [name]:value})
        setClueText({...clueText, [name]:e.nativeEvent.target[index].text})
        
    }

    function handleReset(){
        setClueConditions(initialState)
        setTestPermutations([...permutations])
        setShowSave(!showSave)
    }
    
    let generateFilter  = function(string){
        if ((clueConditions.relationship === '>' || clueConditions.relationship === '<') && (clueConditions.object === '0' || clueConditions.object === '1' || clueConditions.object === '2' || clueConditions.object === '3' || clueConditions.object === '4' || clueConditions.object === '5' )){
            if (clueConditions.modifier === ''){
                return (eval(string.indexOf(clueConditions.subject) + clueConditions.relationship + clueConditions.object))}
            else {return !(eval(string.indexOf(clueConditions.subject) + clueConditions.relationship + clueConditions.object))}
        }
        else if (clueConditions.relationship === '>' || clueConditions.relationship === '<'){
            if (clueConditions.modifier === ''){
                return (eval(string.indexOf(clueConditions.subject) + clueConditions.relationship + string.indexOf(clueConditions.object)))}
            else {return !(eval(string.indexOf(clueConditions.subject) + clueConditions.relationship + string.indexOf(clueConditions.object)))}}
        else if (clueConditions.relationship === '==='){
            if (clueConditions.modifier === ''){
                return (eval(string.indexOf(clueConditions.subject) + clueConditions.relationship + clueConditions.object))}
            else {return !(eval(string.indexOf(clueConditions.subject) + clueConditions.relationship + clueConditions.object))}
        }
        else {
            if (clueConditions.modifier === ''){
                return (eval(string.indexOf(clueConditions.subject) +'==='+ (string.indexOf(clueConditions.object)+clueConditions.relationship)))}
            else {return !(eval(string.indexOf(clueConditions.subject) +'==='+ (string.indexOf(clueConditions.object)+clueConditions.relationship)))}
        }
    }

    
  return (
    <div>
         <img className='solve-bg' src = {building}/>
        <div className='instructions'><p>6 Neighbors each live on a different floor of a 6 story building.</p>
        <p>Use the dropdowns to make clues until your puzzle has only 1 possible solution!</p></div>
    <div className='create-puzz-wrapper'>
        
        <div className='tracker-wrapper'>
        <div className='permtracker'>
        {testPermutations.length > 10 && <h3>Your puzzle currently has {testPermutations.length} possible solutions</h3>}
        {(testPermutations.length <=10 && testPermutations.length >0) && testPermutations.map(perm=> <DisplayPerm perm = {perm}/>)}
        {testPermutations.length === 0 && <h3>Invalid clue.  Your puzzle must have a solution.</h3>}
        </div>
        <form onSubmit = {(e)=>filterPermutations(e, generateFilter)}>
            <select name = 'subject' onChange = {handleChange} value = {clueConditions.subject} disabled = {showSave?true:false}>
                <option>--select a person--</option>
                <option value = 'a'>Alex</option>
                <option value = 'b'>Bobby</option>
                <option value = 'c'>Casey</option>
                <option value = 'd'>Devin</option>
                <option value = 'e'>Ernie</option>
                <option value = 'f'>Frankie</option>
            </select>
            {clueConditions.subject !== 'placeholder' &&
            <select name = 'modifier' onChange = {handleChange} value = {clueConditions.modifier} disabled = {showSave?true:false}>
                <option>--select a modifier--</option>
                <option value = "">lives</option>
                <option value = "!">does not live</option>
            </select>}
            {clueConditions.modifier !== 'placeholder' &&
            <select name = 'relationship' onChange = {handleChange} value = {clueConditions.relationship} disabled = {showSave?true:false}>
                <option>--select a relationship--</option>
                <option value = '==='>on</option>
                <option value = '>'>above</option>
                <option value = '<'>below</option>
                <option value = '+1'>directly above</option>
                <option value = '-1'>directly below</option>
                <option value = '+2'>2 floors above</option>
                <option value = '-2'>2 floors below</option>
                <option value = '+3'>3 floors above</option>
                <option value = '-3'>3 floors below</option>
                <option value = '+4'>4 floors above</option>
                <option value = '-4'>4 floors below</option>
                <option value = '+5'>5 floors above</option>
                <option value = '-5'>5 floors below</option>
            </select>}
            {clueConditions.relationship==='==='&&
            <select name = 'object' onChange = {handleChange} value = {clueConditions.object} disabled = {showSave?true:false}>
                <option>--select a floor--</option>
                <option value = '0'>the first floor</option>
                <option value = '1'>the second floor</option>
                <option value = '2'>the third floor</option>
                <option value = '3'>the fourth floor</option>
                <option value = '4'>the fifth floor</option>
                <option value = '5'>the sixth floor</option>
            </select>}
            {(clueConditions.relationship === '>' || clueConditions.relationship === '<') &&
            <select name = 'object' onChange = {handleChange} value = {clueConditions.object} disabled = {showSave?true:false}>
                <option>--select a person or floor--</option>
                <option value = 'a'>Alex</option>
                <option value = 'b'>Bobby</option>
                <option value = 'c'>Casey</option>
                <option value = 'd'>Devin</option>
                <option value = 'e'>Ernie</option>
                <option value = 'f'>Frankie</option>
                <option value = '0'>the first floor</option>
                <option value = '1'>the second floor</option>
                <option value = '2'>the third floor</option>
                <option value = '3'>the fourth floor</option>
                <option value = '4'>the fifth floor</option>
                <option value = '5'>the sixth floor</option>
            </select>}
            {(clueConditions.relationship === '+1' || clueConditions.relationship === "+2" || clueConditions.relationship === "+3" || clueConditions.relationship === "+4" || clueConditions.relationship === "+5" || clueConditions.relationship === "-1" || clueConditions.relationship === "-2" || clueConditions.relationship === "-3" || clueConditions.relationship === "-4" || clueConditions.relationship === "-5") &&
            <select name = 'object' onChange = {handleChange} value = {clueConditions.object} disabled = {showSave?true:false}> 
                <option>--select a person--</option>
                <option value = 'a'>Alex</option>
                <option value = 'b'>Bobbie</option>
                <option value = 'c'>Casey</option>
                <option value = 'd'>Devin</option>
                <option value = 'e'>Ernie</option>
                <option value = 'f'>Frankie</option>
            </select>}
            {!showSave &&<button type = 'submit'>Test your Clue</button>}
        </form>
        
        {showSave && <>
        <button onClick={()=>saveClue(clue)} disabled = {testPermutations.length===0?true:false}>Save Clue</button>
        <button onClick={handleReset}>Reset</button>
        </>}
        </div>
        <div className='clue-wrapper'>
        <h4>Clues:</h4>
        <ol className='cluelist'>
        {savedClues.map(clue=><li>{clue}</li>)}
        </ol>
        {permutations.length > 1? <p>Your puzzle is not yet valid... Add another clue!</p>:<Link to='/'><button onClick = {savePuzzle}>Save your puzzle!</button></Link>}
        </div>
    </div>
    </div>
  )
}
