const saveChanges = document.getElementById("save-changes");
const imageBody = document.querySelector(".image-container");
var globalStorage =[];


var generateNewCard = (imageData) =>
            {
                const newCard = `
                <div class="col-sm-12 col-md-6 col-lg-4 mt-3 mb-3" id=${imageData.id}>
                    <div class="card" style="height: 35rem;">
                        <div class="card-header col-4 d-flex justify-content-end gap-1 ms-7">
                            <button type="button"  id="Edit" class="btn btn-outline-success ps-0 pe-0"><abbr title="Edit"><i class="fa-solid fa-pencil-alt"></i></abbr></button>

                            <button type="button" id="Thrash" class="btn btn-outline-danger ps-0 pe-0" ><abbr title="Thrash"><i class="fa-solid fa-trash-alt" ></i></abbr></button>
                        </div>
                        <div class="card-body postion-relative">
                          <img src=${imageData.imageUrl} class="card-img-top" id="image" alt="Nature's paradise" style= "height: 18rem; width: fit;">
                          <h5 class="card-title mt-2 ms-1" id="title_image">${imageData.imageTitle}</h5>
                          <p class="card-text ms-1" id="description">${imageData.imageDescription}</p>
                          <a href=${imageData.imageSite} class="btn btn-primary ms-1 position-absolute bottom-0 left-0 mb-3" id="link_image" target="_blank">Learn More</a>
                    </div>
                </div>
            `;

            return newCard;
            };


var loadCardData = () => {
        try {
            if(!(globalStorage))
                {
                return null;
                }
                const dataTasky = localStorage.getItem("tasky1230");    
                if (dataTasky) 
                {
                    const parsedData = JSON.parse(dataTasky);
                        
                    if (parsedData && parsedData.key1 && Array.isArray(parsedData.key1)) 
                    {
                        const getcardData = parsedData.key1;
                            
                        //Iterating over the array using forEach() method. We get this in JSON format.
                        getcardData.forEach((cardObject) => {
                            imageBody.insertAdjacentHTML("beforeend", generateNewCard(cardObject));
                            globalStorage.push(cardObject);
                        });
                    }
                }
            }
            catch (error) 
            {
                    console.error("Error loading card data:", error);
            }
    }; 


saveChanges.addEventListener("click", () =>
    {
        const imageData = {
            id: `${Date.now()}`,
            imageUrl: document.getElementById("image-url").value,
            imageTitle: document.getElementById("image-title").value,
            imageSite: document.getElementById("image-site").value,
            imageDescription: document.getElementById("image-description").value
        };
        
            imageBody.insertAdjacentHTML("beforeend", generateNewCard(imageData));
            globalStorage.push(imageData);
            localStorage.setItem("tasky1230", JSON.stringify({key1:globalStorage}));

            document.getElementById("image-url").value = '';
            document.getElementById("image-description").value = '';
            document.getElementById("image-site").value = '';
            document.getElementById("image-title").value = '';
    });

    imageBody.addEventListener("click", (event) => {
        const clickedElement = event.target;
    
        // Check if the clicked element is the "Thrash" button
        if (clickedElement.id === "Thrash") {
            // Find the parent card element
            const cardElement = clickedElement.closest(".col-sm-12");
    
            if (cardElement) {

                // Remove the card data from globalStorage
                const cardId = cardElement.id;
                // Remove the card element from the DOM
                cardElement.remove();
    
                globalStorage = globalStorage.filter((card) => card.id !== cardId);
    
                // Update local storage after deletion
                localStorage.setItem("tasky1230", JSON.stringify({ key1: globalStorage }));
            }
        }
    });

    /*
    imageBody.addEventListener("click", (event) => {
        const clickedElement = event.target;
    
        // Check if the clicked element is the "Edit" button
        if (clickedElement.id === "Edit") {
            // Find the parent card element
            const cardElement = clickedElement.closest(".col-sm-12");
    
            if (cardElement) {
                // Set an attribute to indicate that the card is in edit mode
                cardElement.setAttribute("data-editing", "true");
    
                // Find the card's content elements (title and description)
                const titleElement = cardElement.querySelector("#title_image");
                const descriptionElement = cardElement.querySelector("#description");
    
                // Create input fields for editing
                const titleInput = document.createElement("input");
                titleInput.value = titleElement.textContent;
                const descriptionInput = document.createElement("textarea");
                descriptionInput.value = descriptionElement.textContent;
    
                // Replace the card's content with input fields
                titleElement.replaceWith(titleInput);
                descriptionElement.replaceWith(descriptionInput);
    
                // Replace the "Edit" button with a "Save" button
                clickedElement.replaceWith(createSaveButton(cardElement));
            }
        }
    });
    
    // Function to create a "Save" button
    function createSaveButton(cardElement) {
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.classList.add("btn", "btn-success", "ps-0", "pe-0");
        saveButton.id = "Save";
    
        saveButton.addEventListener("click", () => {
            // Find the card's input fields
            const titleInput = cardElement.querySelector("input");
            const descriptionInput = cardElement.querySelector("textarea");
    
            // Update the card's content with the edited values
            const titleElement = document.createElement("h5");
            titleElement.classList.add("card-title", "mt-2", "ms-1");
            titleElement.id = "title_image";
            titleElement.textContent = titleInput.value;
    
            const descriptionElement = document.createElement("p");
            descriptionElement.classList.add("card-text", "ms-1");
            descriptionElement.id = "description";
            descriptionElement.textContent = descriptionInput.value;
    
            // Replace the input fields with the updated content
            titleInput.replaceWith(titleElement);
            descriptionInput.replaceWith(descriptionElement);
    
            // Replace the "Save" button with the "Edit" button
            saveButton.replaceWith(createEditButton());
    
            // Remove the attribute indicating edit mode
            cardElement.removeAttribute("data-editing");
    
            // Update the edited card data in globalStorage
            const cardId = cardElement.id;
            const editedCardIndex = globalStorage.findIndex((card) => card.id === cardId);
            if (editedCardIndex !== -1) {
                globalStorage[editedCardIndex].imageTitle = titleElement.textContent;
                globalStorage[editedCardIndex].imageDescription = descriptionElement.textContent;
    
                // Update local storage after editing
                localStorage.setItem("tasky1230", JSON.stringify({ key1: globalStorage }));
            }
        });
    
        return saveButton;
    }
    
    // Function to create an "Edit" button
    function createEditButton() {
        const editButton = document.createElement("button");
        editButton.innerHTML = `<i class="fa-solid fa-pencil-alt"></i>` ;
        editButton.classList.add("btn", "btn-outline-success", "ps-0", "pe-0");
        editButton.id = "Edit";
        return editButton;
    }
    
*/