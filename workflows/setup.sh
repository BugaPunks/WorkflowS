#!/bin/bash
#
# Script to set up the WorkflowS development environment.
# This script ensures the environment variables are set and the database is migrated.
#

echo "--- Setting up WorkflowS Environment ---"

# Check for .env file
if [ ! -f ".env" ]; then
    echo ".env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "SUCCESS: .env file created."
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "!!! IMPORTANT: Please fill in your NEXTAUTH_SECRET in .env   !!!"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
else
    echo ".env file already exists. Skipping creation."
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev

if [ $? -eq 0 ]; then
    echo "SUCCESS: Database migrated successfully."
else
    echo "ERROR: Database migration failed. Please check the errors above."
    exit 1
fi

echo ""
echo "--- Environment setup complete! ---"
echo "You can now run the development server with: npm run dev"

exit 0
