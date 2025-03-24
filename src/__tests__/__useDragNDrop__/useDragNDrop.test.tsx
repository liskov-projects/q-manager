import { renderHook, act } from "@testing-library/react";
import useDragNDrop from "@/hooks/useDragNDrop";
import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext";
import { oneItemForTests, oneTournamentForTests } from "@/data/dataForTests.js";
import { TTournament } from "@/types/Types.js";

jest.mock("@/context/TournamentsAndQueuesContext"); //to avoid the real implementation

describe("testing useDragNDrop", () => {
  let setCurrentTournament: jest.Mock;
  let currentTournamentRef: { current: TTournament };

  beforeEach(() => {
    setCurrentTournament = jest.fn(); //replaces the real setter
    currentTournamentRef = { current: oneTournamentForTests }; //sets the testData
    // supposed to ensure the test doesn't depend on the real context
    (useTournamentsAndQueuesContext as jest.Mock).mockReturnValue({
      setCurrentTournament,
      currentTournamentRef,
    });
  });

  //
  test("removes dragged item from all lists", async () => {
    const { result } = renderHook(() => useDragNDrop()); // initialises the hook

    act(() => {
      result.current.handleDrop(oneItemForTests, 0, "processed");
    }); //simulates the method, dropping the item into "processed"

    // waits for the state to change
    await new Promise(setImmediate);
    // check that the tournament has been set with the appropriate update
    expect(setCurrentTournament).toHaveBeenCalledWith(
      expect.objectContaining({
        unProcessedQItems: [],
        processedQItems: expect.arrayContaining([oneItemForTests]),
      })
    );
  });

  //
  test("adds dragged item to correct queue", async () => {
    const { result } = renderHook(() => useDragNDrop());

    act(() => {
      result.current.handleDrop(oneItemForTests, 0, "q1");
    });

    await new Promise(setImmediate);
    expect(setCurrentTournament).toHaveBeenCalledWith(
      expect.objectContaining({
        queues: expect.arrayContaining([
          expect.objectContaining({
            _id: "q1",
            queueItems: expect.arrayContaining([oneItemForTests]),
          }),
        ]),
      })
    );
  });
});
