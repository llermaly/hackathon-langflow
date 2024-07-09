const serviceUrl = 'http://127.0.0.1:7860';
const ecommerceParserFlowId = '39df0  053-5764-4b6d-b00a-5e89bfaaed75';
const formParserFlowId = '2a92282c-99c4-4175-a572-41dc4c2bb6fc';

/**
 * Sends a POST request to the e-commerce HTML parser flow API endpoint.
 * @param html The HTML content to be parsed.
 * @returns A Promise that resolves to the parsed response JSON.
 */
export async function postEcommerceHtmlParserFlow(html: string) {
  const data = {
    input_value: html,
    output_type: 'chat',
    input_type: 'chat',
    tweaks: {
      'OpenAIModel-YkhZp': {},
      'Prompt-kVH3t': {},
      'Prompt-Ve0hw': {},
      'TextOutput-5pSOa': {},
      'ChatInput-OjuKq': {},
      'ChatOutput-hQLug': {},
    },
  };

  try {
    const response = await fetch(`${serviceUrl}/api/v1/run/${ecommerceParserFlowId}?stream=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const jsonResponse = await response.json();

    return jsonResponse?.outputs[0]?.outputs[0]?.outputs?.message?.message?.text;
  } catch (e) {
    throw new Error('Error in the e-commerce flow request: ', e as Error);
  }
}

/**
 * Parses the form HTML and JSON using the Langflow API.
 * @param html - The HTML string representing the form.
 * @param json - The JSON string representing the product data extracted from e-commerce HTML.
 * @returns A Promise that resolves to the parsed response from the Langflow API.
 */
export async function postFormHtmlParserFlow(html: string, json: string) {
  const data = {
    input_value: `${html}:${json}`,
    output_type: 'chat',
    input_type: 'chat',
    tweaks: {
      'OpenAIModel-YkhZp': {},
      'Prompt-kVH3t': {},
      'Prompt-Ve0hw': {},
      'TextOutput-5pSOa': {},
      'ChatInput-OjuKq': {},
      'ChatOutput-hQLug': {},
    },
  };

  try {
    const response = await fetch(`${serviceUrl}/api/v1/run/${formParserFlowId}?stream=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const jsonResponse = await response.json();

    return jsonResponse?.outputs[0]?.outputs[0]?.outputs?.message?.message?.text;
  } catch (e) {
    throw new Error('Error in the form flow request: ', e as Error);
  }
}
