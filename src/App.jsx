import { useCallback, useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [password, setPassword] = useState("");
  const [symbol, setSymbol] = useState(false);
  const [number, setNumber] = useState(false);
  const [length, setLength] = useState(6);
  const [text, setText] = useState("");

  const ref = useRef(null);

  const generatePassword = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (number) str += "0123456789";
    if (symbol) str += "~!@#$%^&*_-=+*/";
    for (let i = 1; i <= length; i++) {
      let index = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(index);
    }
    setPassword(pass);
    setText("")
  }, [number, symbol, length]);

  const copyPassword = useCallback(() => {
    ref.current?.select();
    window.navigator.clipboard.writeText(password);
    setText("Password Copied!");
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, [number, symbol, length, generatePassword]);

  return (
    <div className="bg-zinc-800 min-h-screen w-full flex justify-center flex-col items-center px-4 py-8">
      <h1 className="text-3xl text-zinc-400 font-bold text-center mb-4">
        Password Generator
      </h1>

      <div className="bg-zinc-700 w-full max-w-xl h-fit rounded-lg flex flex-col gap-5 p-6">
        <div className="flex flex-col sm:flex-row">
          <input
            value={password}
            onChange={generatePassword}
            ref={ref}
            className="bg-white rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none px-3 py-2 w-full"
            readOnly
            type="text"
          />
          <button
            onClick={copyPassword}
            className="rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none focus:outline-none focus:border-none w-full sm:w-fit px-4 py-2 bg-blue-500 cursor-pointer hover:bg-blue-400 text-white font-bold"
          >
            COPY
          </button>
        </div>

        {text && <p className="text-green-400 text-center">{text}</p>}

        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex flex-col items-center gap-2">
            <input
              onChange={(e) => setLength(e.target.value)}
              value={length}
              type="range"
              min={6}
              max={20}
            />
            <p className="text-white whitespace-nowrap">Length : {length}</p>
          </div>
          <div className="flex gap-3 justify-between">
            <div className="flex items-center gap-2">
              <input
                onChange={() => setNumber((prev) => !prev)}
                defaultChecked={number}
                type="checkbox"
              />
              <p className="text-white whitespace-nowrap">Numbers</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={() => setSymbol((prev) => !prev)}
                defaultChecked={symbol}
                type="checkbox"
              />
              <p className="text-white whitespace-nowrap">Symbols</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
