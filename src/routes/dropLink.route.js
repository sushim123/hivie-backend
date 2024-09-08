import {Router} from 'express';
import {DUPLICATE_ERROR_CODE, STATUS_CODES} from '../constants.js';
import DropLink from '../models/dropLink.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
import InstagramData from '../models/instagramData.model.js';

const route = Router();

const fetchMediaDataFromPermalink = async (permalink) => {
  try {
    const instagramData = await InstagramData.findOne({ 'data.media.permalink': permalink });
    if (instagramData) {
      const media = instagramData.data.media.find(mediaItem => mediaItem.permalink === permalink);
      return media || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching media data for permalink ${permalink}:`, error);
    return null;
  }
};

route.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const { drop_id, brand_id, deliverables, user_id } = req.body;

    try {
      const deliverablesWithMediaData = await Promise.all(
        deliverables.map(async (deliverable) => {
          const mediaData = await fetchMediaDataFromPermalink(deliverable.link);
          // console.log('Fetched media data:', mediaData); // Log the media data
          return {
            ...deliverable,
            media: mediaData ? [mediaData] : [],
          };
        })
      );
      // console.log('Deliverables with media data:', deliverablesWithMediaData);

      const newDropLink = new DropLink({
        drop_id,
        brand_id,
        deliverables: deliverablesWithMediaData,
        user_id,
      });

      await newDropLink.save();
      res.status(STATUS_CODES.CREATED).json(
        new apiResponse(
          STATUS_CODES.CREATED,
          newDropLink,
          'Drop link saved successfully',
          true
        )
      );
    } catch (error) {
      if (error.code === DUPLICATE_ERROR_CODE) {
        return next(
          new apiError(STATUS_CODES.CONFLICT, 'Duplicate drop link entry')
        );
      }
      next(
        new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to save drop link', error)
      );
    }
  })
);

// GET /api/v1/drop-link/
route.get(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const newDropLink = await DropLink.find();
      if (!newDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, newDropLink, 'Drop link fetched successfully'));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop link', error));
    }
  })
);
// GET /api/v1/drop-link/:id
route.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const newDropLink = await DropLink.findById(req.params.id);
      if (!newDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, newDropLink, 'Drop link fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop link', error));
    }
  })
);

// PUT /api/v1/drop-link/:id
route.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;

      // Search for the drop link by _id
      const updatedDropLink = await DropLink.findOneAndUpdate({_id: id}, req.body, {
        new: true,
        runValidators: true
      });
      if (!updatedDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, updatedDropLink, 'Drop link updated successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to update drop link', error));
    }
  })
);

// DELETE /api/v1/drop-link/:id
route.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const deletedDropLink = await DropLink.findByIdAndDelete(req.params.id);
      if (!deletedDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, deletedDropLink, 'Drop link deleted successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to delete drop link', error));
    }
  })
);







route.post('/sss', async (req, res) => {
  const { permalink } = req.body; // Assuming permalink is sent in the body of the request

  if (!permalink) {
    return res.status(STATUS_CODES.BAD_REQUEST).json(new apiError(STATUS_CODES.BAD_REQUEST, 'Permalink is required.', 'No permalink provided.'));
  }
  try {
    const instagramData = await InstagramData.findOne({ 'data.media.permalink': permalink });
    if (instagramData) {
      const media = instagramData.data.media.find(mediaItem => mediaItem.permalink  === permalink);

      if (media) {
        return res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, media, 'Media found.', true));
      } else {
        return res.status(STATUS_CODES.NOT_FOUND).json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'Media not found for the provided permalink.', false));
      }
    } else {
      return res.status(STATUS_CODES.NOT_FOUND).json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'Permalink not found in the database.', false));
    }
  } catch (error) {
    const errorMessage = error.message || 'An error occurred while checking the permalink.';
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Error checking permalink.', errorMessage));
  }
});

export default route;
