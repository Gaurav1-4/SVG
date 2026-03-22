const { JSDOM } = require('jsdom');
JSDOM.fromURL("http://localhost:4173/", {
  runScripts: "dangerously",
  resources: "usable"
}).then(dom => {
  dom.window.addEventListener('error', (err) => {
    console.error("JSDOM Error:", err.error || err.message);
  });
  dom.window.addEventListener('unhandledrejection', (err) => {
    console.error("JSDOM Unhandled Promise Rejection:", err.reason);
  });
  setTimeout(() => {
    console.log("JSDOM Output root innerHTML:");
    console.log(dom.window.document.getElementById('root')?.innerHTML.substring(0, 500));
    process.exit(0);
  }, 2000);
});
