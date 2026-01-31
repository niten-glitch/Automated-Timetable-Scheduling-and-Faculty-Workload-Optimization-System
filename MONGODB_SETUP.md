# MongoDB Installation & Testing Guide

## Option 1: MongoDB Atlas (Cloud) - RECOMMENDED ⚡

**Fastest way to get started - No installation needed!**

### Steps:

1. **Create Free MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google
   - Choose "Free" tier (M0 Sandbox)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `admin`
   - Password: `admin123` (or your choice)
   - User Privileges: "Atlas admin"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`)

6. **Update .env File**
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/timetable_db?retryWrites=true&w=majority
   NODE_ENV=development
   ```
   Replace `<password>` with your actual password and update the cluster URL.

7. **Continue with Testing**
   ```bash
   npm run seed
   npm start
   ```

---

## Option 2: Local MongoDB Installation (Windows)

### Method A: Using Chocolatey (Fastest)

```powershell
# Install Chocolatey if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb -y

# Start MongoDB service
net start MongoDB
```

### Method B: Manual Download

1. Download MongoDB Community Server:
   - Go to: https://www.mongodb.com/try/download/community
   - Choose Windows
   - Download MSI installer

2. Run the installer:
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service
   - Install MongoDB Compass (optional GUI)

3. Verify installation:
   ```powershell
   mongod --version
   ```

4. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```

---

## Quick Test Without MongoDB

If you want to test the backend structure without MongoDB, I can create a mock/in-memory version. However, for full functionality, you'll need MongoDB (Atlas or local).

---

## Current Status

✅ **Backend Code:** Complete and ready
✅ **Frontend:** Complete and ready
✅ **Seed Script:** Ready to populate database
⏳ **MongoDB:** Needs to be set up (Atlas recommended)

---

## Recommended Next Steps

1. **Use MongoDB Atlas** (5-10 minutes setup, no installation)
2. **Update .env** with Atlas connection string
3. **Run seed script:** `npm run seed`
4. **Start backend:** `npm start`
5. **Open frontend:** `timetable-frontend/index.html`
6. **Test the system**

---

## Alternative: Docker MongoDB (Advanced)

If you have Docker installed:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then use the default `.env` configuration.
