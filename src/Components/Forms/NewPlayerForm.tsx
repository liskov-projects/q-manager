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
    <form
      className="flex flex-row items-center my-10 justify-between"
      onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="names"
          value={newPlayers.names}
          onChange={handleChange}
          className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
        />

        <label htmlFor="categories">Category</label>
        <input
          type="text"
          name="categories"
          value={newPlayers.categories}
          onChange={handleChange}
          className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
        />

        <label htmlFor="phoneNumbers">Phone Number</label>
        <input
          type="text"
          name="phoneNumbers"
          value={newPlayers.phoneNumbers}
          onChange={handleChange}
          className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
        />
      </div>

      <Button
        className={
          "my-8 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
        }>
        Add player
      </Button>
    </form>
  );
}
