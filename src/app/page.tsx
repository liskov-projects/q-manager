"use client";
// context
import {AppProvider} from "@/context/AppContext";
// components
import Header from "@/components/Header";
import SectionHeader from "@/components/SectionHeader";
// NEW:
import NewPlayerForm from "@/components/Forms/NewPlayerForm";
import PlayersList from "@/components/PlayersList";
import QueuesContainer from "@/Components/Queue/QueuesContainer";
import ProcessedPlayers from "@/components/ProcessedPlayers";
import ButtonGroup from "@/components/Buttons/ButtonGroup";
// dummy
// import Players from "@/Components/Players";

const App = () => {
  return (
    <AppProvider>
      <Header />
      <div className="flex flex-row justify-around">
        <div className="p-2 w-1/4">
          <SectionHeader>Add new Players</SectionHeader>
          <NewPlayerForm />

          <SectionHeader>Unprocessed Players</SectionHeader>
          <PlayersList />
          {/* FIXME: trying to make one component for both players groups
          to do drag n drop */}
          {/* <Players /> */}
        </div>

        <div className="p-2 w-2/4">
          <SectionHeader>Queues</SectionHeader>
          <QueuesContainer />
        </div>

        <div className="p-2 w-1/4">
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
