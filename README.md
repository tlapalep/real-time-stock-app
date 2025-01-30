# Real-Time Stock Trading App

This project is a simplified real-time stock trading application. The app displays a chart for a single stock (hardcoded to "AAPL" for this exercise), updates the price in real-time, and allows users to simulate buying and selling shares.

## Features

- **Real-time Stock Chart:**
  - Displays a line chart showing the stock's price history.
  - Updates in real-time as new price data arrives.
- **Trading Simulation:**
  - Users can buy and sell shares with a starting balance of $10,000.
  - Tracks the user's cash balance, shares held, and displays the current stock price.
  - Implements optimistic updates: The UI updates immediately upon a trade, with errors handled gracefully.
- **WebSocket Integration:**
  - Real-time communication for live stock price updates.

---

## Technology Stack

### Frontend:
- React (with Hooks)
- Lightweight Charts (by TradingView)
- CSS for simple styling

### Backend:
- Node.js with Express
- WebSocket server for real-time updates

### Infrastructure:
- Dockerized services managed with Docker Compose
- Nginx as a reverse proxy for the frontend and backend services

---

## Project Setup

### Prerequisites
- Docker and Docker Compose installed on your system.

### Running the Application

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd real-time-stock-app
   ```

2. Build and start the services:
   ```bash
   docker-compose up --build
   ```

3. Access the application in your browser at [http://localhost](http://localhost).

---

## Services Overview

The project consists of the following services:

- **Frontend** (React app served on `/`):
  - Provides the user interface with the stock chart and trading panel.
- **Backend API** (Node.js server on `/api`):
  - Handles API endpoints such as `/api/stock/history` and `/api/trades`.
  - Manages stock data and simulated trades.
- **WebSocket Server**:
  - Sends real-time stock price updates to connected clients.
- **Nginx**:
  - Reverse proxy that routes requests to the appropriate service.

---

## API Endpoints

- **GET /api/stock/info**: Retrieve initial stock information (symbol, current price).
- **GET /api/stock/history**: Retrieve the stock's historical price data.
- **POST /api/trades**: Execute a simulated trade (buy or sell).

---

## Example Data Flow

1. The frontend fetches historical data from `/api/stock/history` when the page loads.
2. The frontend subscribes to real-time updates from the WebSocket server.
3. Users can buy or sell shares via `/api/trades`, and the UI updates optimistically.
4. The backend validates trades and returns the updated balance and shares.

---

## Scalability Considerations

- **WebSocket Management:**
  - To support many users, a scalable WebSocket solution could use a pub/sub system like Redis or Kafka.
  - Load balancing with sticky sessions would ensure consistent WebSocket connections.

- **Efficient Price Updates:**
  - For multiple stocks, a caching mechanism could reduce the frequency of updates.
  - Price data could be broadcast in batches to minimize network overhead.

---

## Assumptions and Limitations

- The app currently supports only one stock (AAPL).
- User data is stored in memory and is not persisted.
- The backend simulates stock price updates with random fluctuations.
- Authentication is not implemented in this version.

---

## Future Enhancements

- Support for multiple stocks.
- Persistent user data with a database (e.g., PostgreSQL, MongoDB).
- Authentication and user-specific trading data.
- Advanced chart features like annotations and custom timeframes.
- Performance optimization for handling a large number of concurrent users.

---

## Commit History and Process

- Frequent commits were made throughout the development process to document progress.
- Each commit message provides context on the changes implemented.

---

## Author
- Tomas Tlapale Pulido

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.