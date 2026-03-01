const formatCurrency = (amount, preferences) => {
  return new Intl.NumberFormat(void 0, {
    style: "currency",
    currency: preferences.currency
  }).format(amount);
};
const formatDate = (date) => {
  return new Intl.DateTimeFormat(void 0, {
    dateStyle: "medium"
  }).format(new Date(date));
};
export {
  formatDate as a,
  formatCurrency as f
};
