// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import AllTournamentsPage from "@/Components/Pages/AllTournamentsPage";
// import { useTournamentsAndQueuesContext } from "@/context/TournamentsAndQueuesContext.jsx";
// import "@testing-library/jest-dom";
// import { TTournament } from "@/types/Types.js";
// import { tournamentsForTests, oneTournamentForTests } from "../../data/dataForTests.js";

// // mocks the context
// jest.mock("@/context/TournamentsAndQueuesContext", () => ({
//   useTournamentsAndQueuesContext: jest.fn(),
// }));

// // makes jest recognise  what is mocked
// const mockUseTournamentsAndQueuesContext = useTournamentsAndQueuesContext as jest.Mock;

// // NOTE: do we REALLY want this beforeEach?
// describe("AllTournamentsPage", () => {
//   beforeEach(() => {
//     mockUseTournamentsAndQueuesContext.mockReturnValue({
//       tournamentsForTests,
//       fetchTournaments: jest.fn(),
//     });
//   });

//   it("renders tournament cards when tournaments are loaded", async () => {
//     // renders the component
//     render(<AllTournamentsPage />);

//     // checks if the cards are rendered
//     tournamentsForTests.forEach((tournament) => {
//       expect(screen.getByText(tournament.name)).toBeInTheDocument();
//     });

//     // additional checks below
//   });
// });
