import { Button, Loader } from "@mantine/core";
import { useState } from "react";
import { useGetCurrentUser
 } from "@/api/hooks/user";

 export const Confirmation = () => {
    const { data } = useGetCurrentUser();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    // const handleConfirm = async () => {
    //   setLoading(true);
    //   // console.log({ data });
    //   try {
    //      // const response = await confirmEmail(data?.data.id);
    //      // console.log({ response });
    //      setSuccess(true);
    //      setLoading(false);
    //   } catch (error) {
    //      setError(true);
    //      setErrorMessage(error?.response?.data?.message);
    //      setLoading(false);
    //   }
    // };
    return (
      <div className="flex flex-col items-center justify-center gap-4">
         <div className="text-center">
            <h1 className="text-2xl font-semibold">Confirm details</h1>
            <p className="text-base text-gray-600">
              Click the confirm button below to send a notification to the admin
            </p>
         </div>
         <div className="flex flex-col items-center justify-center gap-4">
            <Button
            //   onClick={handleConfirm}
              loading={loading}
              disabled={success}
              variant={success ? "success" : "outline"}
            >
              {success ? "Email confirmed" : "Confirm"}
            </Button>
            {error && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
         </div>
      </div>
    );
     }