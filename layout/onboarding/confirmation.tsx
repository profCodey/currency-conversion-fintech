import { Button, Loader } from "@mantine/core";
import { useState } from "react";
import { useGetCurrentUser
 } from "@/api/hooks/user";
 import { useConfrimation } from "@/api/hooks/admin/users";

 export const Confirmation = () => {
   const { data } = useGetCurrentUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { mutate: confirmDetails, isLoading: confirmDetailsLoading } = useConfrimation(data?.data.id as unknown as string, () => {
      setSuccess(true);
      setLoading(false);
    });



    interface ConfirmationPayload {
      userId: string;
    }

     function handleConfirm() {
      const payload: ConfirmationPayload = { userId: data?.data.id as unknown as string };
      if (!payload.userId) {
        return;
      }
      setLoading(true);
      setError(false);
      setErrorMessage("");
      try {
         confirmDetails(payload);
        setSuccess(true);
      } catch (error: any) {
        setError(true);
        setErrorMessage(error?.response?.data?.message || "An error occurred");
      }
      setLoading(false);
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4">
         <div className="text-center">
            <h1 className="text-2xl font-semibold">Confirm details</h1>
            <p className="text-base text-gray-600">
              Click the confirm button below to submit your entire details
            </p>
         </div>
         <div className="flex flex-col items-center justify-center gap-4">
            <Button
              // onClick={handleConfirm}
              loading={loading}
              disabled={success}
              variant={success ? "success" : "outline"}
            >
              Confirm
            </Button>
            {error && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
         </div>
      </div>
    );
     }
