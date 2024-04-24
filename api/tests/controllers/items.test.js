const request = require("supertest");

const app = require("../../app");
const Item = require("../../models/item");

require("../mongodb_helper");

describe("/items", () => {
    beforeEach(async () => {
        await Item.deleteMany({});
    });

    it('should create a new item successfully', async () => {
        const itemDetails = {
            name: 'Red Halterneck Top',
            category: 'Top',
            tags: ['red', 'summer', 'halterneck'],
            image: 'some-base64-encoded-string',
        };
    
        const response = await request(app)
            .post('/items') // Your POST endpoint for creating items
            .send(itemDetails)
            .expect(201); 
    
        expect(response.body.message).toContain('Item created, id:');
    });

    let testItem = new Item({
        name: 'Red Halterneck Top',
        category: 'Top',
        tags: ['red', 'summer', 'halterneck'],
        image: 'some-base64-encoded-string',
    });


    it('should return an item with valid item ID', async () => {
        await testItem.save();

        const response = await request(app)
            .get(`/items/${testItem._id}`)
            .expect(200);

            expect(response.body.name).toBe('Red Halterneck Top');
            expect(response.body.category).toBe('Top');
        });
    
        
    it("should return an error for invalid item ID", async () => {
        const invalidId = '12345abcdef12345abcdef'; 
        const response = await request(app)
            .get(`/items/${invalidId}`)
            .expect(400); 
    
            expect(response.body.message).toContain("Couldn't retrieve item");
    });

    it("should delete an item with valid item ID", async () => {
        const response = await request(app)
            .delete(`/items/${testItem._id}`)
            .expect(200);

            expect(response.body.message).toContain("Item deleted");
    });
        
    it("should raise an error with invalid item ID", async () => {
        const invalidId = '12345abcdef12345abcdef';
        const response = await request(app)
            .delete(`/items/${invalidId}`)
            .expect(500);

            expect(response.body.message).toContain("Couldn't remove item");
    });

    it("should find item by tags", async () => {
        const tags = ['red', 'summer'];

        const response = await request(app)
            .post(`/items/search`)
            .send({tags})
            .expect(200);
    });
    
});

    
    




    