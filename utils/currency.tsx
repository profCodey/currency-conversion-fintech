import {
  CircleBritishFlag,
  CircleEuropeFlag,
  CircleNigerianFlag,
  CircleUsFlag,
} from "@/components/icons";

export function currencyFormatter(amount: number) {
  if (!amount) return 0;
  return new Intl.NumberFormat().format(Number(amount));
}

export function getCurrency(code: string) {
  switch (code) {
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "₦";
  }
}

export function useCurrencyFlags() {
  return function getIcon(code: string) {
    switch (code) {
      case "GBP":
        return <CircleBritishFlag />;
      case "USD":
        return <CircleUsFlag />;
      case "EUR":
        return <CircleEuropeFlag />;
      default:
        return <CircleNigerianFlag />;
    }
  };
}
