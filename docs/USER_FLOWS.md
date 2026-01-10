sequenceDiagram
    participant U as User (Alice)
    participant B as Browser (Crypto Lib)
    participant W as Cloudflare Worker
    participant D1 as D1 Database
    participant DO as Durable Object (Presence)

    Note over U, B: Step 1: Secure Message Creation
    U->>B: Types message "Hello Bob"
    B->>W: GET /api/v1/profiles/bob
    W->>D1: Query Bob's Public Key
    D1-->>B: Bob_PubKey
    B->>B: Encrypt(msg, Bob_PubKey)
    
    Note over B, W: Step 2: Edge Trust Gate
    B->>W: POST /api/v1/messages/send {ciphertext}
    W->>W: Run trustEngine(Alice_ID)
    W->>DO: Increment Alice's Velocity
    
    Note over W, D1: Step 3: Persistence
    W->>D1: INSERT INTO messages (encrypted_blob)
    W-->>U: 200 OK (Sent)

    Note over W, DO: Step 4: Real-time Notification
    W->>DO: Notify Bob's Active Session