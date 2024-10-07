import { addCategoryName, addProduct } from './controllers/eCommerce.controller.js';
import {Category , Product} from './models/eCommerce.model.js';
import STATUS_CODES from './constants.js';


// adding product to eccomerce
jest.mock('./models/eCommerce.model.js');
describe('addProduct',() => {
  let req ,res;
  beforeEach(()=> {
    req = {body : {}};
    res = { status : jest.fn().mockReturnThis() ,
      json:jest.fn()
    };
  });
  it ('should create a product successfully' , async() =>{
    req.body = { category_id: 'id',  name : 'Test sushim' ,price:'100' ,stock_quantity:'1',image_url:'dsff',is_flash_sale:'yes',description: 'Test Description' };
    const mockProdusctInstance ={
        category_id: '1',
        name : 'Test sushim' ,
        price:'100' ,
        stock_quantity:'1',
        image_url:'dsff',
        is_flash_sale:'yes',
        description: 'Test Description',
        created_at: new Date().toISOString(), // Set to the current time
updated_at: new Date().toISOString(), // Set to the current time
 // Use expect.any to allow for dynamic dates
       // Ensure it resolves correctly
    };
    mockProdusctInstance.save = jest.fn().mockResolvedValue(mockProdusctInstance);
    Product.mockImplementation(() => mockProdusctInstance);
    await addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(STATUS_CODES.CREATED);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        category_id: '1',
        name : 'Test sushim' ,
        price:'100' ,
        stock_quantity:'1',
        image_url:'dsff',
        is_flash_sale:'yes',
        description: 'Test Description',
        created_at: expect.any(String), // Use expect.any to allow for dynamic dates
updated_at: expect.any(String), // Use expect.any to allow for dynamic dates
 // Match ISO date format
 // Set to the current time
 // Use expect.any to allow for dynamic dates
    }));
  });
});


// adding category to eccomerce
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
