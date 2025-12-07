# Local SEO Setup Guide for Paintyard

This document provides instructions for completing the local SEO setup and deploying the Paintyard website with Google Business Profile integration.

## ✅ What's Already Done

The following has been implemented in this PR:

1. **LocalBusiness Structured Data (JSON-LD)**
   - Business name: Paintyard / Малярний двір
   - Complete address with GPS coordinates (48.92074, 24.70602)
   - Phone numbers: +38 (063) 770-24-57, +38 (068) 770-24-57
   - Opening hours: Mon-Fri 09:00-18:00, Sat 09:00-17:00, Sun closed
   - Business category: Store
   - Price range: $$

2. **SEO Meta Tags**
   - Description and keywords
   - Open Graph tags for social sharing
   - Geo-location tags
   - Twitter card support

3. **Contact Section**
   - Business hours display
   - Interactive Google Maps
   - Clickable phone links

4. **Technical Files**
   - sitemap.xml - For search engine indexing
   - robots.txt - For crawler control

## 📋 Post-Deployment Checklist

After deploying this PR to the main site, complete the following tasks:

### 1. Google Search Console Setup
- [ ] Add and verify your site at [Google Search Console](https://search.google.com/search-console)
- [ ] Submit sitemap.xml: `https://korchakv.github.io/paintyard/sitemap.xml`
- [ ] Monitor indexing status and fix any errors

### 2. Validate Structured Data
- [ ] Use [Google Rich Results Test](https://search.google.com/test/rich-results) to validate the LocalBusiness markup
- [ ] Check for any errors or warnings
- [ ] Ensure all fields are properly displayed

### 3. Google Business Profile Integration
- [ ] Verify your business at [Google Business Profile](https://business.google.com/)
- [ ] Ensure the following data matches between GBP and website:
  - Business name: Paintyard / Малярний двір
  - Address: вул. Вовчинецька, 191, Івано-Франківськ
  - Phone numbers: +38 (063) 770-24-57, +38 (068) 770-24-57
  - Opening hours: Mon-Fri 09:00-18:00, Sat 09:00-17:00, Sun closed
  - GPS coordinates: 48.92074, 24.70602

### 4. Social Media & Open Graph
**Note**: An SVG image (og-image.svg) is currently set, but for best compatibility, convert it to JPG or PNG.

- [ ] Convert og-image.svg to og-image.jpg or og-image.png (1200x630px) for better social media compatibility
- [ ] If you create a new image, update the meta tags in index.html:
  ```html
  <meta property="og:image" content="https://korchakv.github.io/paintyard/images/og-image.jpg">
  <meta name="twitter:image" content="https://korchakv.github.io/paintyard/images/og-image.jpg">
  ```
- [ ] Test social sharing on Facebook using [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Test on Twitter using [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 5. Google Analytics (Optional)
The site currently has a placeholder GTM ID: `GTM-XXXXXXXXXX`
- [ ] Replace with your actual Google Tag Manager ID in index.html (lines 5-9)
- [ ] Or remove the GTM code if not needed
- [ ] Verify tracking is working properly

### 6. Additional Optimizations
- [ ] Add photos to Google Business Profile
- [ ] Encourage customers to leave reviews on Google
- [ ] Monitor local search rankings
- [ ] Set up Google Analytics goals for phone clicks and map directions

## 🔍 Testing Your Setup

### Test Rich Results
1. Go to https://search.google.com/test/rich-results
2. Enter your site URL: `https://korchakv.github.io/paintyard/`
3. Click "Test URL"
4. Verify that "Store" schema is detected without errors

### Test Local Search Visibility
1. Search for "Paintyard Івано-Франківськ" on Google
2. Check if your business appears in the local pack (map + listings)
3. Verify contact information is correct

### Test Mobile Responsiveness
1. Go to https://search.google.com/test/mobile-friendly
2. Enter your site URL
3. Ensure all elements are mobile-friendly

## 📊 Expected Results

After 2-4 weeks of being indexed by Google, you should see:
- Business appearing in Google Maps search results
- Rich snippets in search results with business hours, address, and phone
- Improved local search ranking
- Click-to-call and directions buttons in search results

## ⚠️ Important Notes

1. **GPS Coordinates**: The coordinates (48.92074, 24.70602) are for вул. Вовчинецька, 191, Івано-Франківськ. Verify these are accurate.

2. **Business Category**: The schema uses "@type": "Store". If you need a more specific category (e.g., "HardwareStore"), update the JSON-LD in index.html.

3. **Place ID**: A Google Place ID is not currently in the structured data. You can find yours at https://developers.google.com/maps/documentation/places/web-service/place-id and add it if needed.

4. **Images**: An SVG Open Graph image (og-image.svg) has been added. For better compatibility with Facebook, Twitter, and other social platforms, consider converting it to JPG or PNG format (1200x630px). SVG images may not display properly on all social media platforms.

5. **Consistency**: Always keep NAP (Name, Address, Phone) consistent across:
   - Your website
   - Google Business Profile
   - Social media profiles
   - Any business directories

## 🔗 Useful Resources

- [Google Search Console](https://search.google.com/search-console)
- [Google Business Profile](https://business.google.com/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [Google My Business Help](https://support.google.com/business/)

## 🆘 Support

If you encounter any issues with the local SEO setup, check the following:

1. Validate your JSON-LD syntax at https://validator.schema.org/
2. Check Google Search Console for indexing errors
3. Ensure your Google Business Profile is verified and published
4. Wait 2-4 weeks for Google to fully index your changes

---

**Last Updated**: 2025-12-07
**Version**: 1.0
