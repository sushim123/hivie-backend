import { addCategoryName } from './controllers/eCommerce.controller.js'; // Adjust this to your controller file
import Category from './models/eCommerce.model.js'; // Ensure this path is correct
import STATUS_CODES from './constants.js'; // Import your status codes

// Mock the model
jest.mock('./models/eCommerce.model.js');
describe('addCategoryName', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  it('should create a category successfully', async () => {
    req.body = { name: 'Test Category', description: 'Test Description' };
    const mockCategoryInstance = {
      _id: '1',
      name: 'Test Category',
      description: 'Test Description',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      save: jest.fn().mockResolvedValue(this), // Ensure it resolves correctly
    };
    Category.mockImplementation(() => mockCategoryInstance);
    await addCategoryName(req, res);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.CREATED);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: '1',
      name: 'Test Category',
      description: 'Test Description',
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
  });
});
