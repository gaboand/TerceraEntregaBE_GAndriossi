function getCartId() {
    return localStorage.getItem('cartId');
}

function emptyCart() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        const cartId = getCartId();

        fetch(`/api/carts/${cartId}/empty`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log("Carrito vaciado con éxito");
                    updateCartUI({ total: 0, totalProducts: 0 });
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log("El usuario prefirió no vaciar el carrito");
    }
}

function deleteProductFromCart(productId) {
    if (confirm("¿Deseas eliminar este producto del carrito?")) {
        const cartId = getCartId(); 

        fetch(`/api/carts/${cartId}/product/${productId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Producto ${productId} eliminado con éxito del carrito`);
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        console.log("El usuario prefirió no eliminar este producto");
    }
}

function updateCartQuantity(action, productId) {
    var quantityElement = document.getElementById('quantity-' + productId);
    var currentQuantity = parseInt(quantityElement.value);

    if (action === 'plus') {
        currentQuantity += 1;
    } else if (action === 'minus' && currentQuantity > 1) {
        currentQuantity -= 1;
    }

    quantityElement.value = currentQuantity;
    updateQuantityOnServer(productId, currentQuantity);
}

function updateQuantityOnServer(productId, newQuantity) {
    const cartId = getCartId();

    fetch(`/api/carts/${cartId}/product/${productId}/quantity`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Cantidad del producto actualizada con éxito");
        } else {
            console.error(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateCartUI(cart) {

    const totalElement = document.getElementById('cartTotal');
    const quantityElement = document.getElementById('cartQuantity');

    if (totalElement && quantityElement) {
        totalElement.textContent = `Total: $${cart.total}`;
        quantityElement.textContent = `Cantidad de Productos: ${cart.totalProducts}`;
    }
}

function finalizePurchase(cartId) {
    fetch(`/api/orders/fromcart/${cartId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Orden creada con éxito");

                window.location.href = `/orders/${data.order._id}`;
            } else {
                console.error(data.message);
                alert("Hubo un error al finalizar la compra. Por favor, intenta de nuevo.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al procesar la compra.");
        });
}

document.addEventListener('DOMContentLoaded');