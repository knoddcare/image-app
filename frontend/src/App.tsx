import "./App.css";
import ImageUpload from "./components/ImageUpload";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <main className="app">
      <h1>Image Uploading App</h1>
      <ImageUpload />
      <Toaster toastOptions={{ className: "toaster" }} />
    </main>
  );
}

export default App;
