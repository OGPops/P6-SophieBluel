//URL de base de l'API
const baseApiUrl = "http://localhost:5678/api/";

document.addEventListener("submit", async (e) => {
    e.preventDefault();

    let form = {
        email: document.getElementById("email"),
        password: document.getElementById("password"),
    };

    try {
        let response = await fetch(`${baseApiUrl}users/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: form.email.value,
                password: form.password.value,
            }),
        });

        if (response.status !== 200) {
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = "E-mail ou mot de passe erroné";
            errorMessage.style.color = "red";
            errorMessage.style.alignSelf = "center";
        } else {
            let data = await response.json();
            sessionStorage.setItem("token", data.token);
            window.location.replace("index.html");
        }
    } catch (error) {
        console.error(
            "Une erreur s'est produite lors de la connexion :",
            error
        );
    }
});
