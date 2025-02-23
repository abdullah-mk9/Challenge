#!/bin/sh

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No color

# Function to start a service and prefix its output with color
start_service() {
  service_name=$1
  color=$2
  command=$3
  $command 2>&1 | awk -v prefix="$service_name: " -v color="$color" -v nc="$NC" '{print color prefix nc $0}' &
}

# Start each service with its prefixed output and unique color
start_service "gateway" "$RED" "nest start gateway --watch"
start_service "users" "$GREEN" "nest start users --watch"
start_service "notifications" "$BLUE" "nest start notifications --watch"

# Wait for all background processes to finish
wait
