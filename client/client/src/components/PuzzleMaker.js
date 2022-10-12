import React, {useState} from 'react'
import heapsPermute from '../heapalgo.js'
import EasyForm from './EasyForm.js'

export default function PuzzleMaker() {
    let initialState = {difficulty:'', solution: '', user_id: ''}
    const [permutations, setPermutations] = useState([])
    const [newPuzzle, setNewPuzzle] = useState(initialState)

    function handleDifficultyChange() {
        if (newPuzzle.difficulty === "1"){
            setPermutations(heapsPermute(['a', 'b', 'c', 'd']).map(a => a.join(' ')))
        }
        else if (newPuzzle.difficulty === "2"){
            setPermutations(heapsPermute(['a', 'b', 'c', 'd', 'e']).map(a => a.join(' ')))
        }
        else if (newPuzzle.difficulty === "3") {
            setPermutations(heapsPermute(['a', 'b', 'c', 'd', 'e', 'f']).map(a => a.join(' ')))
        }
        else {setPermutations([])}
    }
  return (
    <div>
        <form>
            <select onChange = {handleDifficultyChange} value = {newPuzzle.difficulty} name = 'difficulty'>
                <option>1</option>
                <option>2</option>
                <option>3</option>
            </select>
            {<EasyForm/>}
        </form>

    </div>
  )
}
