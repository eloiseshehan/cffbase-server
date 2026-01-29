// CFFBase Backend Server
// This handles all database operations and serves the web app

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite Database
const db = new sqlite3.Database('./cffbase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected');
        initDatabase();
    }
});

// Create tables if they don't exist
function initDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Database table ready');
        }
    });
}

// API Routes

// Get all records
app.get('/api/records', (req, res) => {
    db.all('SELECT * FROM records ORDER BY date DESC, time DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ records: rows });
    });
});

// Get records with filters
app.get('/api/records/filter', (req, res) => {
    const { activity, field, startDate, endDate, search } = req.query;
    
    let query = 'SELECT * FROM records WHERE 1=1';
    let params = [];
    
    if (activity) {
        query += ' AND activity = ?';
        params.push(activity);
    }
    
    if (field) {
        query += ' AND field LIKE ?';
        params.push(`%${field}%`);
    }
    
    if (startDate) {
        query += ' AND date >= ?';
        params.push(startDate);
    }
    
    if (endDate) {
        query += ' AND date <= ?';
        params.push(endDate);
    }
    
    if (search) {
        query += ' AND (field LIKE ? OR crop LIKE ? OR notes LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY date DESC, time DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ records: rows });
    });
});

// Get single record
app.get('/api/records/:id', (req, res) => {
    db.get('SELECT * FROM records WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        res.json({ record: row });
    });
});

// Create new record
app.post('/api/records', (req, res) => {
    const {
        date, time, activity, field, crop, variety,
        targetRate, actualRate, acres, totalSeed,
        equipment, worker, notes, timestamp
    } = req.body;
    
    const query = `
        INSERT INTO records (
            date, time, activity, field, crop, variety,
            targetRate, actualRate, acres, totalSeed,
            equipment, worker, notes, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
        date, time, activity, field, crop, variety,
        targetRate, actualRate, acres, totalSeed,
        equipment, worker, notes, timestamp
    ];
    
    db.run(query, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Record created successfully',
            id: this.lastID
        });
    });
});

// Update record
app.put('/api/records/:id', (req, res) => {
    const {
        date, time, activity, field, crop, variety,
        targetRate, actualRate, acres, totalSeed,
        equipment, worker, notes
    } = req.body;
    
    const query = `
        UPDATE records SET
            date = ?, time = ?, activity = ?, field = ?, crop = ?,
            variety = ?, targetRate = ?, actualRate = ?, acres = ?,
            totalSeed = ?, equipment = ?, worker = ?, notes = ?
        WHERE id = ?
    `;
    
    const params = [
        date, time, activity, field, crop, variety,
        targetRate, actualRate, acres, totalSeed,
        equipment, worker, notes, req.params.id
    ];
    
    db.run(query, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        res.json({ message: 'Record updated successfully' });
    });
});

// Delete record
app.delete('/api/records/:id', (req, res) => {
    db.run('DELETE FROM records WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        res.json({ message: 'Record deleted successfully' });
    });
});

// Bulk import records
app.post('/api/records/bulk', (req, res) => {
    const { records } = req.body;
    
    if (!Array.isArray(records) || records.length === 0) {
        res.status(400).json({ error: 'Invalid records array' });
        return;
    }
    
    const query = `
        INSERT INTO records (
            date, time, activity, field, crop, variety,
            targetRate, actualRate, acres, totalSeed,
            equipment, worker, notes, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const stmt = db.prepare(query);
    let successCount = 0;
    let errorCount = 0;
    
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        records.forEach(record => {
            const params = [
                record.date, record.time, record.activity, record.field,
                record.crop, record.variety, record.targetRate, record.actualRate,
                record.acres, record.totalSeed, record.equipment, record.worker,
                record.notes, record.timestamp
            ];
            
            stmt.run(params, (err) => {
                if (err) {
                    errorCount++;
                } else {
                    successCount++;
                }
            });
        });
        
        db.run('COMMIT', (err) => {
            stmt.finalize();
            if (err) {
                res.status(500).json({ error: 'Transaction failed' });
            } else {
                res.json({
                    message: 'Bulk import completed',
                    success: successCount,
                    errors: errorCount
                });
            }
        });
    });
});

// Get statistics
app.get('/api/stats', (req, res) => {
    const queries = {
        totalRecords: 'SELECT COUNT(*) as count FROM records',
        totalAcres: 'SELECT SUM(acres) as total FROM records WHERE acres IS NOT NULL',
        uniqueFields: 'SELECT COUNT(DISTINCT field) as count FROM records WHERE field IS NOT NULL',
        recentActivity: `
            SELECT activity, COUNT(*) as count 
            FROM records 
            WHERE date >= date('now', '-30 days')
            GROUP BY activity
        `,
        topCrops: `
            SELECT crop, COUNT(*) as count, SUM(acres) as total_acres
            FROM records 
            WHERE crop IS NOT NULL
            GROUP BY crop
            ORDER BY count DESC
            LIMIT 10
        `
    };
    
    const stats = {};
    
    db.get(queries.totalRecords, [], (err, row) => {
        stats.totalRecords = row ? row.count : 0;
        
        db.get(queries.totalAcres, [], (err, row) => {
            stats.totalAcres = row ? (row.total || 0) : 0;
            
            db.get(queries.uniqueFields, [], (err, row) => {
                stats.activeFields = row ? row.count : 0;
                
                db.all(queries.recentActivity, [], (err, rows) => {
                    stats.recentActivity = rows || [];
                    
                    db.all(queries.topCrops, [], (err, rows) => {
                        stats.topCrops = rows || [];
                        res.json(stats);
                    });
                });
            });
        });
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: db ? 'connected' : 'disconnected'
    });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🌾 CFFBase server running on port ${PORT}`);
    console.log(`📍 Access at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
