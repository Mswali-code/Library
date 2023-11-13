class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
};

const myLibraryManager  = (function () {

    const initialLibrary = [
        { title: "Conversations on Love", author: "Natasha Lunn", pages: 320, read: false },
        { title: "Crime and punishment", author: "Fyodor Dostoyevsky", pages: 576, read: false },
        { title: "Finished", author: "Jon Acuff", pages: 135, read: false },
        { title: "Maps of Meaning", author: "Jordan Peterson", pages: 562, read: false },
        { title: "Feel the fear and do it anyways", author: "Susan Jeffers", pages: 214, read: false },
        { title: "Man's Search For Meaning", author: "Viktor E. Frankl", pages: 184, read: false },
        { title: "We should all be millionares", author: "Rachel Rodgers", pages: 288, read: false },
        { title: "The highly sensitive person", author: "Elaine N. Aron", pages: 251, read: false },
        { title: "A woman's worth", author: "Marianne Williamson", pages: 288, read: false },
        { title: "No bad parts Internal Family Systems", author: "Richard C. Schwartz", pages: 216, read: false },
        { title: "Who dies?", author: "Stephen and Ondrea Levine", pages: 317, read: false },
        { title: "Men Who Hate Women & The Women Who Love Them", author: "Dr. Susan Forward and Joan Torres", pages: 304, read: false },
        { title: "Men Who Hate Women ", author: "Laura Bates", pages: 366, read: false },
        { title: "Pride and Prejudice", author: "Jane Austen", pages: 496, read: false }
    ];

    const library = initialLibrary.map(book => new Book(book.title, book.author, book.pages, book.read));

    function addBookToLibrary(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        library.push(newBook);
        uI.displayLibraryAsCards();
        form.resetForm();
    };

    function resetLibrary() {
        library.length = 0;
        initialLibrary.forEach(book => {
            library.push({ ...book });
        });
        uI.displayLibraryAsCards();
    }

    function removeBook(index) {
        library.splice(index, 1);
        uI.displayLibraryAsCards();
    }

    function getLibrary() {
        return [...library];
    }

    return {
        addBookToLibrary,
        resetLibrary,
        removeBook,
        getLibrary,
    };
})();

const bookActions = (function () {
    function toggleReadStatus(book, readButton, readStatusElement) {
        book.read = !book.read;
        readButton.textContent = book.read ? "Mark as not read" : "Mark as read";
        readStatusElement.textContent = `Read: ${book.read ? "Yes" : "No"}`;
    }

    function removeBook(index) {
        myLibraryManager.removeBook(index);
    }

    return {
        toggleReadStatus,
        removeBook,
    };
})();

const uI = (function () {
    const displayElement = document.querySelector("#display-book");

    function displayLibraryAsCards() {
        displayElement.innerHTML = '';
        const library = myLibraryManager.getLibrary();

        library.forEach((book, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");

            const titleElement = document.createElement("div");
            titleElement.classList.add("book-title");
            titleElement.textContent = `Title: ${book.title}`;

            const authorElement = document.createElement("div");
            authorElement.classList.add("book-details");
            authorElement.textContent = `Author: ${book.author}`;

            const pagesElement = document.createElement("div");
            pagesElement.classList.add("book-details");
            pagesElement.textContent = `Pages: ${book.pages}`;

            const readStatusELement = document.createElement("div");
            readStatusELement.classList.add("book-details");
            readStatusELement.textContent = "Read: No";

            const readButton = document.createElement("button");
            readButton.textContent = book.read ? "Mark as not read" : "Mark as read";

            readButton.addEventListener("click", function () {
                bookActions.toggleReadStatus(book, readButton, readStatusELement);
            });

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.classList.add("remove-button");
            removeButton.setAttribute("data-index", index);

            removeButton.addEventListener("click", function () {
                bookActions.removeBook(index);
                displayLibraryAsCards();
            });

            cardElement.appendChild(titleElement);
            cardElement.appendChild(authorElement);
            cardElement.appendChild(pagesElement);
            cardElement.appendChild(readStatusELement);
            cardElement.appendChild(readButton);
            cardElement.appendChild(removeButton);

            displayElement.appendChild(cardElement);
        });
    }

    return {
        displayLibraryAsCards,
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
    const newBookButton = document.querySelector("#new-book-button")

    confirmButton.addEventListener("click", function (event) {
        event.preventDefault();
        const title = titleInput.value;
        const author = authorInput.value;
        const pages = pagesInput.value;
        const read = readInput.checked;

        myLibraryManager.addBookToLibrary(title, author, pages, read);
        uI.displayLibraryAsCards();
        resetForm();
        bookDialog.close();
    });

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
    }

    return {
        resetForm,
    };
})();

const reset = (function () {
    const resetButton = document.querySelector("#reset-library-button");

    resetButton.addEventListener("click", function () {
        myLibraryManager.resetLibrary();
        uI.displayLibraryAsCards();
    });
})();

uI.displayLibraryAsCards();

