import { useReducer } from "react";

export enum LifecycleStage {
  SelectFile = "STAGE_SELECT_FILE",
  InputName = "STAGE_INPUT_NAME",
  Uploading = "STAGE_UPLOADING",
  Success = "STAGE_SUCCESS",
  Error = "STAGE_ERROR",
}

export enum ActionType {
  UpdateLifecycleStage = "ACTION_UPDATE_LIFECYCLE_STAGE",
  UpdateUploadProgress = "ACTION_UPDATE_UPLOAD_PROGRESS",
  SetFile = "ACTION_SET_FILE",
  Reset = "ACTION_RESET",
}

type ImageUploadAction =
  | { type: ActionType.UpdateLifecycleStage; stage: LifecycleStage }
  | { type: ActionType.UpdateUploadProgress; progress: number }
  | { type: ActionType.SetFile; file: File }
  | { type: ActionType.Reset };

type ImageUploadState = {
  file: File | null;
  imageUrl: string;
  uploadProgress: number;
  lifecycleStage: LifecycleStage;
};

const initialImageUploadState = {
  file: null,
  imageUrl: "",
  uploadProgress: 0,
  lifecycleStage: LifecycleStage.SelectFile,
};

function imageUploadReducer(
  state: ImageUploadState,
  action: ImageUploadAction,
): ImageUploadState {
  switch (action.type) {
    case ActionType.UpdateLifecycleStage:
      return { ...state, lifecycleStage: action.stage };
    case ActionType.UpdateUploadProgress:
      return { ...state, uploadProgress: action.progress };
    case ActionType.SetFile:
      const imageUrl =
        action.file === null ? "" : URL.createObjectURL(action.file!);
      return {
        ...state,
        file: action.file,
        imageUrl,
        lifecycleStage: LifecycleStage.InputName,
      };
    case ActionType.Reset:
      return initialImageUploadState;
  }
}

export const useImageUploadReducer = () =>
  useReducer(imageUploadReducer, initialImageUploadState);
