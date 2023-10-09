import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Person from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personServices from "./services/phonebook"

const App = () => {
  // Defindin states
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [alert, setAlert] = useState(null)
  const [filtered, setFiltered] = useState("")

  // Load the inital data from the database
  useEffect(() => {
    personServices
      .getAll()
      .then(initialContacts => setPersons(initialContacts))
  }, [])

  // Function to add new person to the list
  const addNewPerson = (event) => {
    // Prevents the page reload
    event.preventDefault()

    // Creating the person object to add to list
    const personObject = {
      name: newName,
      number: newNumber
    }

    // Check if the name entered already exist
    const nameExists = persons.some((person) => person.name == newName)

    // If name exists, then ask the user if they want to update the number for the person
    if (nameExists) {
      const confirm = window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)
      if (confirm) {
        // Get the matching person's object
        const matchingPerson = persons.find(person => person.name == newName)
        // Update the number
        const updatedObj = {...matchingPerson, number: newNumber}
        // Update the number in the server
        personServices.updateNumber(updatedObj.id, updatedObj)
          .then(returnedPerson => 
            // Display the updated phonebook
            setPersons(persons.map(p => p.id === matchingPerson.id ? returnedPerson : p))
          )
          .catch(error =>  {
            // If name has already been deleted from the server then alert the user
            setAlert(`${matchingPerson.name} has already been deleted from the server`)
            setTimeout(() => {
              setAlert(null)
            }, 5000);
            // Remove the person from the phonebook
            setPersons(persons.filter(p => p.id != matchingPerson.id))
          }
            )
      } else {
        console.log("No changes made.")
      }
    } else {
      // Add new contacts in the server and alert the user
      setTimeout(() => {
        setAlert(null)
      }, 5000);
      setAlert(`${personObject.name} added to the list`)
      personServices.addPerson(personObject)
      setPersons(persons.concat(personObject))
      setNewName("")
    }
    }
  
  // Update name in the state
  const handleInputName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  // Update numnber in the state
  const handleInputNumber = (event) => {
    setNewNumber(event.target.value)
  }

  // Delete user from the server using the id
  const handleDelete = (id) => {
    // Get the object from the the list
    const match = persons.find(person => id === person.id)
    // Ask for confirmation
    const confirm = window.confirm(`Delete ${match.name}?`)

    if (confirm) {
      // Remove the person from the server
      personServices.deletePerson(match.id)
      .then(() => console.log(console.log(`${match.name} has been deleted from the server`)))
      .catch(error =>  {
        // Alert the user if the name has already been deleted from the server
        setAlert(`${match.name} has already been deleted from the server`)
        setTimeout(() => {
          setAlert(null)
        }, 5000);
      })
      console.log(`'${match.name}' removed from the list.`)
      // Update the state
      setPersons((persons.filter(p => p.id != match.id)))
    } else {
      console.log("No changes made.")
    }
  }

  const handleSearch = (event) => {
    // Assuming you have state variables: persons, setPersons, and filtered, setFiltered
    const searchValue = event.target.value;
    if (searchValue == "") {
      personServices
      .getAll()
      .then(initialContacts => setPersons(initialContacts))
    } else {
        setFiltered(searchValue);
        const regex = new RegExp(searchValue, 'i');
        const filteredPersons = persons.filter((person) => regex.test(person.name));
        setPersons(filteredPersons);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter onChange={handleSearch}/>

      <Notification message={alert}/>

      <PersonForm handleInputName={handleInputName} handleInputNumber={handleInputNumber} addNewPerson={addNewPerson}/>
      
      <h2>Numbers</h2>

      {persons.map(person => (
          <Person 
            key={person.id} 
            person={person} 
            handleClick={() => handleDelete(person.id)}
          />
      ))}
    </div>
  )
}

export default App