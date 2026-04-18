# PODTrackerPRO - Static Website

## File Structure
- `index.html` - Homepage
- `features.html` - Features page
- `pricing.html` - Pricing page
- `blog.html` - Blog index
- `about.html` - About page
- `contact.html` - Contact page
- `privacy.html` - Privacy Policy
- `terms.html` - Terms of Service
- `.htaccess` - Apache config (HTTPS, caching, clean URLs)
- `css/style.css` - Shared styles
- `js/main.js` - Scroll reveal and nav behavior
- `includes/nav-footer.html` - Shared reference snippets

## Uploading to ShockHosting (cPanel)
1. Log in to your ShockHosting cPanel.
2. Open File Manager.
3. Navigate to `public_html/` or your domain's document root.
4. Upload the site files and extract them, or transfer them with FTP.
5. Make sure `.htaccess` is visible by enabling hidden files.
6. Visit your domain to confirm the site is live.

## Before Going Live
- Update the app URLs if your login or signup routes are different from `https://app.podtrackerpro.com`.
- Replace the placeholder support emails with your real inboxes if needed.
- Confirm the `mailto:` contact form behavior matches how you want leads handled.
- Set up SSL in cPanel.
- Submit a sitemap to Google Search Console.

## Notes
- Brand colors are set as CSS variables in `css/style.css`.
- Headings use Rubik and body copy uses DM Sans.
- The nav script supports both `pricing.html` and clean URLs like `/pricing`.
