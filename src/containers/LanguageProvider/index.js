import React, { createContext, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LOCALE } from '../../i18n';

const LanguageContext = createContext({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({
  messages,
  children,
  initialLocale = DEFAULT_LOCALE,
}) {
  const [locale, setLocale] = useState(initialLocale);
  const contextValue = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <LanguageContext.Provider value={contextValue}>
      <IntlProvider locale={locale} key={locale} messages={messages[locale]}>
        {React.Children.only(children)}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

LanguageProvider.propTypes = {
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
  initialLocale: PropTypes.string,
};

export default LanguageProvider;
