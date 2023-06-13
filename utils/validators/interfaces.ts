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
