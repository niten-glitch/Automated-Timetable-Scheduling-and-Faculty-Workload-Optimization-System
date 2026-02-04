# 🧪 Conflict Detection Testing Guide

## Method 1: Automated Test Script (Recommended)

### Step 1: Run the Test Script
```bash
cd timetable-backend-mern
node test-conflicts.js
```

This will:
- ✅ Create two timetable entries with intentional conflicts
- ✅ Use the same faculty, room, and timeslot for both
- ✅ Show you what conflicts to expect

### Step 2: Verify in Frontend
1. Open the frontend (index.html)
2. Click **"🔍 Detect Conflicts"** button
3. Click **"⚠️ View Conflicts"** button
4. You should see a table showing:
   - **FACULTY** conflict (red badge)
   - **ROOM** conflict (orange badge)
   - Possibly **SECTION** conflict (pink badge)

### Step 3: Clean Up (Optional)
```bash
# Clear all timetable entries
# In frontend, click "🗑️ Clear Timetable"
```

---

## Method 2: Manual Testing via Frontend

### Step 1: Generate Initial Timetable
1. Open frontend
2. Click **"🚀 Generate Timetable"**
3. Note how many classes were scheduled

### Step 2: Check for Natural Conflicts
1. Click **"🔍 Detect Conflicts"**
2. Check the response - it should show `conflictsFound: 0` if the algorithm worked correctly

### Step 3: Manually Create Conflicts (Advanced)
Use a tool like Postman or curl to create duplicate entries:

```bash
# Get existing timetable entry
curl http://localhost:5000/api/timetable

# Create duplicate with same faculty/room/time
curl -X POST http://localhost:5000/api/timetable \
  -H "Content-Type: application/json" \
  -d '{
    "sectionId": "SECTION_ID",
    "courseId": "COURSE_ID", 
    "facultyId": "FACULTY_ID",
    "roomId": "ROOM_ID",
    "timeslotId": "TIMESLOT_ID"
  }'
```

---

## Method 3: Database Direct Check

### View Conflicts in MongoDB
```bash
# Connect to MongoDB and check conflicts collection
mongosh "YOUR_MONGODB_URI"

# In MongoDB shell:
use timetable_db
db.conflicts.find().pretty()
```

---

## Expected Results

### ✅ Working Correctly If:
- Detect Conflicts returns a count
- View Conflicts shows a formatted table
- Conflicts have proper types: `FACULTY`, `ROOM`, or `SECTION`
- Each conflict has a clear reason explaining the issue

### ❌ Not Working If:
- Errors appear in console
- No conflicts detected when duplicates exist
- Conflicts table is empty despite overlapping schedules

---

## Quick Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend loaded successfully
- [ ] Can click "Detect Conflicts" without errors
- [ ] Can click "View Conflicts" and see results
- [ ] Conflicts display with color-coded badges
- [ ] Each conflict shows a descriptive reason

---

## Troubleshooting

**Issue:** "No conflicts found" but duplicates exist
- **Fix:** Make sure to click "Detect Conflicts" first to scan the database

**Issue:** Error when detecting conflicts
- **Fix:** Check backend console for detailed error messages
- **Fix:** Ensure all timetable entries have valid populated fields

**Issue:** Conflicts not displaying
- **Fix:** Check browser console (F12) for JavaScript errors
- **Fix:** Verify backend API is responding: `http://localhost:5000/api/conflicts`

---

## API Endpoints Reference

```
GET  /api/conflicts          - View all detected conflicts
POST /api/conflicts/detect   - Trigger conflict detection
GET  /api/timetable          - View all timetable entries
POST /api/timetable/generate - Generate new timetable
DELETE /api/timetable        - Clear all timetable entries
```
