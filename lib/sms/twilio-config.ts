// Sprint 4 request kept this filename, but delivery uses GoHighLevel.
export async function sendSMS(phoneNumber: string, message: string) {
  const apiKey = process.env.GOHIGHLEVEL_API_KEY;
  const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;

  if (!apiKey || !locationId) {
    return { success: false, error: 'Missing GOHIGHLEVEL_API_KEY or GOHIGHLEVEL_LOCATION_ID' };
  }

  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const upsertResp = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers,
      body: JSON.stringify({ locationId, phone: phoneNumber }),
    });

    if (!upsertResp.ok) {
      return { success: false, error: `Contact upsert failed (${upsertResp.status})` };
    }

    const upsertBody = await upsertResp.json();
    const contactId = upsertBody?.contact?.id || upsertBody?.id;
    if (!contactId) {
      return { success: false, error: 'No contact id returned by GoHighLevel' };
    }

    const msgResp = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: 'SMS',
        contactId,
        locationId,
        message,
      }),
    });

    if (!msgResp.ok) {
      const err = await msgResp.text();
      return { success: false, error: `SMS send failed (${msgResp.status}): ${err}` };
    }

    const msgBody = await msgResp.json();
    return { success: true, messageId: msgBody?.messageId || msgBody?.id || null };
  } catch (error: any) {
    return { success: false, error: error.message || 'SMS failed' };
  }
}
