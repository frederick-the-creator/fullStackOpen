import { useState } from 'react'


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVote] = useState(new Uint8Array(anecdotes.length))

  const handleRandomise = () => {
    const i = Math.floor(Math.random() * anecdotes.length)
    setSelected(i)
  }

  const handleVote = () => {
    let newVotes = [...votes]
    newVotes[selected]+=1
    setVote(newVotes)
  }

  const maxIndex = votes.reduce(
  (maxIdx, current, idx, arr) => current > arr[maxIdx] ? idx : maxIdx,
  0
);

  return (
    <div>
      <h1>Annecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleRandomise}>next anecdote</button>
      <h1>Annecdote with most votes</h1>
      <div>{anecdotes[maxIndex]}</div>
      <div>has {votes[maxIndex]} votes</div>
    </div>
  )
}

export default App