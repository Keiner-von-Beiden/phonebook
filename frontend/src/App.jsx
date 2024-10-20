import { useState, useEffect } from 'react'
import axios from 'axios'

import personService from './services/persons'
import Numbers from './components/Numbers'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService.getAll()
      .then(response => {
        console.log('request for getting all persons')
        setPersons(response.data)
      })
  }, [])
  console.log('There are', persons.length, 'persons rendered from the phonebook')

  const addName = (event) => {
    event.preventDefault()

    const nameObject = {
      name: newName,
      number: newNumber
    }

    persons.some((item) => item.name === nameObject.name)
      ? alert(`${nameObject.name} is already added to the phonebook`)
      : personService
          .create(nameObject)
          .then(response => {
            setNotificationMessage(`${response.data.name} has been added to the phonebook`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
            setPersons(persons.concat(response.data))
          })
    
    setNewName('')
    setNewNumber('')
      
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  } 

  const deleteThisPerson = (person) => {
    console.log(`${person.name} is going to be deleted`)
    
    return (
      window.confirm(`Do you really want to delete ${person.name}'s data?`)
        ? personService
          .remove(person.id)
          .then(response => {
            setPersons(persons.filter(item => item.id !== person.id))
            setNotificationMessage(`The entry has been successfully deleted`) // was ${response.data.name} which didn't work 
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
        : (() => {
            setNotificationMessage(`${person.name} has been left in the list`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })()
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} />

      <h2>Phonebook</h2>
      <PersonForm 
        add={addName} 
        handleName={handleNameChange} 
        handleNumber={handleNumberChange} 
        newName={newName}
        newNumber={newNumber}
      />

      <h3>Numbers</h3>
      <Numbers persons={persons} deletePerson={deleteThisPerson}/>
    </div>
  )
}

export default App