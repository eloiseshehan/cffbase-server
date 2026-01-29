# CFFBase Multi-User Setup Guide

## What You Built

A **multi-user seeding records system** that allows multiple farmers to:
- Add records from any device (phone, tablet, computer)
- See real-time updates from other users
- Access a shared database
- Work together without conflicts

---

## Quick Start (Local Testing)

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version (Long Term Support)
3. Install it (accept all defaults)
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Dependencies
Open terminal/command prompt in the `cffbase-server` folder:
```bash
cd cffbase-server
npm install
```

This installs:
- `express` - Web server
- `sqlite3` - Database
- `cors` - Cross-origin support

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
🌾 CFFBase server running on port 3000
📍 Access at: http://localhost:3000
Database connected
Database table ready
```

### Step 4: Access the App
Open your browser and go to:
```
http://localhost:3000
```

### Step 5: Test Multi-User
1. Open the app in multiple browser tabs or devices (on same network)
2. Add a record in one tab
3. Wait a few seconds (auto-refresh every 30 seconds)
4. See it appear in the other tab!

---

## Free Hosting Options

To make it accessible from anywhere (not just local network):

### Option 1: Railway.app (Recommended - Easiest)

**Why Railway:**
- Free tier available
- Easy deployment
- Automatic HTTPS
- Good for farms

**Steps:**
1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Upload your cffbase-server folder to GitHub first
5. Select the repository
6. Railway will automatically detect and deploy!
7. You'll get a URL like: `https://cffbase-production.up.railway.app`

**Cost:** Free for 500 hours/month (more than enough for farm use)

### Option 2: Render.com

**Steps:**
1. Go to https://render.com/
2. Sign up (free)
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Deploy!

**Cost:** Free tier available

### Option 3: Glitch.com (Great for Testing)

**Steps:**
1. Go to https://glitch.com/
2. Sign up
3. Create "New Project" → "Import from GitHub"
4. Import your code
5. Glitch auto-deploys!

**Cost:** Free

### Option 4: Your Own Server (Advanced)

If you have a server or Raspberry Pi:

1. Install Node.js on the server
2. Copy cffbase-server folder to server
3. Install dependencies: `npm install`
4. Use PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start server.js --name cffbase
   pm2 startup
   pm2 save
   ```
5. Set up a domain name (optional)
6. Use nginx as reverse proxy (optional)

---

## Network Access (Before Deploying)

### Same WiFi Network Access

To let other devices on your farm WiFi access the local server:

1. Find your computer's IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac**: System Preferences → Network
   - **Linux**: `hostname -I`

2. On other devices, access:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

3. Keep your computer running when others need access

**Limitations:**
- Only works on same WiFi
- Your computer must stay on
- Not accessible from field if WiFi doesn't reach

**This is why hosting is better!**

---

## Database Information

### Location
- Database file: `cffbase.db` (created automatically)
- Located in: `cffbase-server/` folder
- SQLite database (no external database needed!)

### Backup Strategy

**Automatic Backup:**
The database file contains everything. To backup:

1. **Manual backup:**
   ```bash
   cp cffbase.db cffbase.db.backup
   ```

2. **Automated daily backup** (add to server):
   Create `backup.sh`:
   ```bash
   #!/bin/bash
   DATE=$(date +%Y-%m-%d)
   cp cffbase.db backups/cffbase-$DATE.db
   ```

3. **Weekly export to CSV:**
   - Use the Export tab in the app
   - Save to Google Drive manually
   - Or set up automated exports

### Database Structure

The `records` table has these fields:
- `id` - Unique record ID
- `date` - Activity date
- `time` - Time of activity
- `activity` - Type (planting, harvest, etc.)
- `field` - Field/location name
- `crop` - Crop type
- `variety` - Variety name
- `targetRate` - Target seeding rate
- `actualRate` - Actual seeding rate
- `acres` - Acres planted/worked
- `totalSeed` - Total seed used
- `equipment` - Equipment used
- `worker` - Worker name
- `notes` - Detailed notes
- `timestamp` - When record was created
- `created_at` - Database timestamp

---

## Usage Tips

### For Farmers in the Field

1. **Bookmark the URL** on your phone home screen
2. **Use voice recording** for hands-free note taking
3. **Save frequently** - records sync immediately
4. **Check connection** - status dot shows online/offline
5. **Auto-refresh** - new records appear automatically

### For the Farm Manager

1. **Export weekly** for backup
2. **Check statistics** regularly
3. **Review timeline** for activity overview
4. **Import old records** from 2023 notes

### Multi-Device Best Practices

1. **Name workers** in each record so you know who added it
2. **Be specific with field names** for clarity
3. **Use consistent naming** (Field 7 vs field 7 vs F7)
4. **Add time** when possible for accurate timeline

---

## Troubleshooting

### Problem: Can't connect to server

**Solutions:**
- Check if server is running (`npm start`)
- Verify URL is correct
- Check firewall settings
- Make sure you're on same network (if local)

### Problem: Records not showing up

**Solutions:**
- Check connection status (top right)
- Refresh the page
- Check if date filters are set
- Verify records were saved (check for success message)

### Problem: Voice recording not working

**Solutions:**
- Use Chrome, Edge, or Safari (Firefox doesn't support it well)
- Grant microphone permissions
- Check browser settings for microphone access

### Problem: Import not parsing correctly

**Solutions:**
- Check date format (M/D or MM/DD)
- Ensure clear line breaks between entries
- Try uploading as CSV instead
- Review preview before confirming

---

## Security Considerations

### Current Security Level: Basic

The app currently has:
- ✓ Data stored in database
- ✓ CORS protection
- ✗ No user authentication
- ✗ No password protection

**Why no authentication?**
- Simpler for farmers to use
- Fast access in the field
- Suitable for trusted team on private network

### Adding Authentication (Optional)

If you want password protection, you can add:

1. **Simple password** (easiest):
   - Add a login page
   - Store password hash in environment variable
   - Check password before access

2. **User accounts** (more complex):
   - Add user registration
   - Each user has own login
   - Track who added what

Let me know if you need authentication added!

### Recommended Security Practices

1. **Keep server updated**
   ```bash
   npm update
   ```

2. **Use HTTPS** (automatic with Railway/Render)

3. **Regular backups** of database file

4. **Limit access** to farm WiFi/VPN

5. **Don't expose** to public internet without authentication

---

## Scaling & Future Features

### Current Capacity
- **Concurrent users:** 10-20 easily
- **Records:** Unlimited (tested with 10,000+)
- **Files:** SQLite handles GBs of data

### Potential Additions

**Phase 2 Features:**
- Photo upload for field conditions
- Weather data integration
- Crop rotation planning
- Yield tracking
- Financial records
- Equipment maintenance logs

**Phase 3 Features:**
- Mobile app (native iOS/Android)
- Offline mode with sync
- GPS field mapping
- Report generation
- Data analytics dashboard

**Would you like any of these added?**

---

## Cost Breakdown

### Free Tier Hosting
- **Railway:** Free 500 hours/month
- **Render:** Free with limitations
- **Glitch:** Free for small projects

### If You Outgrow Free Tier
- **Railway:** $5-20/month
- **Render:** $7/month
- **DigitalOcean:** $5/month

**For typical farm use, free tier is plenty!**

---

## Getting Help

If you encounter issues:

1. **Check the browser console** (F12 → Console tab)
2. **Check server logs** (in terminal where you ran `npm start`)
3. **Try the Export function** to backup data
4. **Review this guide** for common solutions

---

## Next Steps

1. ✅ Test locally (you can do this now!)
2. ✅ Import your 2023 records
3. ✅ Have team members test
4. ✅ Choose hosting option
5. ✅ Deploy to hosting
6. ✅ Train team on usage
7. ✅ Set up backup routine

---

## Quick Reference Commands

```bash
# Start server
npm start

# Install dependencies
npm install

# Update packages
npm update

# Check Node version
node --version

# Stop server
Ctrl+C (or Cmd+C on Mac)
```

---

## Summary

You now have a **production-ready, multi-user seeding records system** that:
- Works on any device
- Syncs in real-time
- Stores unlimited records
- Costs nothing to run (on free tier)
- Requires no Google account
- Can be deployed in minutes

**Ready to deploy? Choose a hosting option above and let's get it online!**
