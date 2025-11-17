
async function searchBooks() {
    const query = document.getElementById("query").value;
    

    const res = await fetch ('https://www.googleapis.com/books/v1/volumes?q=intitle:${sabrina}');
    const data = await res.json();

    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML =" ";

    if(!data.items) {
        resultDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.items.forEach (book => {
        const info = book.volumeInfo;

        //Check if book has ISBN
        const isbn = info.industryIdentifiers ? info.industryIdentifiers[0].identifier: null;

        const resultDiv = document.getElementById("results")
        resultDiv.innerHTML += `
            <div class ="book">
                <img src="${info.imageLinks?.thumbnail || " "} alt= "Cover">
                <h3>${info.title}</h3>
                <p><strong>Author:</strong> ${info.authors?.join (", ") || 'Not applicable'}</p>
                <p><strong>Rating:</strong>${info.averageRating || 'No rating'}</p>
                <div id = "reviews-${isbn}"> Loading reviews... </div>
            </div>
        ` ;
        if (isbn) loadReviews (isbn);
    });


}

async function loadReviews(isbn){
        if (!isbn) return;

        try {
        //Get book from OpenLibrary using the ISBN
        const bookRes = await fetch ('https://openlibrary.org/isbn/${isbn}.json');
        const bookData = await bookRes.json();

        //Get Work ID
        const workKey = bookData.works ? bookData.works[0].key : null;
        
        if (!workKey) {
            document.getElementById ('reviews-${isbn}').innerHTML = "No reviews";
            return;
        }

        // Get the reviews
        const reviewRes = await fetch(`https://openlibrary.org${workKey}/reviews.json`);
        const reviewData = await reviewRes.json();

        const reviewsDiv = document.getElementById(`reviews-${isbn}`);
        reviewsDiv.innerHTML = "";

        if(!reviewData.reviews?.length) {
            reviewsDiv.innerHTML = "No reviews available.";
            return;
        }

    //Step 4: Display reviews
    reviewData.reviews.slice (0,3). forEach (r => {
                reviewsDiv.innerHTML += `
            <div class = "review">
                <p>${r.review}</p>
                <small>Rating: ${r.rating || 'N/A' }</small>
            </div>
        `;
    });
} catch (e) {
    document.getElementById ('reviews-${isbn}').innerHTML = "Reveiws can't be loaded :("
}

}



