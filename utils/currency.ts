export function currencyFormatter(amount: number) {
  return new Intl.NumberFormat().format(Number(amount));
}
