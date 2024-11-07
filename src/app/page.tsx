"use client";
// context
import {AppProvider} from "@/Context/AppContext";
// components
import Header from "@/Components/Header";
import SectionHeader from "@/Components/SectionHeader";
// NEW:
import NewPlayerForm from "@/Components/Forms/NewPlayerForm";
import PlayersList from "@/Components/PlayersList";
import QueuesGrid from "@/Components/Queue/QueuesGrid";
import ProcessedPlayers from "@/Components/ProcessedPlayers";
import ButtonGroup from "@/Components/Buttons/ButtonGroup";
// dummy
// import Players from "@/Components/Players";

const App = () => {
  return (
    <AppProvider>
      <Header />
      <div className="flex flex-row justify-around">
        <div className="p-4 w-1/4">
          <SectionHeader>Add new Players</SectionHeader>
          <NewPlayerForm />

          <SectionHeader>Unprocessed Players</SectionHeader>
          <PlayersList />
          {/* FIXME: trying to make one component for both players groups
          to do drag n drop */}
          {/* <Players /> */}
        </div>

        <div className="p-4 w-2/4">
          <SectionHeader>Queues</SectionHeader>
          <QueuesGrid />
        </div>

        <div className="p-4 w-1/4">
          <SectionHeader>Button Group</SectionHeader>
          <ButtonGroup />
          {/* NEW: */}
          <SectionHeader>Processed Players</SectionHeader>
          <ProcessedPlayers />
          {/* FIXME: trying to make one component for both players groups
          to do drag n drop */}
          {/* <Players /> */}
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
