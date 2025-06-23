import React, { useState } from 'react';
import axios from 'axios';

const LanguageTranslator = () => {
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [language, setLanguage] = useState("ml"); // Default: Malayalam

    const translateText = async () => {
        if (!inputText.trim()) {
            alert("Please enter text to translate");
            return;
        }
        try {
            const response = await axios.get(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=en|${language}`
            );
            setTranslatedText(response.data.responseData.translatedText);
        } catch (error) {
            console.error("Translation error:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Language Translator</h2>
            <textarea
                className="form-control mb-3"
                rows="3"
                placeholder="Enter text to translate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            ></textarea>

            <select
                className="form-select mb-3"
                onChange={(e) => setLanguage(e.target.value)}
                value={language}
            >
                <option value="ml">Malayalam</option>
                <option value="ta">Tamil</option>
                <option value="kn">Kannada</option>
                <option value="hi">Hindi</option>
            </select>

            <button className="btn btn-primary" onClick={translateText}>Translate</button>

            {translatedText && (
                <div className="mt-3 p-3 border rounded bg-light">
                    <h5>Translated Text:</h5>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default LanguageTranslator;
