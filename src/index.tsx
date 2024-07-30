import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { initializeApp } from './initializeApp';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { BrowserRouter } from 'react-router-dom';
import { TitleTranslator } from './components/layout/TitleTranslator';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';
import 'dayjs/locale/en-gb';

// Set the default locale
dayjs.locale('uk');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

initializeApp().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <I18nextProvider i18n={i18n}>
            <TitleTranslator>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language === 'uk' ? 'uk' : 'en-gb'}>
                <App />
              </LocalizationProvider>
            </TitleTranslator>
          </I18nextProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
  );
})