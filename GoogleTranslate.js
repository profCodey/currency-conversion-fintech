import React, { useEffect } from "react";

const GoogleTranslateComponent = () => {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.setAttribute(
      "src",
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    );
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;
  }, []);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      { pageLanguage: "en" },
    //   "google_translate_element"
    );
  };

  return <div id="google_translate_element"></div>;
};

export default GoogleTranslateComponent;
