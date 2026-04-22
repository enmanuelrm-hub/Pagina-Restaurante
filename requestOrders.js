async function main() {
  const response = await fetch('http://127.0.0.1:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'DINE_IN',
      tableId: 1,
      waiterId: '4531a707-a51f-4fb5-8bdb-c92a70514a61',
      note: 'test',
      items: [{ menuItemId: 1, quantity: 1, specialNote: 'no' }],
      deliveryAddress: 'Calle Falsa 123',
    }),
  });
  console.log('status', response.status);
  const text = await response.text();
  console.log(text);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});