/**
 * This function is the inital function, when contacts.html is loading and executes the init()-function and furher necessary contacts-functions
 */
async function initContacts() {
    await init();
    renderAddressBook();
    clearActiveContacts();
    hideAllUsers("id");
    adjustUserContact("idName");
    hideNotUsedLetters();
    adjustToWindowSize();
}

/**
 * This function checks the windows inner width and toggles the visibilty of the section "contactFocus"
 */
function adjustToWindowSize() {
    if (window.innerWidth <= 900) {
        if (document.querySelector('.contact-clicked')) {
            document.getElementById("addresbookHideMobile").classList.add("d-none");
            document.getElementById("contactFocus").style.display = "flex";
            document.getElementById("editContactBtnMobile").classList.remove("d-none");
            document.getElementById("addNewContactBtnMobile").classList.add("d-none");
        } else {
            document.getElementById("addresbookHideMobile").classList.remove("d-none");
            document.getElementById("contactFocus").style.display = "none";
            document.getElementById("editContactBtnMobile").classList.add("d-none");
            document.getElementById("addNewContactBtnMobile").classList.remove("d-none");
        }
    } else {
        document.getElementById("addresbookHideMobile").classList.remove("d-none");
        document.getElementById("contactFocus").style.display = "flex";
    }
}

/**
 * This function clears the contacts-list for each letter and redirects to the function, that fills the list with contacts
 */
function renderAddressBook() {
    const addressBookContentRef = document.getElementsByClassName("contacts-letter");
    for (let indexLetter = 0; indexLetter < addressBookContentRef.length; indexLetter++) {
        addressBookContentRef[indexLetter].innerHTML = "";
    }
    renderContacts();
}

/**
 * This function extracts the first letter of each contacts name and adds the contact to the corresponding letter (with a template)
 * After that, the contacts profile-badge get its corresponding color
 */
function renderContacts() {
    for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
        let letter = contacts[indexContact].name.charAt(0).toUpperCase();
        document.getElementById("contactsLetter" + letter).innerHTML += getAddressbookContactTemplate(indexContact);
        profileBadgeColor("profileBadge" + indexContact, indexContact);
    }
}

/**
 * This function is executed after the address book finished rendering and iterates through each letter and hides it, if it does not contain any contact
 */
function hideNotUsedLetters() {
    const addressBookContentRef = document.getElementsByClassName("contacts-letter");
    const letterContentRef = document.getElementsByClassName("address-book-letter");
    for (let indexLetter = 0; indexLetter < letterContentRef.length; indexLetter++) {
        if (addressBookContentRef[indexLetter].innerHTML == "") {
            letterContentRef[indexLetter].classList.add("d-none");
        } else {
            letterContentRef[indexLetter].classList.remove("d-none");
        }
    }
}

/**
 * This function removes the 'contact-clicked'-class from all contacts
 */
function clearActiveContacts() {
    document.querySelectorAll('.contact-clicked').forEach(contact => contact.classList.remove("contact-clicked"));
}

/**
 * This function opens the ContactsOverlay (for addding a new or editing an existing contact), background-overlay and overlay-animations)
 */
function openContactsOverlay() {
    clearContactForm();
    document.getElementById("overlayBg").classList.remove("d-none");
    document.getElementById("overlayContact").classList.remove("d-none");
    document.getElementById("overlayBg").style.animationName = "openBgOverlay";
    document.getElementById("overlayContact").style.animationName = "openOverlay";
}

/**
 * This function opens the ContactsOverlay 
 */
function closeContactsOverlay() {
    document.getElementById("overlayBg").style.animationName = "closeBgOverlay";
    document.getElementById("overlayContact").style.animationName = "closeOverlay";
    setTimeout(function () {
        document.getElementById("overlayContact").classList.add("d-none");
        document.getElementById("overlayBg").classList.add("d-none");
    }, 600);
}

/**
 * This function is used, when the user wants to add a new contact instead of editing one.
 * The contacts-overlay adjusts accordingly.
 */
function adjustOverlayToAdd() {
    document.getElementById("overlayTitleH1").innerHTML = "Add contact";
    document.getElementById("overlayTitleP").innerHTML = "Tasks are better with a team!";
    document.getElementById("overlayProfileBadge").style.backgroundColor = "#D1D1D1";
    document.getElementById("overlayProfileBadge").innerHTML = "<img src='../assets/contacts_pb_anonymous.svg'>";
    document.getElementById("contactsAddSubmitBtns").classList.remove("d-none");
    document.getElementById("contactsEditSubmitBtns").classList.add("d-none");
}

/**
 * This function is used, when the user wants to edit a contact instead of adding a new one.
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function adjustOverlayToEdit(indexContact) {
    document.getElementById("overlayTitleH1").innerHTML = "Edit contact";
    document.getElementById("overlayTitleP").innerHTML = "";
    document.getElementById("addContactName").value = contacts[indexContact].name;
    document.getElementById("addContactMail").value = contacts[indexContact].mail;
    document.getElementById("addContactPhone").value = contacts[indexContact].phone;
    profileBadgeColor("overlayProfileBadge", indexContact);
    document.getElementById("overlayProfileBadge").innerHTML = nameAbbreviation(indexContact);
    document.querySelector(".index-contact").id = indexContact;
    document.getElementById("contactsEditSubmitBtns").classList.remove("d-none");
    document.getElementById("contactsAddSubmitBtns").classList.add("d-none");
}

/**
 * This function clears the input-values of the contact-overlay-form
 */
function clearContactForm() {
    document.querySelectorAll("input").forEach((element) => { element.value = "" });
}

/**
 * This function reads out the data of the add-contact-form and sends it to firebase to add a new contact
 */
async function addContact() {
    let contactName = validateNameInput("addContactName");
    let contactMail = validateMailInput("addContactMail");
    let mailExists = checkMailAlreadyExists('addContactMail');
    if (contactName !== "" && contactMail !== "" && document.getElementById("addContactPhone").value.trim() !== "" && mailExists == false) {
        await postData("/contacts/", {
            "name": contactName,
            "mail": contactMail,
            "phone": document.getElementById("addContactPhone").value.trim(),
            "color": await assignRandomColor(contacts.length + 1)
        });
        contactSuccessfully("Created");
    } else { checkContactsInputs() }
    if (document.getElementById("addContactPhone").value.trim() == "") { contactsPhoneRequirementUnfullfilled() }
}

/**
 * This function redirects to different functions that are used to display the clicked contact 
 * 
 * @param {string} activity - whether the contact should be added or edited
 * @param {number} indexContact - the index of the contact in the contacts-array (or indexContactUser, if the user is edited)
 */
function contactSuccessfully(activity, indexContact) {
    successfullMsg("contactSuccesfully" + activity);
    initContacts();
    closeContactsOverlay();
    if (activity == "Edited") {
        contactClicked(indexContact);
    }
}

/**
 * This function executes the checkFilledInput-functions for each of the inputs
 */
function checkContactsInputs() {
    checkFilledInput("addContactName");
    checkFilledInput("addContactMail");
    checkFilledInput("addContactPhone");
}

/**
 * This function shows the alertPhone, if the contactPhone-input is empty
 */
function contactsPhoneRequirementUnfullfilled() {
    document.getElementById("alertPhone").classList.remove("invisible");
    setTimeout(function () {
        document.getElementById("alertPhone").classList.add("invisible");
    }, 2400);
}

/**
 * This function redirects to different functions that are used to display the clicked contact 
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function contactClicked(indexContact) {
    if (window.innerWidth <= 900) {
        contactClickedMobile(indexContact);
    }
    clearActiveContacts(); 
    highlightContact(indexContact);
    updateFocusedContact(indexContact);
}

/**
 * This function adjusts the page for the mobile version, if a contact was clicked
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function contactClickedMobile(indexContact) {
    document.getElementById("addresbookHideMobile").classList.add("d-none");
    document.getElementById("contactFocus").style.display = "flex";
    document.getElementById("addNewContactBtnMobile").classList.add("d-none");
    document.getElementById("editContactBtnMobile").classList.remove("d-none");
    document.getElementById("arrowBackwardsMobile").classList.remove("d-none");
    document.getElementById("menuEditDeleteMobile").innerHTML = getContactsMenuMobileTemplate(indexContact);
    if (indexContact == indexContactUser) {
        document.getElementById("deleteBtnContactsMobile").classList.add("d-none");
    }

}

/**
 * This function closes the focused contact and shows the addressbook again
 */
function mobileArrowBackwards() {
    document.getElementById("contactFocus").style.display = "none";
    document.getElementById("addresbookHideMobile").classList.remove("d-none");
    document.getElementById("editContactBtnMobile").classList.add("d-none");
    document.getElementById("addNewContactBtnMobile").classList.remove("d-none");
}

/**
 * This function toggles the visibilty of the delete-/edit-contact-menu for mobile
 */
function toggleEditDeleteMenuMobile() {
    document.getElementById("menuEditDeleteMobile").classList.toggle("d-none");
    document.getElementById("overlayInvisible").classList.toggle("d-none");
}

/**
 * This function adds the 'contact-clicked'-class to the clicked contact (userfeedback)
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
function highlightContact(indexContact) {
    document.getElementById("id" + indexContact).classList.add("contact-clicked");
}

/** 
 * This function shows the clicked contact in a large view
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */ 
function updateFocusedContact(indexContact) {
    let focusedContactRef = document.getElementById("focusedContactInformation");
    focusedContactRef.innerHTML = "";
    setTimeout(() => {
        focusedContactRef.style.animationName = "openFocusedContact";
        focusedContactRef.innerHTML = getFocusedContactTemplate(indexContact);
        profileBadgeColor("focusedProfileBadge", indexContact);
        if (indexContact == indexContactUser) {
            adjustUserContact("idFocusedName");
            document.getElementById("deleteBtnContacts").classList.add("d-none");
        }
    }, 250)
    focusedContactRef.style.animationName = "unset";
}

/**
 * This function reads out the data of the add-contact-form and sends it to firebase to replace the previous contacts-data
 */
async function saveEditContact() {
    let contactName = validateNameInput("addContactName");
    let contactMail = validateMailInput("addContactMail");
    let indexContact = document.querySelector(".index-contact").id;
    let mailExists = checkMailAlreadyExists('addContactMail');
    if (indexContact !== indexContactUser) {
        if (contactName !== "" && contactMail !== "" && document.getElementById("addContactPhone").value.trim() !== "" && mailExists == false) {
            await putData("/contacts/" + contacts[indexContact].url, {
                "name": contactName,
                "mail": contactMail,
                "phone": document.getElementById("addContactPhone").value.trim(),
                "color": contacts[indexContact].color
            });
            contactSuccessfully("Edited", indexContact);
        } else { checkContactsInputs() }
    } else { saveEditContactUser() }
    if (document.getElementById("addContactPhone").value.trim() == "") { contactsPhoneRequirementUnfullfilled() }
}

/**
 * This function checks if the inputs are valide and saves the edited contact
 */
async function saveEditContactUser() {
    let userName = validateNameInput("addContactName");
    let userMail = validateMailInput("addContactMail");
    if (userName !== "" && userMail !== "" && document.getElementById("addContactPhone").value.trim() !== "") {
        await editContactUser(userName, userMail);
        contactSuccessfully("Edited", indexContactUser);
    } else { checkContactsInputs() }
    if (document.getElementById("addContactPhone").value.trim() == "") { contactsPhoneRequirementUnfullfilled(); }
}

/**
 * This function sends the data of the add-contact-form to firebase to replaces the previous data (for users and contacts)
 * 
 * @param {string} userName - the name of the edited user
 * @param {string} userMail - the mail address of the edited user
 */
async function editContactUser(userName, userMail) {
    await putData("/users/" + users[currentUser].url, {
        "name": userName,
        "mail": userMail,
        "password": users[currentUser].password
    });
    await putData("/contacts/" + contacts[indexContactUser].url, {
        "name": userName,
        "mail": userMail,
        "phone": document.getElementById("addContactPhone").value.trim(),
        "color": contacts[indexContactUser].color
    });
}

/**
 * This function sends the path of the contact that should be deleted to firebase
 * 
 * @param {number} indexContact - the index of the contact in the contacts-array
 */
async function deleteContact(indexContact) {
    await deleteData("/contacts/" + contacts[indexContact].url);
    contactSuccessfully("Deleted")
    document.getElementById("focusedContactInformation").innerHTML = "";
    initContacts();
    if (window.innerWidth <= 1000) {
        mobileArrowBackwards();
    }
}

/**
 * This function checks if the pressed key is a N umber and returns it if true.
 * Like this, only numbers (and "+") are valide inputs
 * 
 * @param {KeyboardEvent} event - keydown-event to fill the input
 */
function onlyAllowNumbers(event) {
    if (!isNaN(event.key) || event.key == "Backspace") {
        return event.key;
    } else if (event.key == "+" && document.getElementById("addContactPhone").value.includes("+") == false) {
        return event.key;
    } else {
        event.preventDefault()
    }
}

/**
 * This function checks if the pressed key is a not space and returns it if true.
 * Furthermore it only returns '@' if the input does not already contain it.
 * 
 * @param {KeyboardEvent} event - keydown-event to fill the input
 */
function onlyAllowMailAddress(event) {
    if (event.key == " ") {
        event.preventDefault();
    } else if (event.key == "@" && document.getElementById("addContactMail").value.includes("@")) {
        event.preventDefault();
    } else {
        return event.key;
    }
}