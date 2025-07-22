const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    <Part parts={parts} />
  </div>
)

const Part = ({parts}) => (
  parts.map(x => <p key={x.id}>{x.name} {x.exercises}</p>)
)

const Total = ({parts}) => {

  const total = parts.reduce((sum, part) => {
    return sum + part.exercises
  },0)

  return (
  <p><strong>total of {total} exercises</strong></p>
  )
}

const Courses = ({courses}) => (
  courses.map(x => (
    <div key={x.id}>
      <Header course={x.name} />
      <Content parts={x.parts} />
      <Total parts={x.parts} />
    </div>
    )
  )
)

export default Courses