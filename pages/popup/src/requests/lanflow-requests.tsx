const serviceUrl = 'https://langflowailangflowlatest-production-4888.up.railway.app';
const ecommerceParserFlowId = 'e-commerce-endpoint';
const formParserFlowId = 'form-endpoint';

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

  let response = null;

  try {
    response = await fetch(`${serviceUrl}/api/v1/run/${ecommerceParserFlowId}?stream=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (e) {
    throw new Error('Error in the e-commerce flow request: ', e as Error);
  }

  try {
    const jsonResponse = await response.json();

    return jsonResponse?.outputs[0]?.outputs[0]?.outputs?.message?.message?.text;
  } catch (e) {
    throw new Error('Error parsing json: ', e as Error);
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
    input_value: `form HTML: ${html} : JSON extracted from ecommerce ${json}`,
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

  let response = null;

  try {
    response = await fetch(`${serviceUrl}/api/v1/run/${formParserFlowId}?stream=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (e) {
    throw new Error('Error in the form flow request: ', e as Error);
  }

  try {
    const jsonResponse = await response.json();

    return jsonResponse?.outputs[0]?.outputs[0]?.outputs?.message?.message?.text;
  } catch (e) {
    throw new Error('Error parsing json: ', e as Error);
  }
}
