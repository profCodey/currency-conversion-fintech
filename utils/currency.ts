export function currencyFormatter(amount: number) {
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
