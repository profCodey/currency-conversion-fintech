import { Dispatch, SetStateAction, useState } from "react";
import { ActionIcon, Anchor, Button, FileButton } from "@mantine/core";
import { BinDelete, Pin } from "@/components/icons";
import { useGetCurrentUser } from "@/api/hooks/user";
import { usePatchOnboardingDocuments } from "@/api/hooks/onboarding";
import GreenCheck from "@/public/green-check.svg";
import { Edit, Edit2 } from "iconsax-react";
import Cookies from "js-cookie";

export function FormFile({
  docName,
  file,
  setFile,
  fileUrl,
  fieldName,
  acceptFormat,
}: {
  docName: string;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileUrl?: string;
  fieldName: string;
  acceptFormat?: string;
}) {
  const { data } = useGetCurrentUser();
  const { mutate: updateDocuments, isLoading } = usePatchOnboardingDocuments(
    data?.data.id
  );
  let colorPrimary = Cookies.get("primary_color")
  ? Cookies.get("primary_color")
  : "#132144";
let colorSecondary = Cookies.get("secondary_color")
  ? Cookies.get("secondary_color")
  : "#132144";
let colorBackground = Cookies.get("background_color")
  ? Cookies.get("background_color")
  : "#132144";
  const [showViewIcon, setShowViewIcon] = useState(false);

  function handleFileSelect(file: File) {
    const payload = {
      [fieldName]: file,
    };
    updateDocuments(payload);
  }

  const disableEdit = data?.data.is_approved;
  const acceptableFormat =
    acceptFormat ||
    "image/png,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
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
                style={{ color: colorSecondary }}
                className=" border-right px-1"
              >
                View
              </Anchor>
              <ActionIcon>
                <FileButton
                  onChange={handleFileSelect}
                  accept={acceptableFormat}
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
        <FileButton onChange={handleFileSelect} accept={acceptableFormat}>
          {(props) => (
            <Button
            style={{ color: colorSecondary }}
              className="bg-transparent hover:bg-transparent  font-semibold ml-auto"
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
