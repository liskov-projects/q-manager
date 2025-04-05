// hooks
import { useState, useEffect } from "react";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useUser } from "@clerk/nextjs";
// types
import { TTournament } from "@/types/Types";
// components
import Button from "../Buttons/Button";
import SectionHeader from "../SectionHeader";
import { error } from "console";

// allows for partial form from existing Type
type TTournamentForm = Partial<TTournament> & {
  numberOfQueues: number | string;
  image?: string | File;
};

export default function NewTournamentForm() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newTournament, setNewTournament] = useState<TTournamentForm>({
    name: "",
    categories: [],
    adminUser: "",
    image: "",
    description: "",
    numberOfQueues: "",
  });

  // any signed in user can create a new tournamnet
  const { isSignedIn, user } = useUser();
  const { fetchTournaments, uniqueCategories } = useTournamentsAndQueuesContext();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    setSelectedCategories(newTournament?.categories || []);
  }, [newTournament?.categories]);

  // console.log(uniqueCategories);

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  function removeCategory(categoryToRemove: string) {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== categoryToRemove));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, files } = e.target;

    if (type === "file" && files && files[0]) {
      setErrorMessage("");

      const file = files[0];

      setNewTournament({
        ...newTournament,
        [name]: file,
      });

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setNewTournament({
        ...newTournament,
        [name]: type === "number" ? Number(value) : value,
      });
    }
  }

  function handleCustomCategoryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomCategory(e.target.value);
  }
  function addCustomCategory(e) {
    e.preventDefault();
    if (
      customCategory &&
      !uniqueCategories.includes(customCategory) &&
      !selectedCategories.includes(customCategory)
    ) {
      uniqueCategories.push(customCategory);
      setSelectedCategories([...selectedCategories, customCategory]);
    }
    setCustomCategory(""); // Clear input field
  }
  //
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log("handle submit tournament");

    let imageUrl = "";

    if (!newTournament.image || !(newTournament.image instanceof File)) {
      setErrorMessage("Please upload a tournament image.");
      return;
    }

    if (newTournament.image && newTournament.image instanceof File) {
      const file = newTournament.image;

      const res = await fetch(
        `/api/gcs-uploads?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
      );

      const { uploadUrl, publicUrl } = await res.json();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      imageUrl = publicUrl;
      URL.revokeObjectURL(previewUrl || "");
      setPreviewUrl(null);
    }

    // data to send to backend
    const newItem = {
      name: newTournament.name,
      categories: selectedCategories,
      adminUser: user?.id,
      image: imageUrl,
      description: newTournament.description,
      numberOfQueues: newTournament.numberOfQueues,
    };

    // console.log("Data sent to backend: ", newItem);

    try {
      const res = await fetch("/api/tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Added: ", data);
        fetchTournaments();
      } else if (res.status === 409) {
        setErrorMessage("Tournament with this name already exists");
      } else {
        console.error("Error response:", res);
        throw new Error("Error adding item, status: " + res.status);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error adding item: ", err.message);
        setErrorMessage("Error adding tournament");
      } else {
        console.error("Unknown error: ", err);
      }
    }

    setNewTournament({
      name: "",
      categories: [],
      adminUser: "",
      image: "",
      description: "",
      numberOfQueues: "",
    });
    // console.log(newTournament);
  }
  if (!isSignedIn) return null;

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <SectionHeader>Add new Tournament</SectionHeader>
      </div>

      {isExpanded && (
        <form className="flex flex-row items-center justify-around" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name">Tournament Name</label>
            <input
              type="text"
              name="name"
              value={newTournament.name}
              onChange={handleChange}
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 my-3 w-full"
            />

            <label htmlFor="image">
              Tournament Image <span className="text-brick-200">*</span>
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className={`focus:outline rounded-md px-3 py-2 focus:ring-2 my-3 w-full ${
                !newTournament.image && errorMessage
                  ? "border-2 border-brick-200"
                  : "focus:ring-brick-200"
              }`}
            />

            {previewUrl && (
              <div className="my-3">
                <p className="text-sm text-gray-600">Image Preview:</p>
                <img
                  src={previewUrl}
                  alt="Tournament Preview"
                  className="rounded-md w-48 h-32 object-cover border border-gray-300"
                />
              </div>
            )}

            {/* <label htmlFor="categories" className="text-xl">
              Categories
            </label>

            <label htmlFor="customCategory">Add Custom Category</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="customCategory"
                value={customCategory}
                onChange={handleCustomCategoryChange}
                className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 my-3 w-full"
              />
              <Button
                type="button"
                onClick={(e) => addCustomCategory(e)}
                className="bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
              >
                Add
              </Button>
            </div>

            <select
              name="categories"
              value=""
              onChange={handleCategoryChange}
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 my-3 w-full"
            >
              <option value="">Select categories (doubles, teens)</option>
              {uniqueCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className=" my-1 px-3 py-1 bg-brick-200 text-white rounded-full text-sm font-medium"
                >
                  {category}
                  <button
                    onClick={() => removeCategory(category)}
                    className="ml-2 text-sm text-white-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div> */}

            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              value={newTournament.description}
              onChange={handleChange}
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 my-3 w-full"
            />

            <label htmlFor="numberOfQueues">Number of Queues</label>
            <input
              placeholder="3"
              type="number"
              name="numberOfQueues"
              value={newTournament.numberOfQueues}
              onChange={handleChange}
              className="focus:outline rounded-md px-3 py-2 focus:ring-2 focus:ring-brick-200 my-3 w-full"
            />
            <Button className="self-center my-6 bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded">
              Add the Tournament!
            </Button>
            {errorMessage && (
              <span className="text-brick-200 text-center text-xl">{errorMessage}</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
