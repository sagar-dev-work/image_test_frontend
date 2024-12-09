# Frontend Installation (Next.js)

### Step 1: Clone the Repository
#### git clone https://github.com/sagar-dev-work/image_test_frontend.git
#### cd image_test_frontend

### Step 2: Install Dependencies
#### npm install

### Step 3: Configure Environment Variables
### Create a `.env.local` file in the root directory and configure your environment variables as needed.

#### Example:
#### echo "NEXT_PUBLIC_API_URL=https://api.example.com" > .env.local

### Step 4: Start the Development Server
#### npm run dev

#### The server will start at http://localhost:3000 by default.

### Step 5: Build and Start Production Server (Optional)
#### Build the application for production.
#### npm run build

### Start the production server.
#### npm start

### Production server will run at http://localhost:3000 by default.

### Step 6: Test Linting (Optional)
#### Check for linting errors in your project.
#### npm run lint
