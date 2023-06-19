import { InnerNumberInputStylesNames } from "@mantine/core/lib/NumberInput/NumberInput";
import { string } from "zod";

export interface IGateway {
  id: number;
  description: string;
}

export interface ISelectedGateway {
  id: number;
  gateway: number;
  gateway_name: string;
  is_approved: boolean;
  is_default: boolean;
}

export interface ICurrency {
  id: number;
  code: string;
  name: string;
}

export interface IClientDetail {
  status: boolean;
  result: {
    clientId: string;
    clientname: string;
    walletBalance: number;
    accruedCharges: number;
    lastTransDate: Date;
    depositCharges: number;
    payoutCharges: number;
    awsClientId: string;
    awsSecret: string;
    apiStaus: string;
    gatewaybalances: IGatewayBalance[];
    createdOn: Date;
  };
}

interface IGatewayBalance {
  gatewayId: string;
  gatewaydescription: string;
  clientId: string;
  clientname: string;
  balance: number;
  lastsynctime: string;
  syncIsPending: boolean;
  createdOn: string;
}

export interface IBank {
  id: number;
  created_on: string;
  updated_on: string;
  name: string;
  is_active: true;
  category: "fx" | "local";
}

export interface INameEnquiry {
  status: boolean;
  result: string;
}

export interface IRecipient {
  id?: number;
  created_on?: string;
  updated_on?: string;
  account_number?: string;
  account_name: string;
  sort_code?: string;
  bank: string;
  category: string;
  bank_code?: string;
  bic?: string;
  iban?: string;
  recipient_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  user: number;
}

export interface IPayoutHistory {
  status: boolean;
  result: IPayoutRecord[];
}

export interface IPayoutRecord {
  gatewaywalletbalanceAfter: number;
  walletbalanceAfter: number;
  statusDate: string;
  gatewayid: string;
  clientId: string;
  payoutId: string;
  bankcode: string;
  bankname: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  transactionId: string;
  status: string | "Failed";
  statusRemarks: string;
  gatewayref: string | null;
  apiCallResponsePayload: string;
  clientname: string;
  gatewayname: string;
  charges: number;
  callbackurl: null;
  narration: string;
  createdOn: string;
}

export interface IPaycelerAccount {
  id: number;
  account_number: string;
  account_name: string;
  bank_name: string;
  category: "local" | "fx";
  is_active: boolean;
  currency: number;
}

export interface IManualPayment {
  id: number;
  user: number;
  amount: string;
  account_name: string;
  gateway: 0;
  gateway_name: string;
  reference: string;
  status: string;
  narration: string;
}

// FX

export interface IFxAccount {
  id: number;
  currency: "EUR" | "GBP" | "USD";
  account_number: string;
  account_name: string;
  bank_name: string;
  balance: string;
  is_active: boolean;
}
