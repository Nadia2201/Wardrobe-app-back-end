const request = require('supertest');
const express = require('express');
const app = require("../../app");
const OutfitsController = require('../../controllers/outfits');
const Item = require('../../models/item'); // Import the Item model
const Outfit = require('../../models/outfit')
//require("../mongodb_helper");
// Mock Item model and its methods
jest.mock('../../models/outfit', () => ({
    save: jest.fn().mockResolvedValue({}),
  }));
describe("/outfits", () => {
it('should create a random outfit successfully', async () => {
    const req = {
        body: {
            // Sample data for creating an outfit
            top: 'MockTop',
            bottom: 'MockBottom',
            shoes: 'MockShoes'
        }
    };
      // Simulate POST request to /outfits route
    const response = await request(app)
        .post('/outfits')
        .send(req)

        .expect(response.status(201));
        expect(response.body.message).toContain('Outfit created, id:');
  }, 100000); // Increase the timeout to 10000 milliseconds (10 seconds)
});