import axios from "../axios/config";
import { AxiosProgressEvent, AxiosResponse } from "axios";

export type ProgressCallback = (event: AxiosProgressEvent) => void;

export interface ImageModel {
  name: string;
  path: string;
}

class ApiService {
  upload(
    file: File,
    name: string,
    onUploadProgress: ProgressCallback = () => {},
  ): Promise<AxiosResponse<void>> {
    const formData = new FormData();
    // It is important that file data is added last.
    // See: https://github.com/expressjs/multer/issues/322
    formData.append("name", name);
    formData.append("photo", file);
    return axios.post("/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles(): Promise<AxiosResponse<{ data: ImageModel[] }>> {
    return axios.get("/images");
  }

  imageUrlFromPath(path: string): string {
    return `${axios.getUri()}${path}`;
  }
}

export default new ApiService();
