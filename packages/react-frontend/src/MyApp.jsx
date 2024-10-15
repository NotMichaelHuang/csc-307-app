// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
	const [characters, setCharacters] = useState([]);	

	useEffect(() => {
  fetchUsers()
    .then((res) => res.json())
    .then((json) => setCharacters(json["users_list"]))
    .catch((error) => {
      console.log(error);
    });
	}, []);

	// Commincation with the Back end
	function postUser(person) {
		const promise = fetch("Http://localhost:8000/users", {
			method: "POST",
			headers: {
			"Content-Type": "application/json"
			},
			body: JSON.stringify(person)
		});

  		return promise;
	}

	function deleteUser(userId) {
		fetch(`http://localhost:8000/users/${userId}`, {
		  method: 'DELETE'
		})
		.then(response => {
		  if (response.status === 204) {
			console.log(`User with ID ${userId} deleted successfully.`);
			removeUserFromTable(userId);  // Update UI by removing the user
		  } else if (response.status === 404) {
			console.error(`User with ID ${userId} not found.`);
		  } else {
			console.error('Failed to delete the user.');
		  }
		})
		.catch(error => console.error('Error:', error));
	  }
	  
	  function removeUserFromTable(userId) {
		const userRow = document.getElementById(userId);
		if (userRow) {
		  userRow.remove();  // Remove the user row from the table
		}
	  }
	  
	function fetchUsers() {
		const promise = fetch("http://localhost:8000/users");
		return promise;
	}	

	function updateList(person) {
  	postUser(person)
    	.then(() => setCharacters([...characters, person]))
    	.catch((error) => {
      	console.log(error);
    });
	}

	function removeOneCharacter(index)
	{
		const updated = characters.filter((character, i) =>
		{
			return i !== index;
		});
		setCharacters(updated);
	}		

	return (
		<div className="container">
			<Table 
						characterData={characters} 
						removeCharacter={removeOneCharacter}
			/>
			<Form handleSubmit={updateList} />	
		</div>	
	);
}
export default MyApp;



