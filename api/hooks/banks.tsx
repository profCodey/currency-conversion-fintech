import { QueryFunction, useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AxiosError, AxiosResponse } from "axios";
import {
    IBank,
    IGatewayBank,
    IManualPayment,
    INameEnquiry,
    IPaycelerAccount,
    ICharge,
} from "@/utils/validators/interfaces";
import { showNotification } from "@mantine/notifications";
import { ErrorItem } from "./auth";
import {
    fundManualAccount,
    localTransactionCreditFormValidator,
} from "@/utils/validators";
import { z } from "zod";
import { queryClient } from "@/pages/_app";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { TransferOperationStage } from "@/layout/common/send-money-modal";
import { PayFxRecipient } from "@/layout/common/send-fx-modal";
import { FxTransferOperationStage } from "@/layout/common/fx-forms/dollar-form";
import { AddNewAccountValidator } from "@/layout/admin/accounts";
import { id } from "date-fns/locale";

export function useGetBanks() {
    return useQuery(["banks"], function (): Promise<AxiosResponse<IBank[]>> {
        return axiosInstance.get(`/banks/?category=local&is_active=true`);
    });
}

export function useGetBanksForGateway(gatewayId: string | null) {
    return useQuery(
        ["banks", gatewayId],
        function (): Promise<AxiosResponse<IGatewayBank>> {
            return axiosInstance.get(`/local/banks/${gatewayId}/`);
        },
        {
            enabled: !!gatewayId,
        }
    );
}

export function useBankOptions() {
    const { data: banks, isLoading } = useGetBanks();
    const bankOptions = useMemo(
        function () {
            return (
                banks?.data.map((bank) => ({
                    label: bank.name,
                    value: bank.id.toString(),
                })) ?? []
            );
        },
        [banks?.data]
    );

    const getBankName = useCallback(
        function (id: number) {
            return banks?.data.find((bank) => bank.id === id);
        },
        [banks?.data]
    );

    return { bankOptions, getBankName, isLoading };
}

export function useNameEnquiry(
    payload: {
        account_number: string;
        bank_code: string;
        gateway_id: string;
    } | null
) {
    return useQuery(
        [
            "name-enquiry",
            payload?.account_number,
            payload?.bank_code,
            payload?.gateway_id,
        ],
        function (): Promise<AxiosResponse<INameEnquiry>> {
            return axiosInstance.get(
                `/local/name-enquiry/${payload?.gateway_id}/${payload?.bank_code}/${payload?.account_number}/`
            );
        },
        {
            enabled: payload !== null,
        }
    );
}
export function useNewClientNameEnquiry(
    payload: {
        account_number: string;
        bank_id: string;
    } | null
) {
    return useQuery(
        ["new-client-name-enquiry", payload?.account_number, payload?.bank_id],
        function (): Promise<AxiosResponse<INameEnquiry>> {
            return axiosInstance.get(
                `/local/name-enquiry/default/${payload?.bank_id}/${payload?.account_number}`
            );
        },
        {
            enabled: payload !== null,
        }
    );
}

interface LocalPayout {
    gateway: number;
    amount: number;
    account_number: string;
    bank: string;
    narration: string;
}
interface Payout {
    gateway: number;
    amount: number;
    account_number: string;
    bank: string;
    narration: string;
}
export function useCreatePayout(
    cb: Dispatch<SetStateAction<TransferOperationStage>>
) {
    return useMutation(
        function (payload: LocalPayout) {
            return axiosInstance.post("/local/payouts/create/", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        {
            onSuccess: function (data: AxiosResponse) {
                if (data?.data.status) {
                    showNotification({
                        title: "Operation Successful",
                        message: "Registration Successful",
                        color: "green",
                    });
                } else {
                    showNotification({
                        title: "Operation failed",
                        message: "Registration unsuccessful",
                        color: "red",
                    });
                }
            },
            onError: function (data: AxiosError) {
                const response = data.response?.data as ErrorItem;
                console.log("response", response);
                const combinedDetails = response.errors
                    .map((error: { detail: any }) => error.detail)
                    .join(", ");
                showNotification({
                    title: "Operation failed",
                    message: combinedDetails || "Registration unsuccessful",
                    color: "red",
                });
            },
        }
    );
}

// useCreateDollarPayout

export function useCreateFxPayout(
    cb: Dispatch<SetStateAction<"send-money" | FxTransferOperationStage>>
) {
    return useMutation(
        function (payload: z.infer<typeof PayFxRecipient>) {
            return axiosInstance.post("/fx/payout/", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
        {
            onSuccess: function (data: AxiosResponse) {
                if (data?.data.status) {
                    cb("transaction-success");
                } else {
                    cb("transaction-failed");
                }
            },
            onError: function (data: AxiosError) {
                type E = {
                    type: string;
                    errors: ErrorItem[] | ErrorItem;
                };

                const response: E = data.response?.data as unknown as E;
                const errors = response?.errors;
                //  console.log({ errRes: response });

                // @ts-ignore
                if (!!errors && !!(errors.length > 0)) {
                    for (const item of errors as ErrorItem[]) {
                        const note = `${item.attr}: ${item.detail}`;
                        if (!!note.trim().replace(/ /g, "") && !!item.attr) {
                            showNotification({
                                message: note,
                                color: "red",
                            });
                        }
                    }
                } else if (errors) {
                    // @ts-ignore
                    const error = `${errors?.attr}: ${errors?.detail}`;
                    // @ts-ignore
                    if (!!error.trim().replace(/ :/g, "") && !!errors?.attr) {
                        showNotification({
                            message: error,
                            color: "red",
                        });
                    }
                }

                // cb("transaction-failed");
                // showNotification({
                //   message: response?.detail || "Registration unsuccessful",
                //   color: "red",
                // });
            },
            onSettled: function () {
                queryClient.invalidateQueries(["accounts"]);
            },
        }
    );
}

/**** MANUAL FUNDINGS */
export function useGetPaycelerBankDetails() {
    return useQuery({
        queryKey: ["payceler-banks"],
        queryFn: function (): Promise<AxiosResponse<IPaycelerAccount[]>> {
            return axiosInstance.get(`/payceler_accounts/`);
        },
    });
}

export function useAddNewAccount(cb?: () => void) {
    return useMutation(
        (payload: z.infer<typeof AddNewAccountValidator>) =>
            axiosInstance.post("/payceler_accounts/", payload),
        {
            onSuccess: function (data: AxiosResponse) {
                showNotification({
                    title: "Operation successful",
                    message:
                        data?.data.message || "Account created successfully",
                    color: "green",
                });
            },
            onError: function (data: AxiosError) {
                const response = data.response?.data as ErrorItem;
                showNotification({
                    message: response?.detail || "Unable to create account",
                    color: "red",
                });
            },
            onSettled: function () {
                cb && cb();
                queryClient.invalidateQueries(["payceler-banks"]);
            },
        }
    );
}

export function useDeactivateAccount(cb?: () => void) {
    return useMutation(
        ({ id, ...payload }: any) =>
            axiosInstance.patch(`/payceler_accounts/${id}/`, payload),
        {
            onSuccess: function (data: AxiosResponse, variables) {
                showNotification({
                    title: "Operation successful",
                    message:
                        data?.data.message || variables.is_active
                            ? "Account activated successfully"
                            : "Account de-activated successfully",
                    color: "green",
                });
            },
            onError: function (data: AxiosError) {
                const response = data.response?.data as ErrorItem;
                showNotification({
                    message:
                        response?.detail || "Unable to change Account status",
                    color: "red",
                });
            },
            onSettled: function () {
                cb && cb();
                queryClient.invalidateQueries(["payceler-banks"]);
            },
        }
    );
}

export function useDeleteAccount(cb?: () => void) {
    return useMutation(
        (id: number) => axiosInstance.delete(`/payceler_accounts/${id}/`),
        {
            onSuccess: function (data: AxiosResponse) {
                showNotification({
                    title: "Operation successful",
                    message: "Account deleted successfully",
                    color: "green",
                });
            },
            onError: function (data: AxiosError) {
                const response = data.response?.data as ErrorItem;
                showNotification({
                    message: response?.detail || "Unable to delete Account",
                    color: "red",
                });
            },
            onSettled: function () {
                cb && cb();
                queryClient.invalidateQueries(["payceler-banks"]);
            },
        }
    );
}

export function useGetManualFundings(category: string) {
    return useQuery({
        queryKey: ["manual-fundings"],
        queryFn: function (): Promise<AxiosResponse<IManualPayment[]>> {
            return axiosInstance.get(`/manual-funding?category=${category}`);
        },
    });
}

export function useLoadTransactionCredit(cb?: () => void) {
    return useMutation(
        function (
            payload: z.infer<typeof localTransactionCreditFormValidator>
        ) {
            return axiosInstance.post(`load-transaction-credit/`, payload);
        },
        {
            onSuccess: function (data: AxiosResponse) {
                if (data?.data.status) {
                    showNotification({
                        title: "Operation successful",
                        message: "Transaction credited successfully",
                        color: "green",
                    });
                } else
                    showNotification({
                        message: "Transaction credit loaded successfully",
                        color: "red",
                    });
                cb && cb();
            },
            onError: function (data: AxiosError) {
                const response = data.response?.data as {
                    type: string;
                    errors: Array<{
                        code: string;
                        detail: string;
                        attr: string | null;
                    }>;
                };
            
                if (
                    response?.type === "validation_error" &&
                    response.errors.length > 0
                ) {
                    const errorMessage = response.errors[0].detail;
                    showNotification({
                        message: errorMessage,
                        color: "red",
                    });
                } else {
                    showNotification({
                        message: "Unable to credit transaction",
                        color: "red",
                    });
                }
            },
            
            onSettled: function () {
                cb && cb();
                queryClient.invalidateQueries(["load-transaction-credit"]);
            },
        }
    );
}

export function usePostManualFunding(cb?: () => void) {
    return useMutation(
        function (payload: z.infer<typeof fundManualAccount>) {
            return axiosInstance.post("/manual-funding/", payload);
        },
        {
            onSuccess: function (data: AxiosResponse) {
                if (data?.data.status) {
                    showNotification({
                        title: "Operation successful",
                        message:
                            "Please wait, while we confirm and fund the selected gateway",
                        color: "green",
                    });
                } else
                    showNotification({
                        message: data?.data.message,
                        color: "red",
                    });
                cb && cb();
            },
            onError: function (data: AxiosError) {
                const response = data.response?.data as ErrorItem;
                showNotification({
                    message: response?.detail || "Request failed",
                    color: "red",
                });
            },
            onSettled: function () {
                queryClient.invalidateQueries(["manual-fundings"]);
                cb && cb();
            },
        }
    );
}

// Define the function to fetch transaction charges
function getTransactionCharges(
    sourceAccountId: string,
    destinationAccountId: string
): Promise<AxiosResponse<ICharge>> {
    return axiosInstance.get(
        `/get-transaction-charges/?source_account_id=${sourceAccountId}&destination_account_id=${destinationAccountId}`
    );
}

export function useGetTransactionCharges(
    sourceAccountId: string | null,
    destinationAccountId: string | null
) {
    const queryFn: QueryFunction<AxiosResponse<ICharge>> = async () => {
        if (!sourceAccountId || !destinationAccountId) {
            throw new Error("Source and destination account IDs are required.");
        }

        return getTransactionCharges(sourceAccountId, destinationAccountId);
    };

    const { data, error, isLoading, mutate } = useQuery(
        ["transaction-charges", sourceAccountId, destinationAccountId],
        queryFn,
        {
            enabled: !!sourceAccountId && !!destinationAccountId,
        }
    );

    const mutation = useMutation(queryFn, {
        onSuccess: () => {
            // Optionally do something on success
        },
        onError: function (data: AxiosError) {
            const response = data.response?.data as { type: string; errors: Array<{ code: string; detail: string; attr: string | null }> };

            if (response?.type === "validation_error" && response.errors.length > 0) {
                const errorMessage = response.errors[0].detail;
                showNotification({
                    message: "client charges doesn't exist for this transaction, please select another detination account" || errorMessage,
                    color: "red",
                });
            } else {
                showNotification({
                    message: "Unable to fetch charges, try again later",
                    color: "red",
                });
            }
        },
    });

    return {
        data,
        error,
        isLoading,
        mutate: mutation.mutate,
    };
}
