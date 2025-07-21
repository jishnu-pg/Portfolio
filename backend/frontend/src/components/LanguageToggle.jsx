import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ml' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium text-blue-700 dark:text-gray-200"
      aria-label={t('accessibility.languageToggle')}
      title={t('accessibility.languageToggle')}
    >
      <span className="text-lg">
        {i18n.language === 'en' ? '🇮🇳' : '🇺🇸'}
      </span>
      <span className="hidden sm:inline">
        {i18n.language === 'en' ? 'മലയാളം' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle; 