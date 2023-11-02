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

  export function validateAndFormatAmount(amount: string): string {
    // Remove any non-digit characters, including spaces and symbols
    const cleanAmount: string = amount.replace(/[^\d.-]/g, '');
  
    // Check if the cleaned amount is a valid number
    if (!isNaN(Number(cleanAmount))) {
      // Split the amount into integer and decimal parts (if any)
      const parts: string[] = cleanAmount.split('.');
      let integerPart: string = parts[0];
      let decimalPart: string = parts[1] || '';
  
      // Handle negative sign
      const isNegative: boolean = integerPart.startsWith('-');
      if (isNegative) {
        integerPart = integerPart.substring(1);
      }
  
      // Add commas every 3 digits from the back of the integer part
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
      // Ensure the decimal part has exactly 2 decimal places
      decimalPart = decimalPart.padEnd(2, '0');
  
      // Reconstruct the final amount, including the decimal part (if any)
      const formattedAmount: string = (isNegative ? '-' : '') + integerPart + (decimalPart ? `.${decimalPart}` : '');
  
      return formattedAmount;
    } else {
      // Return an error message or handle invalid input as needed
      return 'Invalid input';
    }
  }
