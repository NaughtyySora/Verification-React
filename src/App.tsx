import { FormEvent } from "react";
import { Verification } from "./components/Verification/Verification";

function App() {

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const data = new FormData(e.target as HTMLFormElement);
    console.log("FromData: ", Object.fromEntries(data));
  };

  return (
    <div className="App">
      <Verification title="Verification Code: " onSubmit={onSubmit} />
    </div>
  );
}

export default App;
