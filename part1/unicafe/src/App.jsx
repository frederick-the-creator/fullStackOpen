import { useState } from 'react'


const Header = ({text}) => <h1>{text}</h1>
const Button = ({text, onClick}) => <button onClick={onClick}>{text}</button>
const StatisticsRow = ({text, value, special}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
      <td>{special}</td>
    </tr>
  )
}

const AllStatisticsLine = ({good, neutral, bad, all, average, positive}) => {
  if (all===0) {
    return (
      <div>No feedback given</div>
    )
  }

  return(
      <table>
        <StatisticsRow text="good" value={good}/>
        <StatisticsRow text="neutral" value={neutral}/>
        <StatisticsRow text="bad" value={bad}/>
        <StatisticsRow text="all" value={all}/>
        <StatisticsRow text="average" value={average}/>
        <StatisticsRow text="positive" value={positive} special="%"/>
      </table>
    )
  }


const App = () => {
  const [good, setGood] = useState(0)
  const [bad, setBad] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleClickGood = () => {
    const updatedGood = good+1
    const updatedAll = updatedGood + neutral + bad
    const updatedAverage = (1*updatedGood + 0*neutral + -1*bad)/updatedAll
    const updatedPositive = 100*updatedGood/updatedAll
    setGood(updatedGood)
    setAll(updatedAll)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }

  const handleClickBad = () => {
    const updatedBad = bad+1
    const updatedAll = good + neutral + updatedBad
    const updatedAverage = (1*good + 0*neutral + -1*updatedBad)/updatedAll
    const updatedPositive = 100*good/updatedAll
    setBad(updatedBad)
    setAll(updatedAll)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }
  
  const handleClickNeutral = () => {
    const updatedNeutral = neutral+1
    const updatedAll = good + updatedNeutral + bad
    const updatedAverage = (1*good + 0*updatedNeutral + -1*bad)/updatedAll
    const updatedPositive = 100*good/updatedAll
    setNeutral(updatedNeutral)
    setAll(updatedAll)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }

  return (
    <div>
      <Header text='give feedback'/>
      <Button text='good' onClick={handleClickGood}/>
      <Button text='neutral' onClick={handleClickNeutral}/>
      <Button text='bad' onClick={handleClickBad}/>
      <Header text='statistics'/>
      <AllStatisticsLine good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App
