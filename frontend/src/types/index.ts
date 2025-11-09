export type baseInputProps = {
  name: string;
  label: string;
  required?: boolean;
}

export type textFieldProps = baseInputProps & {
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type fileProps = baseInputProps & {
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}