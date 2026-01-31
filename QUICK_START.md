# 🚀 Quick Start Guide - Timetable System

## ⚡ 5-Minute Setup

### Step 1: Wait for MongoDB Installation ⏳
MongoDB is currently being installed via `winget`. This will take a few more minutes.

### Step 2: Start MongoDB Service
Once installation completes, MongoDB should start automatically. Verify with:
```powershell
Get-Service -Name MongoDB
```

If not running, start it:
```powershell
Start-Service -Name MongoDB
```

### Step 3: Seed the Database
```bash
cd timetable-backend-mern
npm run seed
```

**Expected output:**
```
✅ Database seeded successfully!
```

### Step 4: Start the Backend
```bash
npm start
```

**Expected output:**
```
Server is running on port 5000
MongoDB Connected: localhost
```

### Step 5: Open the Frontend
Double-click or open in browser:
```
timetable-frontend/index.html
```

### Step 6: Generate Timetable
1. Click **"🚀 Generate Timetable"**
2. Wait 2-3 seconds
3. See success message with number of classes scheduled

### Step 7: View Results
Click **"📅 View Timetable"** to see the generated schedule in a table.

---

## 🎯 What You Can Do

### View Data
- 👨‍🏫 **View Faculties** - See all faculty members
- 📚 **View Courses** - See all courses (theory & lab)
- 🏫 **View Rooms** - See all available rooms
- 👥 **View Sections** - See all student sections
- ⏰ **View Timeslots** - See all time slots (5 days × 6 slots)

### Manage Timetable
- 🚀 **Generate Timetable** - Create a new schedule
- 📅 **View Timetable** - See the current schedule
- 🗑️ **Clear Timetable** - Delete all scheduled classes

---

## 📊 Sample Data Included

After seeding, you'll have:
- **3 Faculty Members** (Dr. John Smith, Dr. Sarah Johnson, Dr. Michael Brown)
- **5 Courses** (Data Structures, Database Systems, Computer Networks, DS Lab, DBMS Lab)
- **4 Rooms** (2 theory rooms, 2 lab rooms)
- **2 Sections** (CS-A: 50 students, CS-B: 45 students)
- **30 Timeslots** (Monday-Friday, 6 slots each day)

---

## ⚠️ Troubleshooting

### MongoDB Connection Error
**Problem:** Server shows "Error: connect ECONNREFUSED"

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# If stopped, start it
Start-Service -Name MongoDB

# Then restart the backend
npm start
```

### Port 5000 Already in Use
**Problem:** "EADDRINUSE: address already in use :::5000"

**Solution:**
```powershell
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Then restart
npm start
```

### Frontend Can't Connect
**Problem:** "Server is not running" message in browser

**Solution:**
1. Make sure backend is running (`npm start`)
2. Check console for errors
3. Try refreshing the page (Ctrl+F5)

---

## 🎓 Understanding the System

### How It Works
1. **Input:** Faculties, Courses, Rooms, Sections, Timeslots
2. **Process:** Algorithm finds valid combinations considering:
   - Faculty availability
   - Room capacity and type
   - No scheduling conflicts
3. **Output:** Complete timetable with no conflicts

### Constraints
- ✅ Room must fit all students in section
- ✅ Room type must match course type (theory/lab)
- ✅ Faculty must be available at that time
- ✅ No faculty teaching two classes at once
- ✅ No room hosting two classes at once
- ✅ No section having two classes at once

---

## 📞 Need Help?

Check these files:
- **README.md** - Full documentation
- **TEST_RESULTS.md** - Detailed test report
- **Backend logs** - Check terminal where `npm start` is running
- **Browser console** - Press F12 to see frontend errors

---

**Status:** ✅ System is complete and ready to test once MongoDB installation finishes!
