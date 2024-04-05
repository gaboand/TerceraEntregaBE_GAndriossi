document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-password-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        const token = document.querySelector('input[name="token"]').value;

        if (newPassword !== confirmNewPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await fetch(form.action, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword: newPassword,
                    confirmNewPassword: confirmNewPassword,
                    token: token,
                }),
            });

            if (response.ok) {
                alert('Tu contraseña ha sido actualizada correctamente.');
                window.location.href = '/login';
            } else {
                const data = await response.json();
                if (data.redirect) {
                    alert(data.error);
                    window.location.href = data.redirect;
                } else {
                    alert(data.error || 'Ocurrió un error al restablecer tu contraseña.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar la solicitud.');
        }
    });
});
