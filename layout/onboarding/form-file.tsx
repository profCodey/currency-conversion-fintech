import { BinDelete, Pin } from "@/components/icons";
import { Button, FileButton } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

export function FormFile({
  docName,
  file,
  setFile,
  fileUrl,
}: {
  docName: string;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileUrl?: string;
}) {
  return (
    <div className="border rounded-lg px-[18px] py-3 bg-white flex items-center gap-4 border-primary-30">
      <Pin />
      <span className="mr-auto">{file?.name || docName}</span>
      {file ? (
        <span className="cursor-pointer" onClick={() => setFile(null)}>
          <BinDelete />
        </span>
      ) : (
        <FileButton onChange={setFile} accept="image/png,image/jpeg">
          {(props) => (
            <Button
              className="bg-transparent hover:bg-transparent text-accent font-semibold ml-auto"
              {...props}
            >
              Upload
            </Button>
          )}
        </FileButton>
      )}
    </div>
  );
}
