import { QueryClient, QueryClientProvider } from "react-query";
import DisplayData from "./components/DisplayData"

function App() {


  const queryClient = new QueryClient();


  return (
    <QueryClientProvider client={queryClient}>
      <DisplayData />
    </QueryClientProvider>
  );
}

export default App
