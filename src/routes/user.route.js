import {Router} from 'express';
import {deleteUser, fetchAllUser, fetchById, updateUser} from '../controllers/user.controller.js';
import {isAdmin, isAuthenticated, isBrand, isInfluencer} from '../middlewares/auth.middleware.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
const router = Router();
// User Routes
// router.post('/user', asyncHandler(createUser));
router.get('/', isAuthenticated, isAdmin, asyncHandler(fetchAllUser));
router.get('/:id', isAuthenticated, isInfluencer, asyncHandler(fetchById));
router.put('/:id', isAuthenticated, isInfluencer, asyncHandler(updateUser));
router.delete('/:id', isAuthenticated, isAdmin, asyncHandler(deleteUser));

export default router;