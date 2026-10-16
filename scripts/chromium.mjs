import { spawn } from 'node:child_process';
import { mkdtemp, rm, readdir, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

async function browserPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  if (process.platform !== 'win32') return 'chromium';
  const local = process.env.LOCALAPPDATA || '';
  const installed = path.join(local,'ms-playwright');
  try {
    const dirs = (await readdir(installed)).filter(name => name.startsWith('chromium_headless_shell-')).sort().reverse();
    for (const dir of dirs) {
      const candidate = path.join(installed,dir,'chrome-headless-shell-win64','chrome-headless-shell.exe');
      try { await access(candidate); return candidate; } catch { /* Outra instalação. */ }
    }
  } catch { /* Chromium pode estar instalado fora do Playwright. */ }
  for (const candidate of [path.join(local,'Google/Chrome/Application/chrome.exe'), 'C:/Program Files/Google/Chrome/Application/chrome.exe']) {
    try { await access(candidate); return candidate; } catch { /* Próximo candidato. */ }
  }
  return 'chromium';
}

export async function launchBrowser({ timeout = 180000 } = {}) {
  const profile = await mkdtemp(path.join(tmpdir(),'fronteira-browser-'));
  const chrome = spawn(await browserPath(),['--headless','--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{ stdio:['ignore','ignore','pipe'],windowsHide:true });
  let socket, session, sequence = 0;
  const pending = new Map(), errors = [], requests = [];
  const deadline = setTimeout(() => chrome.kill('SIGKILL'),timeout);
  function disconnect() { for (const job of pending.values()) { clearTimeout(job.timer); job.reject(new Error('Navegador desconectado')); } pending.clear(); }
  chrome.on('exit',disconnect);
  const endpoint = new Promise((resolve,reject) => {
    let diagnostics = '';
    chrome.stderr.on('data',chunk => { diagnostics = (diagnostics + chunk).slice(-8000); const match = diagnostics.match(/DevTools listening on (ws:\/\/\S+)/); if (match) resolve(match[1]); });
    chrome.once('error',reject); chrome.once('exit',() => reject(new Error(`Falha ao iniciar Chromium: ${diagnostics}`)));
  });
  async function close() {
    clearTimeout(deadline);
    if (socket?.readyState === WebSocket.OPEN) await Promise.race([send('Browser.close',{},true).catch(()=>{}),new Promise(resolve=>setTimeout(resolve,1000))]);
    socket?.close(); if (chrome.exitCode === null) chrome.kill('SIGTERM');
    await new Promise(resolve => setTimeout(resolve,300));
    const relative = path.relative(tmpdir(),profile);
    if (relative.startsWith('..') || path.isAbsolute(relative) || !path.basename(profile).startsWith('fronteira-browser-')) throw new Error('Perfil temporário fora do diretório esperado');
    await rm(profile,{recursive:true,force:true,maxRetries:10,retryDelay:100});
  }
  function send(method,params = {},direct = false) {
    if (process.env.DEBUG_BROWSER) console.log('CDP',method);
    return new Promise((resolve,reject) => {
      const id = ++sequence;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP sem resposta: ${method}`)); },30000);
      pending.set(id,{resolve,reject,timer});
      socket.send(JSON.stringify({ id,method,params,...(session && !direct ? {sessionId:session} : {}) }));
    });
  }
  async function evaluate(expression) {
    const r = await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }
  async function waitFor(expression,attempts = 150) {
    for (let i = 0; i < attempts; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve,80)); }
    throw new Error(`Condição não atendida: ${expression}`);
  }
  try {
    socket = new WebSocket(await endpoint);
    if (process.env.DEBUG_BROWSER) console.log('Chromium connected');
    socket.addEventListener('message',event => {
      const message = JSON.parse(event.data);
      if (message.id && pending.has(message.id)) { const job = pending.get(message.id); pending.delete(message.id); clearTimeout(job.timer); message.error ? job.reject(new Error(JSON.stringify(message.error))) : job.resolve(message.result); }
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
      if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) requests.push({url:message.params.response.url,status:message.params.response.status});
    });
    socket.addEventListener('close',disconnect);
    await new Promise((resolve,reject) => { socket.addEventListener('open',resolve,{once:true}); socket.addEventListener('error',reject,{once:true}); });
    const target = await send('Target.createTarget',{url:'about:blank'},true);
    session = (await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},true)).sessionId;
    await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
    return {
      send,evaluate,waitFor,close,errors,requests,
      async viewport(width,height,mobile = false) { await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile}); },
      async navigate(url) { await send('Page.navigate',{url}); },
      async click(selector) { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); },
      async screenshot({format = 'png',scale = 1,clip,quality} = {}) {
        if (!clip) { const r = await send('Page.getLayoutMetrics'); clip = {x:0,y:0,width:r.cssContentSize.width,height:r.cssContentSize.height,scale}; }
        const r = await send('Page.captureScreenshot',{format,...(quality ? {quality} : {}),captureBeyondViewport:true,clip:{...clip,scale}});
        return Buffer.from(r.data,'base64');
      },
      async key(key,code = key,windowsVirtualKeyCode = 0) { await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode}); await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode}); },
    };
  } catch (error) { await close(); throw error; }
}
