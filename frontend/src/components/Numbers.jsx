import PersonNumber from './PersonNumber'

const Numbers = ({ persons, deletePerson }) => {
  console.log('Numbers:', persons)
  return (
    <div>
      {persons.map(item =>
        <PersonNumber 
          key={item.name} 
          person={item} 
          deletePerson={() => deletePerson(item)}
        />
      )}
    </div>
  )
}

export default Numbers

