const baseApiUrl = "http://localhost:5678/api/";

// Récupérer les projets
const getWorks = async () => {
    const apiUrl = `${baseApiUrl}works`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                `La requête vers ${apiUrl} a échoué avec le statut : ${response.status}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            `Une erreur s'est produite lors de la récupération des données depuis ${apiUrl}:`,
            error
        );
        throw error;
    }
};

// Récupérer les catégories
const getCategories = async () => {
    const apiUrl = `${baseApiUrl}categories`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                `La requête vers ${apiUrl} a échoué avec le statut : ${response.status}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            `Une erreur s'est produite lors de la récupération des données depuis ${apiUrl}:`,
            error
        );
        throw error;
    }
};

// Récupérer d'autres données
const getSomeOtherData = async () => {
    const apiUrl = `${baseApiUrl}otherData`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(
                `La requête vers ${apiUrl} a échoué avec le statut : ${response.status}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(
            `Une erreur s'est produite lors de la récupération des données depuis ${apiUrl}:`,
            error
        );
        throw error;
    }
};

// Utilisation des fonctions
const init = async () => {
    try {
        const works = await getWorks();
        console.log(works);

        const categories = await getCategories();
        console.log(categories);

        // D'autres appels si nécessaire
    } catch (error) {
        // Gérer les erreurs ici
    }
};

init();
// FETCH data projets depuis l'API

//Effectue une requête FETCH pour récupérer les données des projets
async function fetchData() {
    try {
        const worksResponse = await fetch(baseApiUrl + "works");
        const worksData = await worksResponse.json();

        const categoriesResponse = await fetch(baseApiUrl + "categories");
        const categoriesData = await categoriesResponse.json();

        //Afficher la galerie de projets
        displayGallery(worksData);

        // Initialise les fonctionnalités de filtre par catégorie
        const filter = document.querySelector(".filter");
        categoryFilter(categoriesData, filter);

        // Active le mode administrateur
        adminUserMode(filter);
    } catch (error) {
        console.error(
            "Une erreur s'est produite lors de la récupération des données :",
            error
        );
    }
}

// Appel de la fonction asynchrone
fetchData();

//*******GALLERY*******

//Active la gallerie de projets
const displayGallery = async (data) => {
    gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    //Pour chaque projet, crée des éléments HTML et les ajoute à la gallerie
    if (Array.isArray(data)) {
        data.forEach((i) => {
            const workCard = document.createElement("figure");
            const workImage = document.createElement("img");
            const workTitle = document.createElement("figcaption");
            // Attribution des valeurs et classes
            workImage.src = i.imageUrl;
            workImage.alt = i.title;
            workTitle.innerText = i.title;
            workCard.dataset.category = i.category.name;
            workCard.className = "workCard";

            //Ajout au DOM
            gallery.appendChild(workCard);
            workCard.append(workImage, workTitle);
        });
    } else {
        console.error("data n'est pas une tableau.");
    }
};

// ********** Filtre ***********//

//Génère des boutons filtre
const categoryFilter = (categories, filter) => {
    const button = document.createElement("button");
    button.innerText = "Tous";
    button.className = "filterButton active";
    button.dataset.category = "Tous";
    filter.appendChild(button);
    //Génère les boutons filtre en fonction des catégories
    filterButtons(categories, filter);
    //initialise le fonctionnement des filtres
    functionFilter();
    toggleProjects("Tous");
};
//Création des boutons de filtre
const filterButtons = (categories, filter) => {
    categories.forEach((categorie) => {
        createButtonFilter(categorie, filter);
    });
};
//Création d'un bouton filtre
const createButtonFilter = (categorie, filter) => {
    const button = document.createElement("button");
    button.innerText = categorie.name;
    button.className = "filterButton";
    button.dataset.category = categorie.name;
    filter.appendChild(button);
};

// Fonctionnement du filtre
const functionFilter = () => {
    const filterButtons = document.querySelectorAll(".filterButton");

    // Identification du bouton filtre cliqué et déclenche le filtre correspondant
    filterButtons.forEach((i) => {
        i.addEventListener("click", function () {
            console.log("Bouton cliqué : ", i.dataset.category);
            // Désactiver tous les boutons
            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            // Activer le bouton actuel
            this.classList.add("active");

            toggleProjects(i.dataset.category);
        });
    });
};

//Si bouton "tous" actif, montrer tous les projets, sinon ne montrer que les projets des catégories choisies
const toggleProjects = (datasetCategory) => {
    const figures = document.querySelectorAll(".workCard");
    if ("Tous" === datasetCategory) {
        //Affiche tous les projets si la catégorie est "Tous"
        figures.forEach((figure) => {
            figure.style.display = "block";
        });
    } else {
        //Sinon, affiche uniquement les projets de la catégorie sélectionnée
        figures.forEach((figure) => {
            figure.dataset.category === datasetCategory
                ? (figure.style.display = "block")
                : (figure.style.display = "none");
        });
    }
};

//********Mode administrateur******//

const adminUserMode = async () => {
    // Mode administrateur ok si token de session présent
    if (sessionStorage.getItem("token")) {
        // Filtres cachés
        document.querySelector(".filter").style.display = "none";
        // Changement de login en logout
        document.getElementById("logBtn").innerText = "logout";
        document.getElementById("logBtn").href = "index.html";
        // Bar de Menu administrateur en haut de l'écran
        const body = document.querySelector("body");
        const topMenu = document.createElement("div");
        const publishBtn = document.createElement("button");
        const editMode = document.createElement("p");
        topMenu.className = "topMenu";
        editMode.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Mode édition`;
        publishBtn.innerText = "Publier les changements";
        body.insertAdjacentElement("afterbegin", topMenu);
        topMenu.append(editMode, publishBtn);
        // Ajout boutons d'édition à l'image et à l'article de l'intro et également au titre du portfolio
        const editBtn = `<p class="editBtn"><i class="fa-regular fa-pen-to-square"></i>Modifier</p>`;
        document
            .querySelector("#introduction img")
            .insertAdjacentHTML("afterend", editBtn);
        document
            .querySelector("#introduction article")
            .insertAdjacentHTML("afterbegin", editBtn);
        document
            .querySelector("#portfolio h2")
            .insertAdjacentHTML("afterend", editBtn);
        // eventlistener d'ouverture de la modal (pas encore codée)
        document
            .querySelector("#portfolio p")
            .addEventListener("click", async () => {
                await openModal();
            });
    }
};

//*********MODAL*******//

//Ouverture de la modal si token ok
const openModal = async () => {
    if (sessionStorage.getItem("token")) {
        modal = document.querySelector(".modal");
        modal.style.display = "flex";
        document.querySelector("#addPicture").style.display = "none";
        document.querySelector("#editGallery").style.display = "flex";

        // Utilisation de la variable works
        const works = await getWorks();
        modalGallery(works);

        // Eventlistener au click de la fermeture de la modal
        modal.addEventListener("click", closeModal);
        // Evenlistener au click du bouton de suppression
        document.addEventListener("click", deleteBtn);
        document.addEventListener("click", openNewWorkForm);
    }
};

//Fermeture de la modal
const closeModal = (e) => {
    if (
        e &&
        (e.target === document.querySelector(".modal") ||
            e.target.classList.contains("fa-xmark"))
    ) {
        document.querySelector(".modal").style.display = "none";
        document.removeEventListener("click", closeModal);
        document.removeEventListener("click", deleteBtn);
        clearSuccessMessage();
    }
};

//*************Suppresion***************/
//Affichage de la gallery de la modal
const modalGallery = (data) => {
    const modalContent = document.querySelector(".modalContent");
    modalContent.innerHTML = "";
    //Affichage tableau des projets
    data.forEach((i) => {
        //Création des éléments
        const miniWork = document.createElement("figure");
        const workImage = document.createElement("img");
        const trashCan = document.createElement("i");
        //Id corbeille
        trashCan.id = i.id;
        trashCan.classList.add("fa-solid", "fa-trash-can");
        workImage.src = i.imageUrl;
        workImage.alt = i.title;
        miniWork.className = "miniWork";
        //DOM
        modalContent.appendChild(miniWork);
        miniWork.append(workImage, trashCan);
    });
};

//Eventlistener de suppression de projet
const deleteBtn = (e) => {
    e.preventDefault();
    //Bouton cliqué
    if (e.target.matches(".fa-trash-can")) {
        deleteWork(e.target.id);
    }
};

//Appel à l'API pour la suppresion
const deleteWork = async (i) => {
    //Authentification de l'utilisateur et réponse API
    let token = sessionStorage.getItem("token");
    try {
        const response = await fetch(baseApiUrl + "works/" + i, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const worksData = await getWorks();
            // Créer un élément pour le message de succès
            const successMessage = document.getElementById("success_message");
            if (!successMessage) {
                successMessage = document.createElement("div");
                successMessage.id = "success_message";
                document.body.appendChild(successMessage);
            }
            successMessage.textContent = "Projet supprimé avec succès";
            successMessage.style.color = "Green";
            successMessage.style.marginTop = "20px";

            const modalWrappers = document.querySelectorAll(".modalWrapper");
            modalWrappers.forEach((modalWrapper) => {
                modalWrapper.addEventListener("click", () => {
                    successMessage.textContent = "";
                });
            });
            displayGallery(worksData);
            modalGallery(worksData);
        } else {
            const errorMessage = await response.text();
            console.error("Erreur : " + response.status, errorMessage);
        }
    } catch (error) {
        console.error(
            "Une erreur s'est produite lors de la suppression :",
            error
        );
    }
};

//*************Ajouter projet***************/

//Afficher formulaire ajout de travail
const openNewWorkForm = async (e) => {
    if (e.target === document.querySelector("#addPictureBtn")) {
        document.querySelector("#addPicture").style.display = "flex";
        document.querySelector("#editGallery").style.display = "none";
        document.querySelector("#labelPhoto").style.display = "flex";
        document.querySelector("#picturePreview").style.display = "none";
        document.querySelector("#valider").style.backgroundColor = "#A7A7A7";
        document.getElementById("addPictureForm").reset();
        try {
            const categories = await getCategories();
            //Liste catégories
            selectCategoryForm(categories);
        } catch (error) {
            console.error(
                "Une erreur s'est produite lors de la récupération des catégories",
                error
            );
        }
        //Afficher apperçu
        pictureInput = document.querySelector("#photo");
        pictureInput.onchange = picturePreview;
        //Eventlisteners
        document.querySelector("#addPictureForm").onchange =
            changeSubmitBtnColor;
        document.addEventListener("click", closeModal);
        document
            .querySelector(".modalHeader .fa-arrow-left")
            .addEventListener("click", openModal);
        document.removeEventListener("click", openNewWorkForm);
        document.removeEventListener("click", deleteBtn);
        document.addEventListener("click", newWorkFormSubmit);
    }
};

//prévisualiser image dans le formulaire
const picturePreview = () => {
    const [file] = pictureInput.files;
    if (file) {
        document.querySelector("#picturePreviewImg").src =
            URL.createObjectURL(file);
        document.querySelector("#picturePreview").style.display = "flex";
        document.querySelector("#labelPhoto").style.display = "none";
    }
};

//Option de catégorie formulaire
const selectCategoryForm = (categories) => {
    //reset catégories
    document.querySelector("#selectCategory").innerHTML = "";
    //première option
    option = document.createElement("option");
    document.querySelector("#selectCategory").appendChild(option);
    //Options à partir tableau catégories
    categories.forEach((categorie) => {
        option = document.createElement("option");
        option.value = categorie.name;
        option.innerText = categorie.name;
        option.id = categorie.id;
        document.querySelector("#selectCategory").appendChild(option);
    });
};

//Eventlistener sur l'envoie de formulaire
const newWorkFormSubmit = (e) => {
    if (e.target === document.querySelector("#valider")) {
        e.preventDefault();
        postNewWork();
    }
};

//Message d'erreur
const displayErrorMessage = (message) => {
    // Créer un élément pour afficher le message d'erreur
    const errorElement = document.createElement("div");
    errorElement.classList.add("error-message");
    errorElement.textContent = message;
    errorElement.style.color = "red";

    // Ajouter l'élément au DOM à l'endroit souhaité
    const errorMessageContainer = document.getElementById("error");
    errorMessageContainer.appendChild(errorElement);
};

//Effaçage des messages au fur et à mesure
const clearErrorMessages = () => {
    const errorMessageContainer = document.getElementById("error");
    errorMessageContainer.innerHTML = "";
};

//POST nouveau projet
const postNewWork = () => {
    clearErrorMessages();
    let token = sessionStorage.getItem("token");
    const select = document.getElementById("selectCategory");
    //get data depuis formulaire
    const title = document.getElementById("title").value;
    const categoryName = select.options[select.selectedIndex].innerText;
    const categoryId = select.options[select.selectedIndex].id;
    const image = document.getElementById("photo").files[0];
    //check validité
    let validity = formValidation(image, title, categoryId);
    if (validity === true) {
        //Création FormData
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("category", categoryId);
        //Envoie data collectée à l'API
        sendNewData(token, formData, title, categoryName);
    } else {
        displayErrorMessage(validity);
    }
};

//Changement de couleur du bouton si tous les champs remplis
const changeSubmitBtnColor = () => {
    const select = document.getElementById("selectCategory");
    if (
        document.getElementById("title").value !== "" &&
        document.getElementById("photo").files[0] !== undefined &&
        select.options[select.selectedIndex].id !== ""
    ) {
        document.querySelector("#valider").style.backgroundColor = "#1D6154";
    }
};

//Validation du formulaire
const formValidation = (image, title, categoryId) => {
    if (image == undefined) {
        return "Veuillez ajouter une image";
    }
    if (title.trim().length == 0) {
        return "Veuillez ajouter un titre";
    }
    if (categoryId == "") {
        return "Veuillez choisir une catégorie";
    }
    return true;
};

//Ajout nouveau projet dans tableau pour affichage dynamique à l'aide la réponse API
const addToData = (data, categoryName) => {
    let worksData = [];
    newWork = {};
    newWork.title = data.title;
    newWork.id = data.id;
    newWork.category = { id: data.categoryId, name: categoryName };
    newWork.imageUrl = data.imageUrl;
    worksData.push(newWork);
};

const clearSuccessMessage = () => {
    const customMessageElement = document.getElementById("customMessage");
    customMessageElement.textContent = ""; // Effacer le contenu du message
    customMessageElement.style.display = "none"; // Masquer le message
};

//Appel API pour nouveau projet
const sendNewData = async (token, formData, categoryName) => {
    try {
        const response = await fetch(`${baseApiUrl}works`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const responseData = await response.json();
            addToData(responseData, categoryName);
            appendToGallery(responseData); // Ajoute le nouveau projet à la galerie
            displaySuccessMessage("Nouveau projet ajouté avec succès");
            closeModal();
        } else {
            console.error("Erreur:", response.status);
        }
    } catch (error) {
        console.error("Erreur:", error);
    }
};

const appendToGallery = (newProject) => {
    // Créer un élément HTML pour le nouveau projet
    const newProjectElement = createProjectElement(newProject);

    // Ajouter le nouveau projet à la galerie
    const gallery = document.querySelector(".gallery");
    gallery.appendChild(newProjectElement);
};

const createProjectElement = (project) => {
    // Créer un élément <figure> pour représenter le projet
    const projectElement = document.createElement("figure");
    //projectElement.className = "workCard";

    const imageElement = document.createElement("img");
    imageElement.src = project.imageUrl; // Définir l'URL de l'image
    imageElement.alt = project.title; // Définir le texte alternatif de l'image

    // Créer un élément <figcaption> pour afficher le titre du projet
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = project.title; // Définir le texte du titre

    // Ajouter l'image et le titre à l'élément figure
    projectElement.appendChild(imageElement);
    projectElement.appendChild(titleElement);

    return projectElement; // Renvoyer l'élément figure
};

const displaySuccessMessage = (message) => {
    // Récupérer l'élément HTML où afficher le message de succès
    const customMessageElement = document.getElementById("customMessage");
    customMessageElement.textContent = message;
    customMessageElement.style.display = "block";
    customMessageElement.style.color = "green";
    customMessageElement.style.marginTop = "20px";
    customMessageElement.style.marginLeft = "90px";
};

// Fonction de déconnexion
const logout = () => {
    console.log("Déconnexion appelée");

    // Supprimer le token de session
    sessionStorage.removeItem("token");

    console.log("Redirection vers la page d'accueil...");
    // Rediriger vers la page d'accueil ou effectuer d'autres actions nécessaires
    window.location.href = "index.html";
};

// Écouteur d'événement pour le bouton de déconnexion
const logoutButton = document.getElementById("logBtn");

if (logoutButton) {
    logoutButton.addEventListener("click", logout);
} else {
    console.error("Élément avec l'ID 'logBtn' non trouvé dans le DOM");
}
