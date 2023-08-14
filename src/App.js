import React, { useState } from 'react';
import "./App.css";
import { numbers, upperCaseLetters, lowerCaseLetters, specialCharacters } from './Character';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { useClipboard } from 'use-clipboard-copy';

const App = () => {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(9);
  const [includeUpperCase, setIncludeUpperCase] = useState(false);
  const [includeLowerCase, setIncludeLowerCase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [customSpecialCharacters, setCustomSpecialCharacters] = useState(specialCharacters);
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [passwordSizeBits, setPasswordSizeBits] = useState(0);
  const [repeatCharacters, setRepeatCharacters] = useState(false);

  const handleGeneratePassword = () => {
    if (!passwordLength) {
      notify("Please enter a password length", true);
    }
    else if (passwordLength === "0") {
      notify("Password length must be greater than 0", true);
    }
    else if(passwordLength > 999) {
      notify("Password length must be less than 999", true);
    }
    else if (repeatCharacters && !includeUpperCase && !includeLowerCase && !includeNumbers && !includeSymbols) {
      notify("To generate password you must select atleast one checkbox", true);
    }
    else {
      let characterList = ""
      if (includeNumbers) {
        characterList = characterList + numbers;
      }
      if (includeUpperCase) {
        characterList = characterList + upperCaseLetters;
      }
      if (includeLowerCase) {
        characterList = characterList + lowerCaseLetters;
      }
      if (includeSymbols) {
        characterList = characterList + customSpecialCharacters;
      }
      setPassword(createPassword(characterList));
      setIsPasswordGenerated(true);
      setPasswordSizeBits(calculatePasswordSize(characterList, passwordLength));
      notify("Password is generated successfully", false);
    }
  }
  const createPassword = (characterList) => {
    let password = "";
    const characterListLength = characterList.length;
    if (repeatCharacters) {
      for (let i = 0; i < passwordLength; i++) {
        const characterIndex = Math.round(Math.random() * (characterListLength - 1));
        password = password + characterList.charAt(characterIndex);
      }
    } else {
      const shuffledCharacters = characterList.split('').sort(() => 0.5 - Math.random()).join('');
      password = shuffledCharacters.substring(0, passwordLength);
    }
    return password;
  };  
  const notify = (message, hasError = false) => {
    if (hasError) {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else {
      toast.success(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const calculatePasswordSize = (characterList, passwordLength) => {
    const characterSetSize = characterList.length;
    const bitsPerCharacter = Math.log2(characterSetSize);
    return Math.round(bitsPerCharacter * passwordLength);
  }
  
  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'Very Low':
        return 'red';
      case 'Low':
        return 'orange';
      case 'Medium':
        return 'brown';
      case 'Strong':
        return 'lightgreen';
      case 'Very Strong':
        return 'green';
      case 'Ultra Strong':
        return 'darkmagenta';
      default:
        return 'black';
    }
  }

  const getPasswordStrength = () => {
    if (passwordSizeBits <= 16) {
      return 'Very Low';
    } else if (passwordSizeBits <= 32) {
      return 'Low';
    } else if (passwordSizeBits <= 64) {
      return 'Medium';
    } else if (passwordSizeBits <= 128) {
      return 'Strong';
    } else if(passwordSizeBits<= 180) {
      return 'Very Strong';
    } else {
        return 'Ultra Strong';
    }
  }

  const clipboard = useClipboard();
  const handleCopyPassword = (e) => {
    if (password === "") {
      notify("Failed to copy to clipboard", true);
    }
    else {
      clipboard.copy(password);
      notify("Password successfully copied to clipboard.");
    }
  }
  
  return (
    <div className="App">
      <div className="container">
        <div className="generator">
          <h2 className="generator-header">
           Password Generator
          </h2>
          <br></br>
          <div className="form-group">
            <label htmlFor="password-strength">Password length</label>
            <input className="pw" defaultValue={passwordLength} onChange={(e) => setPasswordLength(e.target.value)} type="number" id="password-stregth" name="password-strength" min="1" max="999"/>
          </div>
          <div className="form-group">
            <label htmlFor="repeat-characters">Repeat Characters</label>
            <input checked={repeatCharacters} onChange={(e) => setRepeatCharacters(e.target.checked)} type="checkbox" id="repeat-characters" name="repeat-characters" />
          </div>
          <div className="form-group">
            <label htmlFor="uppercase-letters">Add Uppercase Letters</label>
            <input checked={includeUpperCase} onChange={(e) => setIncludeUpperCase(e.target.checked)} type="checkbox" id="uppercase-letters" name="uppercase-letters" />
          </div>
          <div className="form-group">
            <label htmlFor="lowercase-letters">Add Lowercase Letters</label>
            <input checked={includeLowerCase} onChange={(e) => setIncludeLowerCase(e.target.checked)} type="checkbox" id="lowercase-letters" name="lowercase-letters" />
          </div>
          <div className="form-group">
            <label htmlFor="include-numbers">Add Numbers</label>
            <input checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} type="checkbox" id="include-numbers" name="include-numbers" />
          </div>
          <div className="form-group">
            <label htmlFor="include-symbols">Add Special Characters</label>
            <input checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} type="checkbox" id="include-symbols" name="include-symbols" />
          </div>
          <div className="form-group">
            <label htmlFor="custom-special-characters">Custom Special Characters</label>
            <textarea
              value={customSpecialCharacters}
              onChange={(e) => setCustomSpecialCharacters(e.target.value)}
              id="custom-special-characters"
              name="custom-special-characters"
            />
          </div>
          <button onClick={handleGeneratePassword} className="generator-btn">
            Generate Password
          </button>
          <br></br>
          {isPasswordGenerated && (
              <div>
              <button className="copy-btn" onClick={handleCopyPassword}>
                <i className="clipboard"></i> Copy To Clipboard
              </button>
            </div>
          )}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <br></br>
          <div className="generator-password">
            {password ? (
              <h3>{password}</h3>
            ) : (
              <h3 className="placeholder">Your password will display here</h3>
            )}
          </div>
          {isPasswordGenerated && (
            <div>
              <div className="password-info">
                <div style={{ color: getPasswordStrengthColor(getPasswordStrength()) }}>
                  {getPasswordStrength()} ({passwordSizeBits} bits)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App;