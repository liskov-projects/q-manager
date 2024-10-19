import {useState} from "react";
// components
import Button from "../Buttons/Button";

export default function NewPlayerForm() {
  const [newPlayers, setNewPlayers] = useState({
    names: "",
    categories: [],
    phoneNumber: ""
  });

  function handleChange(e) {
    setNewPlayers({...newPlayers, [e.target.name]: e.target.value});
  }

  function handleSubmit(e) {
    e.preventDefault();

    setNewPlayers({
      names: "",
      categories: [],
      phoneNumber: ""
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

      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        value={newPlayers.phoneNumber}
        onChange={handleChange}
      />

      <Button className={"bg-red-800 my-2"}>Add player</Button>
    </form>
  );
}
