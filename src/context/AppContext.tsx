import {QueuesProvider} from "./QueuesContext";
import {TournamentProvider} from "./TournamentContext";
import {combineComponents} from "./combineProviders";
// List of context providers
const providers = [QueuesProvider, TournamentProvider];

// Combine them into one provider
export const AppContextProvider = combineComponents(...providers);

// // Now you can wrap your app with AppContextProvider
// const App = () => {
//   return <AppContextProvider>{/* Your app components */}</AppContextProvider>;
// };

// export default App;
