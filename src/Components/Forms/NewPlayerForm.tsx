"use client";
// hooks
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { useSocket } from "@/context/SocketContext";
// types
import { TPlayer } from "@/types/Types";
// components
import Button from "../Buttons/Button";
import SectionHeader from "../SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonCirclePlus } from "@fortawesome/free-solid-svg-icons";

export default function NewPlayerForm() {
  // just check if logged in as the dropdown list is restricted to only the tournaments created by the logged in user
  const { isSignedIn } = useUser();
  const { currentTournament, uniqueCategories } = useTournamentsAndQueuesContext();
  const { socket } = useSocket();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  // TODO: review the cateogries
  const [newPlayers, setNewPlayers] = useState<TPlayer>({
    names: "",
    categories: "",
    phoneNumbers: "",
  });

  const inputStyles =
    "w-full rounded focus:outline-blue focus:ring-2 focus:ring-brick-200 py-1 px-2 border-2 border-gray-300";

  // console.log("within the form ", currentTournament);
  // console.log("tournamentID: ", currentTournament?._id);
  const [customCategory, setCustomCategory] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // useEffect(() => {
  //   setSelectedCategories(currentTournament?.categories || []);
  // }, [currentTournament?.categories]);

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const category = e.target.value;
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  }

  function removeCategory(categoryToRemove: string) {
    setSelectedCategories(selectedCategories.filter((cat) => cat !== categoryToRemove));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) {
    setNewPlayers({ ...newPlayers, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("New player data: ", newPlayers);

    const incomingPhoneNumbers =
      typeof newPlayers.phoneNumbers === "string"
        ? newPlayers.phoneNumbers.split(",").map((number: string) => number.trim())
        : newPlayers.phoneNumbers;

    // data to send to backend
    const newItem = {
      tournamentId: currentTournament?._id,
      names: newPlayers.names,
      categories: selectedCategories,
      phoneNumbers: incomingPhoneNumbers,
    };

    // console.log("Data sent to backend: ", newItem);

    if (socket) {
      // console.log("EMITTING SOCKET EVENT FOR ADD PLAYER");
      socket.emit("addPlayer", {
        playerData: newItem,
        tournamentId: currentTournament?._id,
      });
    }

    setNewPlayers({
      names: "",
      categories: "",
      phoneNumbers: "",
    });

    setSelectedCategories([]);

    console.log("newItem", newItem);
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

  // hides the components from guests
  if (!isSignedIn) return null;

  return (
    <>
      <div className="flex items-center justify-between">
        <SectionHeader className="flex items-center justify-center gap-x-1 h-full">
          <span>Matches</span>
          <FontAwesomeIcon icon={faPersonCirclePlus} className="text-md" />
        </SectionHeader>

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 md:text-md md:px-1 py-1 px-2 rounded position-center"
        >
          {`${isExpanded ? "Hide " : "show"} form`}
        </Button>
      </div>

      {isExpanded && (
        <form
          className="flex flex-row items-center justify-around px-3 py-4 mt-2 mb-4 rounded-lg shadow-left-bottom-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label className="font-semibold text-md" htmlFor="name">
              Players
            </label>
            <input
              type="text"
              name="names"
              value={newPlayers.names}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className="font-semibold text-md" htmlFor="phoneNumbers">
              Phone Number(s)
            </label>
            <input
              type="text"
              name="phoneNumbers"
              value={newPlayers.phoneNumbers}
              onChange={handleChange}
              className={inputStyles}
            />

            <label htmlFor="categories" className="font-semibold text-md">
              Categories (doubles, A Grade, Women&apos;s)
            </label>

            <select
              name="categories"
              value=""
              onChange={handleCategoryChange}
              className="focus:outline rounded-md px-2 py-2 focus:ring-2 focus:ring-brick-200 mb-3 w-full border-2 border-gray-300"
            >
              <option value="">Select existing categories (doubles, etc)</option>
              {uniqueCategories.map((category: string, idx: number) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="font-semibold text-md" htmlFor="customCategory">
              Add Custom Category
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                name="customCategory"
                value={customCategory}
                onChange={handleCustomCategoryChange}
                className="focus:outline rounded-md px-3 py-1 focus:ring-2 focus:ring-brick-200 w-full border-2 border-gray-300"
              />
              <Button
                type="button"
                onClick={(e) => addCustomCategory(e)}
                className="bg-bluestone-200 text-shell-50 hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-1">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 bg-brick-200 text-white rounded-full text-sm font-medium"
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
            </div>

            <Button
              type="submit"
              className="mt-2 bg-bluestone-200 text-shell-50 hover:bg-tennis-100  hover:text-shell-300 hover:bg-tennis-200 py-2 px-4 rounded"
            >
              Add match
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
