import "./App.css";
import { ModalProvider } from "./context/warningModal";
import FileUpload from "./components/fileUpload";
function App() {
  return (
    <ModalProvider>
      <div className="App">
        <header className="App-header">
          <h1>Image Uploading App</h1>
          <FileUpload />
        </header>
      </div>
    </ModalProvider>
  );
}

export default App;
