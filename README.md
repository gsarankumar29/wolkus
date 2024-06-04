# Movie Watchlist App

A web application that allows users to sign up, log in, search for movies using the OMDB API, and add movies to their personal watchlist.

## Features

- User Authentication (Sign Up, Log In, Log Out)
- Movie Search using OMDB API
- Add movies to personal watchlist
- View personal watchlist
- Responsive and dark-themed UI with minimal animations

## Technologies Used

- HTML, CSS, JavaScript (Frontend)
- Node.js, Express.js (Backend)
- MongoDB (Database)
- OMDB API (Movie Data)
- Vercel (Deployment)

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/movie-watchlist-app.git
    cd movie-watchlist-app
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Start the MongoDB server. You can use MongoDB Atlas or run a local MongoDB server.

4. Create a `.env` file in the root directory and add your OMDB API key:

    ```plaintext
    OMDB_API_KEY=your_omdb_api_key
    ```

5. Start the server:

    ```bash
    node server.js
    ```

6. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Sign up for a new account.
2. Log in with your credentials.
3. Use the search bar to find movies.
4. Add movies to your watchlist by clicking the "Add to Watchlist" button.
5. View your watchlist on the main page.
6. Log out by clicking the "Logout" button.

## Deployment

1. Install the Vercel CLI if you haven't already:

    ```bash
    npm install -g vercel
    ```

2. Navigate to your project directory:

    ```bash
    cd path/to/your/project
    ```

3. Run the Vercel deployment command:

    ```bash
    vercel
    ```

4. Follow the prompts to configure your deployment settings.
5. Once the deployment is complete, Vercel will provide you with a unique URL for your deployed application.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or feedback, feel free to reach out:

- Email: your-email@example.com
- GitHub: [your-username](https://github.com/your-username)
