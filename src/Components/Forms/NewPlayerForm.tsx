import {useState} from "react";
// components
import Button from "../Buttons/Button";

export default function NewPlayerForm() {
  const [newPlayers, setNewPlayers] = useState({
    names: "",
    categories: [],
    phoneNumbers: ""
  });

  function handleChange(e) {
    setNewPlayers({...newPlayers, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // data to send to backend
    const newItem = {
      names: newPlayers.names,
      categories: [newPlayers.categories],
      phoneNumbers: [newPlayers.phoneNumbers]
    };

    // POST to api | REVIEW: check endpoint
    const res = await fetch("@/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newItem)
    });

    // check response code
    if (res.ok) {
      const data = await res.json();
      console.log("Added: ", data);
    } else {
      throw new Error("Error adding item");
    }

    // ressetting the form
    setNewPlayers({
      names: "",
      categories: [],
      phoneNumbers: ""
    });
    console.log(newPlayers);
  }

  return (
    <form className="bg-blue-300 flex flex-col items-center" onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="names"
        value={newPlayers.names}
        onChange={handleChange}
      />

      <label htmlFor="categories">Category</label>
      <input
        type="text"
        name="categories"
        value={newPlayers.categories}
        onChange={handleChange}
      />

      <label htmlFor="phoneNumbers">Phone Number</label>
      <input
        type="text"
        name="phoneNumbers"
        value={newPlayers.phoneNumbers}
        onChange={handleChange}
      />

      <Button className={"bg-red-800 my-2"}>Add player</Button>
    </form>
  );
}
