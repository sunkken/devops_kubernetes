# Shared Logging App (Ping-Pong + Log Output)

## Setup Description
- **Ping-Pong App** (`pingpong-app`) writes a request counter to the volume.  
- **Log Output** (`log-output`) appends timestamped random strings to the same volume in a separate file.  
- **Reader** serves the combined content of both files.

## Open in your browser
- Log Output @ [http://localhost:8081](http://localhost:8081)  
- Ping-Pong App @ [http://localhost:8081/pingpong](http://localhost:8081/pingpong)