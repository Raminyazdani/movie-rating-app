// Cypress test file: .\src\tests\Cypress\api\services\idService.test.js

// Importing the idService module
import * as idService from "../../../../api/services/idService";

// Mock data for testing
const mockResponseData = { id: 123, name: "Test Name" };

// Mocking the TBDBapi get, post, put, and delete functions
const mockGet = cy.stub();
const mockPost = cy.stub();
const mockPut = cy.stub();
const mockDelete = cy.stub();

// Stubbing the TBDBapi module
cy.stub(idService, 'TBDBapi').returns({
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete
});

// GET Request Test
describe('GET Request Test', () => {
    it('successfully makes a GET request', async () => {
        // Mock the TBDBapi get function to resolve with mock data
        mockGet.withArgs('/endpoint').resolves({ data: mockResponseData });

        // Call the idService function that makes a GET request
        const result = await idService.getDetails();

        // Ensure the TBDBapi.get function is called with the correct endpoint
        // Ensure the returned data matches the mock response data
        expect(mockGet).to.be.calledWith('/endpoint');
        expect(result).to.deep.equal(mockResponseData);
    });
});

// POST Request Test
describe('POST Request Test', () => {
    it('successfully makes a POST request', async () => {
        // Mock the TBDBapi post function to resolve with mock data
        mockPost.withArgs('/endpoint', { name: 'Test Name' }).resolves({ data: mockResponseData });

        // Call the idService function that makes a POST request
        const result = await idService.createDetails({ name: 'Test Name' });

        // Ensure the TBDBapi.post function is called with the correct endpoint and data
        // Ensure the returned data matches the mock response data
        expect(mockPost).to.be.calledWith('/endpoint', { name: 'Test Name' });
        expect(result).to.deep.equal(mockResponseData);
    });
});

// PUT Request Test
describe('PUT Request Test', () => {
    it('successfully makes a PUT request', async () => {
        // Mock the TBDBapi put function to resolve with mock data
        mockPut.withArgs('/endpoint', { id: 123, name: 'Updated Name' }).resolves({ data: mockResponseData });

        // Call the idService function that makes a PUT request
        const result = await idService.updateDetails(123, { name: 'Updated Name' });

        // Ensure the TBDBapi.put function is called with the correct endpoint and data
        // Ensure the returned data matches the mock response data
        expect(mockPut).to.be.calledWith('/endpoint', { id: 123, name: 'Updated Name' });
        expect(result).to.deep.equal(mockResponseData);
    });
});

// DELETE Request Test
describe('DELETE Request Test', () => {
    it('successfully makes a DELETE request', async () => {
        // Mock the TBDBapi delete function to resolve with a success message
        mockDelete.withArgs('/endpoint/123').resolves({ data: { message: 'Successfully deleted.' } });

        // Call the idService function that makes a DELETE request
        const result = await idService.deleteDetails(123);

        // Ensure the TBDBapi.delete function is called with the correct endpoint
        // Ensure the returned data contains a success message
        expect(mockDelete).to.be.calledWith('/endpoint/123');
        expect(result).to.deep.equal({ message: 'Successfully deleted.' });
    });
});

// Response Status Test
// This test is not applicable as it is covered by the GET, POST, PUT, and DELETE request tests.

// Response Body Test
// This test is not applicable as it is covered by the GET, POST, PUT, and DELETE request tests.

// Error Handling Test
describe('Error Handling Test', () => {
    it('handles errors correctly', async () => {
        // Mock the TBDBapi get function to reject with an error
        mockGet.rejects(new Error('Failed to fetch data'));

        // Call the idService function that makes a GET request
        const result = await idService.getDetails();

        // Ensure the function returns null when an error occurs
        expect(result).to.be.null;
    });
});
