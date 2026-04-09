import { FileProvider } from "./context/FileContext";

export default function UpskillingLayout({ children }) {
  return <FileProvider>{children}</FileProvider>;
}