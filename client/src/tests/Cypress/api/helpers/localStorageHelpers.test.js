// Cypress test file: .\src\tests\Cypress\api\helpers\localStorageHelpers.test.js

// Importing the localStorageService from the localStorageHelpers module
import { localStorageService } from "../../../../api/helpers/localStorageHelpers";

// GET Request Test
describe('GET Request Test', () => {
    it('successfully retrieves data from localStorage', () => {
        // Set a sample key-value pair in localStorage
        const key = 'testKey';
        const value = 'testValue';
        localStorage.setItem(key, value);

        // Retrieve data from localStorage using the get method
        // Ensure the retrieved value matches the expected value
        const retrievedValue = localStorageService.get(key);
        expect(retrievedValue).to.eq(value);
    });
});

// POST Request Test (Not applicable as localStorage does not support POST requests)

// PUT Request Test (Not applicable as localStorage does not support PUT requests)

// DELETE Request Test
describe('DELETE Request Test', () => {
    it('successfully removes data from localStorage', () => {
        // Set a sample key-value pair in localStorage
        const key = 'testKey';
        const value = 'testValue';
        localStorage.setItem(key, value);

        // Remove data from localStorage using the remove method
        // Ensure the key-value pair is successfully removed
        localStorageService.remove(key);
        const retrievedValue = localStorage.getItem(key);
        expect(retrievedValue).to.be.null;
    });
});

// Response Status Test (Not applicable for localStorage)

// Response Body Test (Not applicable for localStorage)

// Error Handling Test (Not applicable for localStorage)
