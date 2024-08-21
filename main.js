const API_KEY = '71e57ecc'; // Replace with your OMDB API key
const RESULTS_PER_PAGE = 10; // Number of results to display per page

let currentPage = 1; // Track the current page
let searchTerm = ''; // Store the search term

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    searchTerm = document.getElementById('search-input').value.trim();
    if (searchTerm) {
        currentPage = 1; // Reset to first page on new search
        fetchMovies(searchTerm, currentPage);
    }
});

async function fetchMovies(term, page) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?s=${term}&page=${page}&apikey=${API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
            displayResults(data.Search, data.totalResults, page);
        } else {
            displayError(data.Error);
        }
    } catch (error) {
        displayError("An error occurred while fetching data. Please try again later.");
    }
}

function displayResults(movies, totalResults, page) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
          
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
         
        `;
        resultsDiv.appendChild(movieElement);
    });

    displayPaginationControls(totalResults, page);
}

function displayPaginationControls(totalResults, page) {
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
    const paginationDiv = document.getElementById('pagination-controls');
    paginationDiv.innerHTML = '';

    // Create Previous button if not on the first page
    if (page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            currentPage--;
            fetchMovies(searchTerm, currentPage);
        });
        paginationDiv.appendChild(prevButton);
    }

    // Create Next button if not on the last page
    if (page < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            currentPage++;
            fetchMovies(searchTerm, currentPage);
        });
        paginationDiv.appendChild(nextButton);
    }
}

function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p class="error">${message}</p>`;
}
