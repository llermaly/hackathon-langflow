import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import React, { useState } from 'react';

import { postEcommerceHtmlParserFlow, postFormHtmlParserFlow } from './requests/lanflow-requests';
import { getBodyHTML, getFormHTML, modifyInputValues } from './extensionFunctions/chromeRequests';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  [key: string]: any;
}

const Button = ({ children, className, isDisabled, isSelected, ...rest }: ButtonProps) => {
  return (
    <button
      disabled={isDisabled}
      className={`px-4 py-1 text-white  rounded-md active:opacity-80 ${isDisabled || isSelected ? 'bg-gray-500' : 'bg-black'} ${className}`}
      {...rest}>
      {children}
    </button>
  );
};

function saveToLocalStorage(data: string, key: string) {
  try {
    localStorage.setItem(key, data);
  } catch (e) {
    throw new Error('Error saving to local storage: ', e as Error);
  }
}

const EcommerceStep = () => {
  const [savedData, setSavedData] = useState<string>(JSON.stringify({ data: 'something' }));
  const [html, setHtml] = useState<string>('');

  const sendHtmlToLangflow = async () => {
    const response = await postEcommerceHtmlParserFlow(html);

    try {
      setSavedData(JSON.stringify(response));

      saveToLocalStorage(JSON.stringify(response), 'e-commerce-info');
    } catch (e) {
      console.error('Error parsing json: ', e);
      throw new Error('Error parsing json: ', e as Error);
    }
  };

  const extractBodyHTML = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id || 0 },
          func: getBodyHTML,
        },
        results => {
          console.log(results[0].result);
          setHtml(results?.[0]?.result ?? '');
        },
      );
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={extractBodyHTML}>Get body html</Button>
      <div>
        <p className="font-bold">Obtained HTML:</p>{' '}
        <div className="max-h-[200px] max-w-[300px] overflow-auto">{html}</div>
      </div>
      <Button onClick={sendHtmlToLangflow}>Send html to langflow</Button>
      <div>
        <p className="font-bold">Obtained data from Langflow:</p> <span>{savedData}</span>
      </div>
    </div>
  );
};

const FormStep = () => {
  const [savedData, setSavedData] = useState<string>('');
  const [html, setHtml] = useState<string>('');

  const getLangflowData = async () => {
    const ecommerceData = localStorage.getItem('e-commerce-info');

    if (!ecommerceData) {
      throw new Error('No e-commerce data found in local storage');
    }

    const response = await postFormHtmlParserFlow(html, ecommerceData);

    try {
      setSavedData(JSON.stringify(response));

      saveToLocalStorage(JSON.stringify(response), 'form-info');
    } catch (e) {
      console.error('Error parsing json: ', e);
      throw new Error('Error parsing json: ', e as Error);
    }
  };

  const extractBodyHTML = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id || 0 },
          func: getFormHTML,
        },
        results => {
          setHtml(results?.[0]?.result ?? '');
        },
      );
    });
  };

  const insertData = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id || 0 },
          func: modifyInputValues,
          args: [savedData], //Args to pass to the function
        },
        results => {
          console.log(results[0].result);
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            console.log('Script injected successfully');
          }
        },
      );
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="font-bold">Product data:</p>{' '}
        <div className="max-h-[200px] max-w-[300px] overflow-auto">{savedData}</div>
      </div>
      <Button onClick={extractBodyHTML}>Get form to fill html</Button>
      <div>
        <p className="font-bold">Obtained HTML:</p>{' '}
        <div className="max-h-[200px] max-w-[300px] overflow-auto">{html}</div>
      </div>
      <Button onClick={getLangflowData}>Send form to fill + product data</Button>
      <Button onClick={insertData}>Insert data</Button>
      <div>
        <p>Obtained data from langflow:</p> <span>{savedData}</span>
      </div>
    </div>
  );
};

const Popup = () => {
  const [step, setStep] = useState<'ecommerce' | 'form'>('ecommerce');

  return (
    <div className="flex flex-col items-center justify-center pt-2">
      <h1 className="mb-2 text-2xl font-bold">Omawei</h1>
      <div className="flex gap-2 mb-4">
        <Button isSelected={step === 'ecommerce'} onClick={() => setStep('ecommerce')}>
          Ecommerce
        </Button>
        <Button isSelected={step === 'form'} onClick={() => setStep('form')}>
          Form
        </Button>
      </div>
      {step === 'ecommerce' ? <EcommerceStep /> : <FormStep />}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
