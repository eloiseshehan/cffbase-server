# CFFBase - Multi-User Farm Seeding Records System

A real-time, multi-user web application for tracking seeding activities, field work, and agricultural operations at Caney Fork Farms.

## Features

✅ **Multi-User Access** - Multiple farmers can add records simultaneously  
✅ **Real-Time Sync** - See updates from other users automatically  
✅ **Voice Recording** - Hands-free note taking in the field  
✅ **Smart Import** - Automatically parse text notes or upload CSV files  
✅ **Mobile-Friendly** - Works great on phones, tablets, and computers  
✅ **Offline Detection** - Shows connection status  
✅ **Auto-Complete** - Suggests field names, crops, and workers  
✅ **Detailed Tracking** - Seeding rates, acres, equipment, workers, notes  
✅ **Timeline View** - Chronological activity history  
✅ **Export Data** - Download as CSV or JSON  
✅ **Statistics Dashboard** - Total records, acres planted, active fields  

## Quick Start

1. **Install Node.js** from https://nodejs.org/

2. **Install dependencies:**
   ```bash
   cd cffbase-server
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Deployment

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed deployment instructions including:
- Railway.app (recommended)
- Render.com
- Glitch.com
- Self-hosting

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js, Express
- **Database:** SQLite3
- **Hosting:** Free tier options available

## Project Structure

```
cffbase-server/
├── server.js           # Backend API server
├── package.json        # Dependencies
├── cffbase.db          # Database (created automatically)
├── public/
│   ├── index.html      # Frontend UI
│   └── app.js          # Frontend logic
└── SETUP-GUIDE.md      # Detailed setup instructions
```

## API Endpoints

- `GET /api/records` - Get all records
- `POST /api/records` - Create new record
- `POST /api/records/bulk` - Bulk import records
- `GET /api/stats` - Get statistics
- `GET /api/health` - Health check

## Database Schema

```sql
CREATE TABLE records (
    id INTEGER PRIMARY KEY,
    date TEXT NOT NULL,
    time TEXT,
    activity TEXT NOT NULL,
    field TEXT,
    crop TEXT,
    variety TEXT,
    targetRate REAL,
    actualRate REAL,
    acres REAL,
    totalSeed REAL,
    equipment TEXT,
    worker TEXT,
    notes TEXT,
    timestamp TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Examples

### Adding a Record
1. Select activity type (planting, harvest, etc.)
2. Enter field name
3. Add crop details
4. Record rates and acreage
5. Add detailed notes (or use voice recording)
6. Save!

### Importing Old Records
1. Go to Import Data tab
2. Paste raw field notes
3. System automatically extracts:
   - Dates and times
   - Field names
   - Crop types
   - Seeding rates
   - Acreage
4. Review and confirm import

### Multi-User Access
- Each farmer can access from their own device
- Records sync automatically
- No conflicts or overwrites
- Connection status shows online/offline

## License

MIT License - Free to use and modify

## Support

For issues or questions about setup, see [SETUP-GUIDE.md](SETUP-GUIDE.md) or open an issue.

## Acknowledgments

Built for Caney Fork Farms in Carthage, Tennessee to help organize and track agricultural research data.
