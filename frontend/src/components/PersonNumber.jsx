const PersonNumber = ({ person, deletePerson }) => {
    return (
      <p>
        &mdash; {person.name} {person.number} 
        <button onClick={deletePerson}>delete</button>
      </p>
    )
  }

export default PersonNumber