import "./App.css";
import ImageGallery from "./components/ImageGallery";
import ImageUpload from "./components/ImageUpload";
import { Toaster } from "react-hot-toast";
import { useImageGallery } from "./hooks/useImageGallery";
import { useEffect } from "react";

function App() {
  const imageGallery = useImageGallery();

  useEffect(() => {
    imageGallery.fetchImages();
  }, []);

  return (
    <main className="app">
      <h1>Image Uploading App</h1>
      <ImageUpload onSuccess={imageGallery.fetchImages} />
      <ImageGallery {...imageGallery} />
      <Toaster toastOptions={{ className: "toaster" }} />
    </main>
  );
}

export default App;
