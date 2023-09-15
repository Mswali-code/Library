let libraryDisplayed = false;
let newBookButton = document.querySelector("#new-book-button");
let bookDialog = document.querySelector("#book-dialog");

const myLibrary = [
    {author: "Natasha Lunn", title: "Conversations on Love", pages: 320},
    {author: "Fyodor Dostoyevsky", title: "Crime and punishment", pages: 576},
    {author: "Jon Acuff", title: "Finished", pages: 135},
    {author: "Jordan Peterson", title: "Maps of Meaning", pages: 562},
    {author: "Susan Jeffers", title: "Feel the fear and do it anyways", pages: 214},
    {author: "Viktor E. Frankl", title: "Man's Search For Meaning", pages: 184}
];

function Book(author, title, pages) {
    this.author = author,
    this.title = title,
    this.pages = pages
}

function displayLibraryAsCards(library) {    
    let displayElement = document.querySelector("#display-book"); 

    library.forEach(book => {
        let cardElement = document.createElement("div");
        cardElement.classList.add("card");

        let titleElement = document.createElement("div");
        titleElement.classList.add("book-title");
        titleElement.textContent = `Title: ${book.title}`;

        let authorElement = document.createElement("div");
        authorElement.classList.add("book-details");
        authorElement.textContent = `Author: ${book.author}`;

        let pagesElement = document.createElement("div");
        pagesElement.classList.add("book-details");
        pagesElement.textContent = `Pages: ${book.pages}`;

        cardElement.appendChild(titleElement);
        cardElement.appendChild(authorElement);
        cardElement.appendChild(pagesElement);

        displayElement.appendChild(cardElement);
    });  
    
    libraryDisplayed = true;
};
displayLibraryAsCards(myLibrary);  

function addBookToLibrary(author, title, pages) {
    let newBook = new Book (author, title, pages);
    myLibrary.push(newBook);

    if (libraryDisplayed) {
        displayLibraryAsCards([newBook]);
    } else {
        displayLibraryAsCards(myLibrary);
    }

    document.querySelector("#author").value = "";
    document.querySelector("#title").value = "";
    document.querySelector("#pages").value = "";

    bookDialog.close();
};    

document.querySelector("#book-form").addEventListener("submit", function(event) {   event.preventDefault();

    let author = document.querySelector("#author").value;
    let title = document.querySelector("#title").value;
    let pages = document.querySelector("#pages").value;

    addBookToLibrary(author, title, pages);
});

newBookButton.addEventListener("click", function() {
   bookDialog.showModal();
});

document.querySelector("#closeDialogButton").addEventListener("click", function() {
    bookDialog.close();
});




