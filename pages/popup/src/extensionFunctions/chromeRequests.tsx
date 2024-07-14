export function getBodyHTML() {
  return document.body.innerHTML;
}

export function modifyInputValues(data: string) {
  //This function is used to extract values from a JSON object or an array
  function extractValues(obj: any) {
    let values = [];

    function recurse(current: any) {
      if (typeof current === 'object' && current !== null) {
        if (Array.isArray(current)) {
          current.forEach(item => recurse(item));
        } else {
          Object.values(current).forEach(value => recurse(value));
        }
      } else {
        values.push(current);
      }
    }

    recurse(obj);

    return values;
  }

  function setHTMLvalue(htmlNode: HTMLElement, value: any) {
    if (htmlNode.tagName === 'INPUT' || htmlNode.tagName === 'TEXTAREA') {
      // If the value is not text, extract the values from the object or array
      if (Array.isArray(value) || typeof value === 'object') {
        const values = extractValues(value);

        htmlNode.value = values.join('\n');
      } else {
        htmlNode.value = value;
      }
    }
  }

  let localData = null;
  try {
    localData = JSON.parse(data);
  } catch (e) {
    console.error('Error parsing json: ', e);
    throw new Error('Error parsing json: ', e as Error);
  }

  const jsonData = JSON.parse(localData);

  // Select all elements with jsname attribute: this is used to clear the initial text in the input fields for Google forms
  const elementsWithJsName = document.querySelectorAll('div[jsname="LwH6nd"]');

  if (elementsWithJsName?.length) {
    elementsWithJsName.forEach(element => {
      element.textContent = '';
    });
  }

  // Loop through the JSON data and set the values in the input fields
  Object.keys(jsonData).forEach(key => {
    const { HTMLselectorType, HTMLselectorValue, value } = jsonData[key];

    let selector;

    if (HTMLselectorType === 'id') {
      selector = `#${HTMLselectorValue}`;
    } else if (HTMLselectorType === 'class') {
      selector = `.${HTMLselectorValue}`;
    } else if (HTMLselectorType === 'aria-labelledby') {
      selector = `[aria-labelledby="${HTMLselectorValue}"]`;
    } else {
      console.error('Unsupported selector type: ', HTMLselectorType);
      return;
    }

    const element = document.querySelector(selector);

    // Set the value in the input field
    if (element) {
      const innerInput = element.querySelector('input');

      if (innerInput) {
        setHTMLvalue(innerInput, value);
      } else {
        setHTMLvalue(element as HTMLElement, value);
      }
    } else {
      console.error('Element not found for selector:', selector);
    }
  });
}

export function getFormHTML() {
  const form = document.querySelectorAll('form');

  if (form.length === 0) return 'No form found in the page.';

  const forms = Array.from(form).map(form => {
    return form.outerHTML;
  });

  const formsString = forms.join('\n\n');
  console.log('formsString: ', formsString);

  return formsString || 'No form found in the page.';
}
