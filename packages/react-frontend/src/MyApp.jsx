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
    			.catch((error) => {console.log(error);}
			);
		}, []
	);

	// Communication with the Back end
	async function postUser(person) {
		try {
		const response = await fetch("http://localhost:8000/users", {
			method: "POST",
			headers: {
			"Content-Type": "application/json",
			},
			body: JSON.stringify(person),
		});
	
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
	
		const newUser = await response.json(); // Extract the created user object
		console.log("User created:", newUser); // Debugging: View the new user
	
		return newUser; // Return the new user to update frontend state
		} 
		catch (error) {
			console.error("Failed to post user:", error);
			return null; // Handle failure gracefully
		}
	}	

	function deleteUser(userId) {
		fetch(`http://localhost:8000/users/${userId}`, {
		  method: "DELETE",
		})
		  .then(response => {
			if (response.ok) {
			  console.log(`User with ID ${userId} deleted successfully`);
			  // Remove user from frontend state
			  users = users.filter(user => user.id !== userId);
			}
		  })
		  .catch(error => console.error("Failed to delete user:", error));
	}		
	  
	function fetchUsers() {
		const promise = fetch("http://localhost:8000/users");
		return promise;
	}	

	function updateList(person) {
  		postUser(person)
    		.then(() => setCharacters([...characters, person]))
    		.catch((error) => {console.log(error);}
		);
	}

	function removeOneCharacter(index) {
		// 1. Filter out the character at the given index
		const updated = characters.filter((_, i) => i !== index);
	  
		// 2. Set the new characters list
		setCharacters(updated);
	  
		// 3. Get the ID of the character to delete (use the original list before filtering)
		const characterToRemove = characters[index];
		if (characterToRemove && characterToRemove._id) {
		  deleteUser(characterToRemove._id); // Call deleteUser with the correct ID
		}
		  
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



