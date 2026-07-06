# How to Start the Backend Server

## Quick Start

### Option 1: Using npm (Recommended)
```bash
cd c:\Global-Edu-Assist\g-e-a\Backend
npm start
```

### Option 2: Using node directly
```bash
cd c:\Global-Edu-Assist\g-e-a\Backend
node index.js
```

## What to Look For

When the server starts successfully, you should see:
```
✅ MongoDB connection is open and ready
✅ Super admin created successfully! (or "Super admin already exists")
📧 Email: prajin.singh9@gmail.com
🔑 Password: GEA@123456
🚀 Server is running on port 3001
```

## Troubleshooting

### Error: "MongoDB connection error"
**Problem:** Cannot connect to MongoDB
**Solution:** 
1. Check if MongoDB Atlas is accessible
2. Verify MONGODB_URI in `.env` file
3. Check internet connection

### Error: "Cloudinary configuration error"
**Problem:** Cloudinary credentials not found
**Solution:**
1. Verify `.env` has these variables:
   ```
   CLOUDINARY_CLOUD_NAME=dgf3na7wg
   CLOUDINARY_API_KEY=484658946218387
   CLOUDINARY_API_SECRET=_epB81YRxmotlp6PvC-fXMQhZCo
   ```

### Error: "Port 3001 is already in use"
**Problem:** Another process is using port 3001
**Solution:**
1. Find and kill the process:
   ```bash
   netstat -ano | findstr :3001
   taskkill /PID <process_id> /F
   ```
2. Or change the port in `index.js`

### Error: "Cannot find module..."
**Problem:** Missing dependencies
**Solution:**
```bash
npm install
```

## Testing the Server

Once started, test these endpoints:

### 1. Health Check (if you have one)
```bash
curl http://localhost:3001/
```

### 2. Login Test
```bash
curl -X POST http://localhost:3001/api/admin-login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"prajin.singh9@gmail.com\",\"password\":\"GEA@123456\"}"
```

### 3. File Upload Test
```bash
# Upload a test image
curl -X POST http://localhost:3001/api/upload \
  -F "image=@path/to/your/image.jpg"
```

## Frontend Connection

Make sure your frontend is pointing to:
```
http://localhost:3001
```

Check these files in your frontend:
- `.env` or `.env.local`
- API configuration files
- `authService.jsx` or similar

## Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

## Development Mode

The server uses `nodemon` which auto-restarts on file changes:
```bash
npm start
```

This runs: `nodemon index.js`

## Production Mode

For production, use:
```bash
node index.js
```

## Common Issues After Cloudinary Migration

### Images not uploading
1. Check Cloudinary credentials in `.env`
2. Check server console for upload errors
3. Verify file size < 5MB
4. Verify file format is JPG, JPEG, or PNG

### Old images not displaying
- Old database records may have local URLs: `/uploads/file.jpg`
- New uploads will have Cloudinary URLs: `https://res.cloudinary.com/...`
- Frontend should handle both formats (see FRONTEND_INTEGRATION_NOTES.md)

## Logs

Server logs will show:
- MongoDB connection status
- Super admin creation
- File upload activities
- Cloudinary operations
- API requests
- Errors and warnings

Watch the console output for debugging information.
