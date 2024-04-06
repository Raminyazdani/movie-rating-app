describe('Favorites API Endpoints', () => {
  const BASE_URL = 'http://localhost:3001'; // Update with your API's base URL
  const testUserId = '1'; // Assume a test user ID exists in your database
  const testImdbId = 'tt0111161'; // Assume a test IMDb ID; replace with an actual ID relevant to your database
  const testType = 'movie'; // Example type, adjust as necessary
  
  // Fetching a user's favorites
  it('Fetches user favorites successfully', () => {
    cy.request(`${BASE_URL}/api/favorites/${testUserId}`).then((response) => {
      expect(response.status).to.eq(200);
      // Perform additional assertions on the response body as necessary
    });
  });

  // Adding an item to favorites
  it('Adds an item to favorites successfully', () => {
    cy.request('POST', `${BASE_URL}/api/favorites`, {
      userId: testUserId,
      imdbId: testImdbId,
      type: testType
    }).then((response) => {
      expect(response.status).to.eq(200); // Adjust based on your API's expected success status code for a POST operation
      // Perform additional assertions on the response body as necessary
    });
  });

  // Removing an item from favorites
  it('Removes an item from favorites successfully', () => {
    cy.request('DELETE', `${BASE_URL}/api/favorites/${testUserId}/${testImdbId}/${testType}`).then((response) => {
      expect(response.status).to.eq(200); // Adjust based on your API's expected success status code for a DELETE operation
      // Perform additional assertions on the response body as necessary
    });
  });

  // Handling errors - Attempting to fetch favorites with an invalid user ID
  it('Handles errors when fetching favorites for a non-existent user', () => {
    cy.request({
      method: 'GET',
      url: `${BASE_URL}/api/favorites/nonexistentuser`,
      failOnStatusCode: false // Prevent Cypress from failing the test on statusCode other than 2xx and 3xx
    }).then((response) => {
      expect(response.status).to.eq(500); // Assuming your API responds with a 500 error for a non-existent user
    });
  });
});
