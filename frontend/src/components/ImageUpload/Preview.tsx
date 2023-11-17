import { FormEvent } from "react";
import { ChangeEvent, useEffect, useState } from "react";

export interface PreviewProps {
  imageUrl: string;
  onCancel: () => void;
  onUpload: (name: string) => void;
}

function Preview({ imageUrl, onCancel, onUpload }: PreviewProps) {
  const [imageName, setImageName] = useState("");
  const [nameIsValid, setNameIsValid] = useState(false);
  const [isFresh, setIsFresh] = useState(true);

  const handleInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setImageName(target.value);
  };

  const handleUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nameIsValid) {
      onUpload(imageName);
    }
    setIsFresh(false);
  };

  useEffect(() => {
    setNameIsValid(imageName.length >= 3);
  }, [imageName]);

  return (
    <div className="image-preview">
      <div
        className="photo"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <form onSubmit={handleUpload}>
        <div className="name-input">
          <label>Name</label>
          <input
            type="text"
            placeholder="A picturesque name for your photo"
            onChange={handleInput}
            value={imageName}
            className={!isFresh && !nameIsValid ? "error" : ""}
          />
          {!isFresh && !nameIsValid && (
            <div>
              <p className="error-msg">
                The name must be at least 3 characters long
              </p>
            </div>
          )}
        </div>
        <div className="button-group">
          <div>
            <button type="button" className="secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
          <div>
            <button type="submit" disabled={!isFresh && !nameIsValid}>
              Upload
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Preview;
