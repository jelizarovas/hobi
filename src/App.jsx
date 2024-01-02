import { Check } from "./Check";
import { Navbar } from "./Navbar";
import { QRScanner } from "./QRScanner";


function App() {
  return (
    <>
      {/* <QRScanner /> */}
      {/* <Navbar /> */}
      <div className="bg-red-400 text-center px-4 py-10 flex flex-col">
        <span>This is a legacy version.</span> 
        <span>RAO WEB APP was transferred to:</span>
        <a target="_self" className="font-black bg-white rounded bg-opacity-20 hover:bg-opacity-30 transition-all py-2 my-2" href="http://jelizarovas.github.io/hob/">http://jelizarovas.github.io/hob/</a>

      </div>
      <Check />
    </>
  );
}

export default App;
