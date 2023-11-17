import { useCallback } from "react";
import { AxiosProgressEvent } from "axios";
import {
  ActionType,
  LifecycleStage,
  useImageUploadReducer,
} from "../reducers/ImageUpload";
import api from "../services/Api";
import sleep from "../utils/sleep";

function useImageUpload() {
  const [state, dispatch] = useImageUploadReducer();

  const setImage = useCallback((file: File) => {
    dispatch({ type: ActionType.SetFile, file });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: ActionType.Reset });
  }, []);

  const upload = async (name: string) => {
    dispatch({
      type: ActionType.UpdateLifecycleStage,
      stage: LifecycleStage.Uploading,
    });
    try {
      await api.upload(state.file!, name, (event: AxiosProgressEvent) => {
        dispatch({
          type: ActionType.UpdateUploadProgress,
          progress: event.progress || 0,
        });
      });
    } catch (error: any) {
      dispatch({
        type: ActionType.UpdateLifecycleStage,
        stage: LifecycleStage.Error,
      });
      return;
    }
    // Add a small delay for more fluid UX
    await sleep(400);

    dispatch({
      type: ActionType.UpdateLifecycleStage,
      stage: LifecycleStage.Success,
    });
  };

  return { setImage, reset, upload, ...state };
}

export { LifecycleStage, useImageUpload };
