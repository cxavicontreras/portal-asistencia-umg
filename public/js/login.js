const loginForm = document.getElementById("login-form");
const usuarioInput = document.getElementById("usuario");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");

const formMessage = document.getElementById("form-message");

const welcomePopup = document.getElementById("welcome-popup");
const welcomeMessage = document.getElementById("welcome-message");
const popupBtn = document.getElementById("popup-btn");

function clearFeedback() {
    formMessage.textContent = "";
    formMessage.className = "form-message";

    usuarioInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");
}

function showError(message, markInputs = false) {
    formMessage.textContent = message;
    formMessage.className = "form-message show error";

    if (markInputs) {
        usuarioInput.classList.add("input-error");
        passwordInput.classList.add("input-error");
    }
}

function setLoadingState(isLoading) {
    loginBtn.disabled = isLoading;
    loginBtn.textContent = isLoading ? "Validando..." : "Ingresar al sistema";
}

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearFeedback();

    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    if (!usuario || !password) {
        showError("Debe ingresar su usuario y contraseña.", true);
        return;
    }

    try {
        setLoadingState(true);

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario, password })
        });

        const result = await response.json();

        if (!response.ok) {
            showError("El servidor respondió con un error. Intente nuevamente.");
            return;
        }

        if (result.success) {
            welcomeMessage.textContent = `Bienvenido, ${result.nombre}. Acceso concedido al sistema.`;
            welcomePopup.classList.add("show");
        } else {
            showError(result.error || "Usuario o contraseña incorrectos.", true);
        }
    } catch (error) {
        console.error("Error real del login:", error);
        showError("No fue posible conectar con el servidor.");
    } finally {
        setLoadingState(false);
    }
});

popupBtn.addEventListener("click", function () {
    window.location.href = "/pages/arbolAsistencia.html";
});

usuarioInput.addEventListener("input", clearFeedback);
passwordInput.addEventListener("input", clearFeedback);