type SendSmsInput = {
  to: string;
  body: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export async function sendSMS(input: SendSmsInput) {
  const apiKey = requiredEnv('GOHIGHLEVEL_API_KEY');
  const locationId = requiredEnv('GOHIGHLEVEL_LOCATION_ID');

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const upsertResponse = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId,
      phone: input.to,
    }),
  });

  if (!upsertResponse.ok) {
    const errorText = await upsertResponse.text();
    throw new Error(`GHL contact upsert failed (${upsertResponse.status}): ${errorText}`);
  }

  const upsertPayload = await upsertResponse.json();
  const contactId = upsertPayload?.contact?.id || upsertPayload?.id;

  if (!contactId) {
    throw new Error('GHL contact upsert succeeded but no contact id was returned.');
  }

  const messageResponse = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'SMS',
      contactId,
      locationId,
      message: input.body,
    }),
  });

  if (!messageResponse.ok) {
    const errorText = await messageResponse.text();
    throw new Error(`GHL SMS failed (${messageResponse.status}): ${errorText}`);
  }

  return messageResponse.json();
}
