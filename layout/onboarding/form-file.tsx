import { Dispatch, SetStateAction, useState } from "react";
import { ActionIcon, Anchor, Button, FileButton } from "@mantine/core";
import { BinDelete, Pin } from "@/components/icons";
import { useGetCurrentUser } from "@/api/hooks/user";
import { usePatchOnboardingDocuments } from "@/api/hooks/onboarding";
import GreenCheck from "@/public/green-check.svg";
import { Edit, Edit2 } from "iconsax-react";

export function FormFile({
  docName,
  file,
  setFile,
  fileUrl,
  fieldName,
}: {
  docName: string;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileUrl?: string;
  fieldName: string;
}) {
  const { data } = useGetCurrentUser();
  const { mutate: updateDocuments, isLoading } = usePatchOnboardingDocuments(
    data?.data.id
  );
  const [showViewIcon, setShowViewIcon] = useState(false);

  function handleFileSelect(file: File) {
    const payload = {
      [fieldName]: file,
    };
    updateDocuments(payload);
  }

  const disableEdit = data?.data.is_approved;

  return (
    <div className="border rounded-lg px-[18px] py-3 bg-white flex items-center gap-4 border-primary-30">
      <Pin />
      <span className="mr-auto">{file?.name || docName}</span>
      {file ? (
        <span className="cursor-pointer" onClick={() => setFile(null)}>
          <BinDelete />
        </span>
      ) : fileUrl ? (
        <div
          onMouseEnter={() => !disableEdit && setShowViewIcon(true)}
          onMouseLeave={() => setShowViewIcon(false)}
        >
          {showViewIcon ? (
            <div className="flex gap-1">
              <Anchor
                href={fileUrl}
                target="_blank"
                className="text-accent border-right px-1"
              >
                View
              </Anchor>
              <ActionIcon>
                <FileButton
                  onChange={handleFileSelect}
                  accept="image/png,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                >
                  {(props) => (
                    <Edit2 size="16" color="gray" variant="Bold" {...props} />
                  )}
                </FileButton>
              </ActionIcon>
            </div>
          ) : (
            <GreenCheck />
          )}
        </div>
      ) : (
        <FileButton onChange={handleFileSelect} accept="image/png,image/jpeg">
          {(props) => (
            <Button
              className="bg-transparent hover:bg-transparent text-accent font-semibold ml-auto"
              loading={isLoading}
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
