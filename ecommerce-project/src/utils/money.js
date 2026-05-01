export function formateMoney(amountCents){
  return `$${(amountCents/100).toFixed(2)}` 
}