document.getElementById('search-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const query = document.getElementById('search-query').value;
    const response = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    const data = await response.json();
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';
    if (data.Search) {
        data.Search.forEach(movie => {
            const movieDiv = document.createElement('div');
            movieDiv.textContent = `${movie.Title} (${movie.Year})`;
            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Watchlist';
            addButton.addEventListener('click', async function() {
                await fetch('/add-to-watchlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movieId: movie.imdbID })
                });
                window.location.reload();
            });
            movieDiv.appendChild(addButton);
            resultsDiv.appendChild(movieDiv);
        });
    } else {
        resultsDiv.textContent = 'No results found.';
    }
});


// Assuming you have a button with class "delete-btn" for each item in the watchlist
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
        const movieId = event.target.dataset.movieId; // Assuming movieId is stored as a data attribute
        try {
            const response = await fetch('/delete-from-watchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ movieId }) // Send movieId to server for deletion
            });
            if (response.ok) {
                // Refresh the page or update the watchlist UI after successful deletion
                location.reload();
            } else {
                console.error('Failed to delete item from watchlist');
            }
        } catch (error) {
            console.error('Error occurred while deleting item from watchlist:', error);
        }
    });
});

