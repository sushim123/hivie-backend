// userMiddleware.js

export const preSaveMiddleware = function (next) {
    if (this.role === 'brand') {
      // Remove platformLinks and pricing for brands
      this.platformLinks = undefined;
      this.pricing = undefined;
      this.instaData = undefined;
    }
    if (this.role === 'influencer') {
      // Ensure expiresAt is set only for influencers
      this.isTemporary = true;
      this.expiresAt = new Date(Date.now() + 1 * 60 * 1000);
      this.industry = undefined;
      this.numberOfProducts = undefined;
      this.sizeOfCompany = undefined;
      this.brandInfo = undefined;

    } else {
      // For brands
      this.isTemporary = false;
      this.expiresAt = null;
    }
    next();
  };

  export const preFindOneAndUpdateMiddleware = function (next) {
    const update = this.getUpdate();
    if (update.role === 'brand') {
      update.platformLinks = undefined;
      update.pricing = undefined;
      update.instaData = undefined;
      update.isTemporary = false;
      update.expiresAt = null;
    } else if (update.role === 'influencer') {
      update.isTemporary = true;
      update.expiresAt = new Date(Date.now() + 1 * 60 * 1000);
      update.industry = undefined;
      update.numberOfProducts = undefined;
      update.sizeOfCompany = undefined;
      update.brandInfo = undefined;
    }
    next();
  };
