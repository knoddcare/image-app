import "./App.css";
import Upload from "./components/Upload";

export const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploading App</h1>
      </header>
      <main>
        <Upload />
      </main>
    </div>
  );
};
