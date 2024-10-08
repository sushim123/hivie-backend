import STATUS_CODES from './constants.js';
import {addCategoryName, addProduct} from './controllers/eCommerce.controller.js';
import {Category, Product} from './models/eCommerce.model.js';

jest.mock('./models/eCommerce.model.js');
const sushim ={
  category_id: '1',
      name: 'Test sushim',
      price: '100',
      stock_quantity: '1',
      image_url: 'dsff',
      is_flash_sale: 'yes',
      description: 'Test Description'
}
// adding product to eccomerce
describe('addProduct', () => {
  let req, res;
  beforeEach(() => {
    req = {body: sushim};
    res = {status: jest.fn().mockReturnThis(), json: jest.fn()};
  });

  it('should create a product successfully', async () => {

    const mockProdusctInstance = {
      ...sushim,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      save: jest.fn().mockResolvedValue(this)
      // Ensure it resolves correctly
    };
    Product.mockImplementation(() => mockProdusctInstance);
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.CREATED);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockProdusctInstance,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    );
  });
});

// adding category to eccomerce
jest.mock('./models/eCommerce.model.js');
describe('addCategoryName', () => {
  let req, res;
  beforeEach(() => {
    req = {body: {}};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  it('should create a category successfully', async () => {
    req.body = {
      name: 'Test Category',
      description: 'Test Description'
    };
    const mockCategoryInstance = {
      _id: sushim.category_id,
      ...sushim.name,
      ...sushim.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      save: jest.fn().mockResolvedValue(this) // Ensure it resolves correctly
    };
    Category.mockImplementation(() => mockCategoryInstance);
    await addCategoryName(req, res);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.CREATED);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ...mockCategoryInstance,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
    );
  });
});
