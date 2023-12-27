/* eslint-disable no-restricted-globals */
// run the timeout in a worker because otherwise it gets de-prioritizied on tab-out
const workercode = () => {
  let timeoutId: null | NodeJS.Timeout = null;
  self.onmessage = function (e) {
    if (timeoutId !== null) clearTimeout(timeoutId);
    if (e.data.params !== undefined) {
      timeoutId = setTimeout(() => {
        self.postMessage(e.data.params);
      }, e.data.time);
    }
  };
};

const rawCode = workercode.toString();
const code = rawCode.substring(
  rawCode.indexOf("{") + 1,
  rawCode.lastIndexOf("}")
);

const blob = new Blob([code], { type: "application/javascript" });
const workerUrlBlob = URL.createObjectURL(blob);

export { workerUrlBlob };
