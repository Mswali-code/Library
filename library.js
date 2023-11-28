class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    };
};

const myLibraryManager  = (function () {
    const demoBooks = [
        { title: "Conversations on Love", author: "Natasha Lunn", pages: 320, read: false },
        { title: "Crime and punishment", author: "Fyodor Dostoyevsky", pages: 576, read: false }
    ];

    const storedLibrary = JSON.parse(localStorage.getItem("userLibrary"));
    const userLibrary = storedLibrary || demoBooks.map(book => new Book(book.title, book.author, book.pages, book.read));

    function saveLibraryToLocalStorage() {
        localStorage.setItem("userLibrary", JSON.stringify(userLibrary));
    };

    function addBookToLibrary(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        userLibrary.push(newBook);
        uI.displayLibraryAsCards();
        form.resetForm();
        saveLibraryToLocalStorage();
    };

    function getDemoBooks() {
        return [...demoBooks];
    };

    function getLibrary() {
        return [...userLibrary];
    };

    function removeBook(index) {
        userLibrary.splice(index, 1);
        uI.displayLibraryAsCards();
        saveLibraryToLocalStorage();
    };

    function resetLibrary() {
        userLibrary.length = 0;
        demoBooks.forEach(book => {
            userLibrary.push(new Book(book.title, book.author, book.pages, book.read));
        });
        uI.displayLibraryAsCards();
        saveLibraryToLocalStorage();

    };

    function clearLibrary() {
        userLibrary.length = 0; 
        uI.displayLibraryAsCards(); 
        saveLibraryToLocalStorage(); 
    };

    return {
        addBookToLibrary,
        getDemoBooks,
        getLibrary,
        removeBook,
        resetLibrary,
        clearLibrary
    };
})();

const bookActions = (function () {
    function toggleReadStatus(book, readButton, readStatusElement) {
        const wasRead = book.read;
        book.read = !book.read;
        readButton.textContent = book.read ? "Mark as not read" : "Mark as read";
        readStatusElement.textContent = `Read: ${book.read ? "Yes" : "No"}`;

        if (wasRead !== book.read && book.read) {
            uI.updateReadCount();
        }
    };

    function toggleAdditionalInfo(additionalInfoElement, readMoreButton) {
        if (additionalInfoElement.style.display === 'none') {
            additionalInfoElement.style.display = 'block';
            readMoreButton.textContent = "Read Less";
        } else {
            additionalInfoElement.style.display = 'none';
            readMoreButton.textContent = "Read More";
        }
    };

    function updateBookDetails(book, titleElement, authorElement, pagesElement) {
        book.title = titleElement.querySelector("input").value;
        book.author = authorElement.querySelector("input").value;
        book.pages = pagesElement.querySelector("input").value;
    };

    return {
        toggleReadStatus,
        toggleAdditionalInfo,
        updateBookDetails
    };
})();

const uI = (function () {
    const displayElement = document.querySelector("#display-book");
    const resetButton = document.querySelector("#reset-library-button");
    const clearButton = document.querySelector("#clear-library-button");

    function displayLibraryAsCards() {
        displayElement.innerHTML = "";
        const library = myLibraryManager.getLibrary();

        library.forEach((book, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("book-card");

            const bookInfoElement = document.createElement("div");
            bookInfoElement.classList.add("book-info");

            const titleElement = document.createElement("div");
            titleElement.classList.add("book-title");
            titleElement.textContent = `Title: ${book.title}`;

            const authorElement = document.createElement("div");
            authorElement.classList.add("book-details");
            authorElement.textContent = `Author: ${book.author}`;

            const additionalInfoElement = document.createElement("div");
            additionalInfoElement.classList.add("additional-info");
            additionalInfoElement.style.display = "none";

            const pagesElement = document.createElement("div");
            pagesElement.classList.add("book-details");
            pagesElement.textContent = `Pages: ${book.pages}`;

            const readStatusELement = document.createElement("div");
            readStatusELement.classList.add("book-details");
            readStatusELement.textContent = `Read: ${book.read ? "Yes" : "No"}`;

            const changeReadStatusButton = document.createElement("button");
            changeReadStatusButton.classList.add("changeReadStatusButton");
            changeReadStatusButton.textContent = book.read ? "Mark as not read" : "Mark as read";

            changeReadStatusButton.addEventListener("click", function () {
                bookActions.toggleReadStatus(book, changeReadStatusButton, readStatusELement);
                uI.updateReadCount();
            })

            const readMoreButton = document.createElement("button");
            readMoreButton.classList.add("toggle-readmore-button");
            readMoreButton.textContent = "Read More";

            readMoreButton.addEventListener("click", function () {
                bookActions.toggleAdditionalInfo(additionalInfoElement, readMoreButton);
            });

            const editButton = document.createElement("button");
            editButton.classList.add("edit-button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function () {
    
                if (cardElement.querySelector(".save-button")) {
                    return;
                }

                titleElement.innerHTML = `<input type="text" value="${book.title}">`;
                authorElement.innerHTML = `<input type="text" value="${book.author}">`;
                pagesElement.innerHTML = `<input type="number" value="${book.pages}">`;

                const saveButton = document.createElement("button");
                saveButton.textContent = "Save";
                saveButton.classList.add("save-button");

                saveButton.addEventListener("click", function () {
                   
                    bookActions.updateBookDetails(book, titleElement, authorElement, pagesElement);
                    uI.displayLibraryAsCards(book);
                });

                cardElement.appendChild(saveButton);
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-button");
            removeButton.setAttribute("data-index", index);

            removeButton.addEventListener("click", function () {
                myLibraryManager.removeBook(index);
                displayLibraryAsCards();
                updateReadCount(); 
            });

            additionalInfoElement.appendChild(pagesElement);
            additionalInfoElement.appendChild(readStatusELement);
            additionalInfoElement.appendChild(changeReadStatusButton);

            bookInfoElement.appendChild(titleElement);
            bookInfoElement.appendChild(authorElement);
            bookInfoElement.appendChild(additionalInfoElement);

            cardElement.appendChild(bookInfoElement);
            cardElement.appendChild(readMoreButton);
            cardElement.appendChild(editButton);
            cardElement.appendChild(removeButton);

            displayElement.appendChild(cardElement);
        });
    };

    resetButton.addEventListener("click", function () {
        myLibraryManager.resetLibrary();
        updateReadCount(); 
    });

    clearButton.addEventListener("click", function () {
        myLibraryManager.clearLibrary();
        updateReadCount(); 
    });

    function updateReadCount () {
        const readBooks = myLibraryManager.getLibrary().filter(book => book.read).length;
        const booksReadCountElement = document.querySelector("#booksread-count");
        booksReadCountElement.textContent = `Books read: ${readBooks}`;
    };

    return {
        displayLibraryAsCards,
        updateReadCount
    };
})();

const form = (function () {
    const titleInput = document.querySelector("#title");
    const authorInput = document.querySelector("#author");
    const pagesInput = document.querySelector("#pages");
    const readInput = document.querySelector("#read");
    const bookDialog = document.querySelector("#book-dialog");
    const confirmButton = document.querySelector("#book-form button[type='submit']");
    const cancelButton = document.querySelector("#closeDialogButton");
    const newBookButton = document.querySelector("#new-book-button");
    const errorMessageElement = document.querySelector("#error-message");

    confirmButton.addEventListener("click", function (event) {
        event.preventDefault();
        const title = titleInput.value.toLowerCase(); 
        const author = authorInput.value;
        const pages = pagesInput.value;
        const read = readInput.checked;

        const existingBook = myLibraryManager.getLibrary().find(book => book.title.toLowerCase() === title) ||
        myLibraryManager.getDemoBooks().find(book => book.title.toLowerCase() === title);

        if (existingBook) {
            errorMessageElement.textContent = "A book with the same title already exists!";
        } else if (validateInputs(title, author, pages)) {
            myLibraryManager.addBookToLibrary(title, author, pages, read);
            uI.displayLibraryAsCards();
            uI.updateReadCount();
            resetForm();
            bookDialog.close();
            errorMessageElement.textContent = "";
        } else {
            errorMessageElement.textContent = "Please fill in all fields.";
        }
    });

       /*  if (validateInputs(title, author, pages)) {
            myLibraryManager.addBookToLibrary(title, author, pages, read);
            uI.displayLibraryAsCards();
            uI.updateReadCount();
            resetForm();
            bookDialog.close();
            errorMessageElement.textContent = "";  
        } else {
            errorMessageElement.textContent = "Please fill in all fields.";
        };
        
    }); */

    cancelButton.addEventListener("click", function () {
        resetForm();
        bookDialog.close();
    });

    newBookButton.addEventListener("click", function () {
        resetForm();
        bookDialog.showModal();
    });

    function resetForm() {
        titleInput.value = "";
        authorInput.value = "";
        pagesInput.value = "";
        readInput.checked = false;
    };

    function validateInputs(title, author, pages) {
        return title.trim() !== "" && author.trim() !== "" && pages.trim() !== "";
    };

    return {
        resetForm,
    };
})();

uI.displayLibraryAsCards();

