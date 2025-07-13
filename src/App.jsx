import { useCallback, useState, useEffect, useRef } from "react";
import "./App.css";
import QRCode from "react-qr-code";
import { toJpeg } from "html-to-image";
function App() {
  const [password, setPassword] = useState("");
  const [symbol, setSymbol] = useState(false);
  const [number, setNumber] = useState(false);
  const [length, setLength] = useState(6);
  const [text, setText] = useState("");
  const [type, setType] = useState("Weak");
  const [qrcode, setQrcode] = useState(false);

  const ref = useRef(null);
  const qrRef = useRef();

  const downloadJpg = () => {
    if (qrRef.current === null) return;

    toJpeg(qrRef.current, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "password-qr.jpg";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Failed to download JPEG image", error);
      });
  };

  const generatePassword = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (number) str += "01234567890123456789";
    if (symbol) str += "~!@#$%^&*_-=+*/~!@#$%^&*_-=+*/";
    for (let i = 1; i <= length; i++) {
      let index = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(index);
    }
    setPassword(pass);
    setText("");
    if (pass.length < 8 || ((!number && !symbol) && pass.length < 15)) setType("Weak");
    else if (pass.length >= 12 && number && symbol) setType("Strong");
    else setType("Medium");
  }, [number, symbol, length, type]);

  const copyPassword = useCallback(() => {
    ref.current?.select();
    window.navigator.clipboard.writeText(password);
    setText("Password Copied!");
  }, [password]);

  useEffect(() => {
    generatePassword();
  }, [number, symbol, length, generatePassword, type]);

  return (
    <div className="bg-zinc-800 min-h-screen w-full flex justify-center flex-col items-center px-4 py-8">
      <h1 className="text-3xl lg:text-4xl text-zinc-400 font-bold text-center mb-4">
        Password Generator
      </h1>

      <div className="bg-zinc-700 w-full max-w-xl h-fit rounded-lg flex flex-col gap-5 p-6">
        <div className="flex flex-col sm:flex-row">
          <input
            value={password}
            onChange={generatePassword}
            ref={ref}
            className="bg-white focus:outline-none focus:ring-0 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none px-3 py-2 w-full"
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
        <div className="relative">
          <p
            className={`absolute right-0 ${
              type === "Weak"
                ? "text-red-500"
                : type === "Medium"
                ? "text-yellow-400"
                : "text-green-400"
            } `}
          >
            {type}
          </p>
          {text && <p className="text-green-400 lg:text-center">{text}</p>}
        </div>

        <div className="flex flex-col mt-4 lg:mt-0 sm:flex-row sm:justify-between gap-4">
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
          <div className="flex gap-3 flex-wrap justify-between">
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
            <div className="flex items-center gap-2">
              <input
                onChange={() => setQrcode((prev) => !prev)}
                defaultChecked={qrcode}
                type="checkbox"
              />
              <p className="text-white whitespace-nowrap">Show QR</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <div ref={qrRef}>
            {qrcode && <QRCode className="w-20 h-20" value={password} />}
          </div>
          {qrcode && (
            <button
              onClick={downloadJpg}
              className="bg-green-600 w-fit h-fit px-4 py-2 text-white hover:bg-green-500 rounded-lg "
            >
              Download QR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
