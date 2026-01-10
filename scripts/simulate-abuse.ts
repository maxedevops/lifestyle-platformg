async function simulateAbuse() {
  const TARGET_URL = 'http://localhost:8787/api/v1/messages/send';
  console.log("🚀 Starting Abuse Simulation...");

  for (let i = 0; i < 50; i++) {
    const response = await fetch(TARGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer attacker_token' },
      body: JSON.stringify({ recipientId: 'victim_id', encryptedPayload: 'spam' })
    });

    if (response.status === 403) {
      console.log(`✅ Trust Engine blocked request ${i} (Reputation Threshold Met)`);
      break;
    }
  }
}

simulateAbuse();