import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { useState } from 'react';

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

export function getBodyHTML() {
  return document.body.innerHTML;
}

export function getFormHTML() {
  const form = document.querySelector('form');
  return form ? form.outerHTML : 'No se encontró ningún formulario';
}

const EcommerceStep = () => {
  const [savedData, setSavedData] = useState<string>(JSON.stringify({ data: 'something' }));
  const [html, setHtml] = useState<string>('');

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
      <Button>Send html to langflow</Button>
      <div>
        <p className="font-bold">Obtained data from langflow:</p> <span>{savedData}</span>
      </div>
    </div>
  );
};

const FormStep = () => {
  const [savedData, setSavedData] = useState<string>(JSON.stringify({ data: 'something' }));
  const [html, setHtml] = useState<string>('');

  const extractBodyHTML = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id || 0 },
          func: getFormHTML,
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
      <div>
        <p className="font-bold">Product data:</p>{' '}
        <div className="max-h-[200px] max-w-[300px] overflow-auto">{savedData}</div>
      </div>
      <Button onClick={extractBodyHTML}>Get form to fill html</Button>
      <div>
        <p className="font-bold">Obtained HTML:</p>{' '}
        <div className="max-h-[200px] max-w-[300px] overflow-auto">{html}</div>
      </div>
      <Button>Send form to fill + product data</Button>
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
