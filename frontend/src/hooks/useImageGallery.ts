import { useState, useCallback } from "react";
import api from "../services/Api";
import sleep from "../utils/sleep";
import type { Image } from "react-grid-gallery";

function useImageGallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  const fetchImages = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data } = await api.getFiles();
      setImages(
        data.data.map(({ path }) => ({
          src: api.imageUrlFromPath(path),
          width: 200,
          height: 200,
        })),
      );
      // Add a small delay for more fluid UX
      await sleep(300);
      setError(false);
    } catch (error: any) {
      setError(true);
    }
    setIsFetching(false);
  }, []);

  return { images, fetchImages, isFetching, error };
}

export { useImageGallery };
