// utils.js
function showAlert(message, type = "success") {
    const alerta = document.createElement("div");
    alerta.className = `alert alert-${type}`;
    alerta.innerText = message;

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}