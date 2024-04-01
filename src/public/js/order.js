document.getElementById('payOrder').addEventListener('click', () => {
    const orderId = window.location.pathname.split('/').pop();

    fetch(`/api/orders/pay/${orderId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert('Pago realizado con éxito');
            window.location.href = '/products';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al procesar el pago.');
        });
});

