import {useState} from "react";
// components
import {TTournament} from "@/types/Types";
import Button from "../Buttons/Button";
import SectionHeader from "../SectionHeader";
import {useUser} from "@clerk/nextjs";
// import ImageUpload from "../drafts/ImageUpload";

// allows for partial form from existing Type
type TTournamentForm = Partial<TTournament> & {
  numberOfQueues: number;
};

export default function NewTournamentForm() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [newTournament, setNewTournament] = useState<TTournamentForm>({
    name: "",
    categories: [],
    adminUser: "",
    image: "",
    description: "",
    numberOfQueues: 0
  });

  // any signed in user can create a new tournamnet
  const {isSignedIn, user} = useUser();

  // reacts to different inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const {name, value, type, files} = e.target;

    setNewTournament({
      ...newTournament,
      [name]:
        type === "file" && files
          ? files[0]
          : type === "number"
          ? Number(value)
          : value
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("handle submit");
    // FIXME: should be made at the tournament level
    const incomingCategories =
      typeof newTournament.categories === "string"
        ? newTournament.categories.split(",").map(category => category.trim())
        : newTournament.categories;

    // data to send to backend
    const newItem = {
      name: newTournament.name,
      categories: incomingCategories,
      adminUser: user?.id,
      image: newTournament.image,
      description: newTournament.description,
      numberOfQueues: newTournament.numberOfQueues
    };
    // WORKS: as expected
    // console.log("Data sent to backend: ", newItem);

    try {
      const res = await fetch("/api/tournament", {
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
        console.error("Error response:", res);
        throw new Error("Error adding item, status: " + res.status);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error adding item: ", err.message);
      } else {
        console.error("Unknown error: ", err);
      }
    }

    //FIXME: ressetting the form
    // setNewTournament({
    //   name: "",
    //   categories: [],
    //   adminUser: "",
    //   image: "",
    //   description: "",
    //   numberOfQueues: 0
    // });
    // console.log(newTournament);
  }
  if (!isSignedIn) return null;

  return (
    <>
      <div className="flex flex-col justify-center items-center my-4">
        <SectionHeader>Add new Tournament</SectionHeader>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-6 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded position-center">
          {`${isExpanded ? "hide " : "show"} the form`}
        </Button>
      </div>

      {isExpanded && (
        <form
          className="flex flex-row items-center my-10 justify-around"
          onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name">Tournament Name</label>
            <input
              type="text"
              name="name"
              value={newTournament.name}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="categories">Categories</label>
            <input
              type="text"
              name="categories"
              value={newTournament.categories}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            {/* <label htmlFor="adminUser">Admin User</label>
            <input
              type="text"
              name="adminUser"
              value={newTournament.adminUser}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            /> */}
            {/* FIXME: S3 troubles - implement this later */}
            {/* <label htmlFor="image">Image</label>
            <ImageUpload /> */}
            {/* <input
              type="file"
              name="image"
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            /> */}

            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              value={newTournament.description}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />

            <label htmlFor="numberOfQueues">Number of Queues</label>
            <input
              type="number"
              name="numberOfQueues"
              value={newTournament.numberOfQueues}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            />
            {/* REVIEW: find how to later */}
            {/* <label htmlFor="players">Upload Players</label>
            <input
              type="file"
              accept=".csv"
              name="players"
              value={newTournament.players}
              onChange={handleChange}
              className="rounded focus:outline-none focus:ring-2 focus:ring-brick-200"
            /> */}
            <Button className="self-center my-6 bg-brick-200 text-shell-100 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded">
              Add the Tournament!
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
