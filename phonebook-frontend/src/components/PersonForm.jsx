const PersonForm = ({handleInputName, handleInputNumber, addNewPerson}) => {
    return(
        <form onSubmit={addNewPerson}>
            <div>
            name: <input onChange={handleInputName}/>
            </div>
            <div>
            number: <input onChange={handleInputNumber}/>
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form> 
    )
}

export default PersonForm