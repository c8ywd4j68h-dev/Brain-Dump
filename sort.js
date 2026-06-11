exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const { text } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: `You are a task sorter. Sort the user's brain dump into 2-5 categories that fit the actual content.
Use category names like: Work, Personal, Comms, Creative, Admin, Game Dev, Health, Music — whatever fits.
Assign each category one of these colors: red, orange, yellow, green, teal, blue, purple, pink — spread them across the rainbow, don't repeat.
Flag urgent = true if the task sounds time-sensitive or blocking.
Respond ONLY with valid JSON, no markdown, no backticks:
{"categories":[{"name":"string","color":"string","tasks":[{"text":"string","urgent":true}]}]}`,
        messages: [{ role: 'user', content: text }]
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
