// disable rule requiring default since we will eventually add more stuff here
// eslint-disable-next-line import/prefer-default-export
export function loadScript(url, callback, type, async) {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  if (async) {
    script.async = true;
  }
  head.append(script);
  script.onload = callback;
  return script;
}
