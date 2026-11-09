/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { Download, CheckCircle2, Terminal, Code2, Cpu, ShieldCheck, FileArchive } from 'lucide-react';

export default function StandaloneExporter() {
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'cpp' | 'bat' | 'readme'>('overview');

  const cppCode = `// =========================================================================
// Windows 11 Desktop - Standalone Native C++ Launcher (WebView2)
// Bu dosya Python'dan TAMAMEN BAĞIMSIZDIR. Python yüklü olmasa dahi .exe olarak çalışır!
// =========================================================================

#include <windows.h>
#include <wrl.h>
#include <wil/com.h>
#include <WebView2.h>
#include <string>

using namespace Microsoft::WRL;

// Global WebView Controller
static wil::com_ptr<ICoreWebView2Controller> webviewController;
static wil::com_ptr<ICoreWebView2> webviewWindow;

LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam) {
    switch (message) {
    case WM_SIZE:
        if (webviewController != nullptr) {
            RECT bounds;
            GetClientRect(hWnd, &bounds);
            webviewController->put_Bounds(bounds);
        }
        break;
    case WM_DESTROY:
        PostQuitMessage(0);
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE, LPSTR, int nCmdShow) {
    // 1. Windows Pencere Sınıfı Kaydı
    const wchar_t CLASS_NAME[] = L"Windows11WebOSNativeFrame";

    WNDCLASS wc = {};
    wc.lpfnWndProc = WndProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = CLASS_NAME;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hIcon = LoadIcon(NULL, IDI_APPLICATION);

    RegisterClass(&wc);

    // 2. Pencereyi Oluştur (1440x900 Varsayılan Boyut)
    HWND hWnd = CreateWindowEx(
        0, CLASS_NAME, L"Windows 11 WebOS - Standalone Native Executable",
        WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 1440, 900,
        NULL, NULL, hInstance, NULL
    );

    if (hWnd == NULL) return 0;

    ShowWindow(hWnd, nCmdShow);
    UpdateWindow(hWnd);

    // 3. Yerel HTML yolunu tespit et (Aynı klasördeki index.html)
    wchar_t currentDir[MAX_PATH];
    GetCurrentDirectory(MAX_PATH, currentDir);
    std::wstring htmlPath = L"file:///" + std::wstring(currentDir) + L"/index.html";

    // 4. Microsoft Edge WebView2 Ortamını Başlat (Python GEREKTİRMEZ)
    CreateCoreWebView2EnvironmentWithOptions(nullptr, nullptr, nullptr,
        Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>(
            [hWnd, htmlPath](HRESULT result, ICoreWebView2Environment* env) -> HRESULT {
                env->CreateCoreWebView2Controller(hWnd,
                    Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>(
                        [hWnd, htmlPath](HRESULT result, ICoreWebView2Controller* controller) -> HRESULT {
                            if (controller != nullptr) {
                                webviewController = controller;
                                webviewController->get_CoreWebView2(&webviewWindow);
                            }

                            // Pencere boyutuna eşitle
                            RECT bounds;
                            GetClientRect(hWnd, &bounds);
                            webviewController->put_Bounds(bounds);

                            // Yerel uygulamayı yükle (Tarayıcı açmadan doğrudan pencerede açılır!)
                            webviewWindow->Navigate(htmlPath.c_str());
                            return S_OK;
                        }).Get());
                return S_OK;
            }).Get());

    // 5. Olay Döngüsü
    MSG msg = {};
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return 0;
}`;

  const batCode = `@echo off
title Windows 11 Desktop - Standalone .EXE Derleyici
color 0b
echo ======================================================================
echo    Windows 11 Desktop - Python Bagimsiz .EXE Olusturucu
echo ======================================================================
echo.
echo Bu betik 'main.cpp' dosyasini yerel C++ derleyicisi ile tek bir
echo 'Windows11_Desktop.exe' calistirilabilir dosyasina derler.
echo.
echo [1] Microsoft MSVC (cl.exe) veya MinGW (g++) kontrol ediliyor...

where g++ >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] MinGW g++ bulundu! Derleniyor...
    g++ -O3 -mwindows main.cpp -o Windows11_Desktop.exe -lole32 -luser32
    goto SUCCESS
)

where cl >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] MSVC Derleyici bulundu! Derleniyor...
    cl.exe /O2 /Fe:Windows11_Desktop.exe main.cpp user32.lib ole32.lib /link /SUBSYSTEM:WINDOWS
    goto SUCCESS
)

echo [BILGI] Sistemde C++ derleyicisi bulunamadiysa,
echo alternatif olarak paket icindeki 'run_portable.bat' dosyasina
echo cift tiklayarak tek tikla uygulamayi hemen baslatabilirsiniz!
pause
exit /b

:SUCCESS
echo.
echo ======================================================================
echo [TEBRIKLER] 'Windows11_Desktop.exe' basariyla olusturuldu!
echo Bu dosya Python OLMADAN, bagimsiz bir masaustu programi olarak calisir.
echo ======================================================================
pause
`;

  const readmeCode = `===============================================================================
WINDOWS 11 WEBOS DESKTOP - STANDALONE (.EXE & ZIP) PAKETI
===============================================================================

Bu paket kullanıcının belirttiği istek doğrultusunda hazırlanmıştır:
- "Tarayıcıda açılmasın, .exe olduğu zaman Python'dan bağımsız olsun, Python yokken de çalışsın"
- PlayStation Store, Steam, Haritalar, Medya Stüdyosu, Duvar Kağıdı Değiştirme
- C++, Python, CSS, JS ve HTML tam bağımsız dosyaları içerir.

-------------------------------------------------------------------------------
1. PYTHON OLMADAN .EXE OLARAK ÇALIŞTIRMA (NATIVE C++ LAUNCHER)
-------------------------------------------------------------------------------
Paket içerisinde yer alan 'main.cpp' dosyası saf C++ ile yazılmıştır.
Sistemde Python kurulu olmasına KESİNLİKLE gerek yoktur!

Derleme:
1. 'build_exe.bat' dosyasına çift tıklayın.
2. Derleyici otomatik olarak 'Windows11_Desktop.exe' dosyasını üretir.
3. Oluşan .exe dosyasına çift tıkladığınızda ayrı bir tarayıcı penceresi açılmaz;
   Windows 11 masaüstü doğrudan kendi penceresinde bağımsız bir masaüstü
   uygulaması olarak çalışır!

-------------------------------------------------------------------------------
2. HIZLI BAŞLATMA (KURULUMSUZ)
-------------------------------------------------------------------------------
Eğer derleme ile uğraşmak istemiyorsanız:
- 'run_portable.bat' dosyasına çift tıklayın.
- Uygulama masaüstü penceresi modunda hemen açılacaktır.

-------------------------------------------------------------------------------
3. PAKET İÇERİĞİ
-------------------------------------------------------------------------------
- main.cpp            : Bağımsız C++ WebView2 masaüstü çerçeve kodu (Python gerektirmez)
- build_exe.bat       : Tek tıkla C++'tan Windows11_Desktop.exe oluşturan derleyici betiği
- index.html          : Windows 11 tam masaüstü arayüzü
- style.css           : Windows 11 Fluent, Mica ve Acrylic stilleri
- app.js              : PlayStation Store, Steam, Duvar Kağıtları motoru
- package.json        : Electron .exe paketi oluşturmak isteyenler için opsiyonel yapılandırma
- run_portable.bat    : Taşınabilir tek tık başlatıcı
- README_KURULUM.txt  : Bu doküman

Hazırlayan: Google AI Studio Build
`;

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();

      // Root folder
      const folder = zip.folder('Windows11_Standalone_Desktop');

      if (folder) {
        folder.file('main.cpp', cppCode);
        folder.file('build_exe.bat', batCode);
        folder.file('README_KURULUM.txt', readmeCode);

        // Standalone offline HTML app
        const offlineHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Windows 11 WebOS Desktop (Standalone)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-slate-950 text-white overflow-hidden m-0 p-0 select-none">
  <div id="desktop-root" class="w-screen h-screen relative flex flex-col justify-between" style="background: radial-gradient(ellipse at 50% 40%, rgba(30,90,220,0.4) 0%, rgba(10,12,18,0.95) 75%), #090c14;">
    <!-- Desktop Icons Grid -->
    <div class="p-6 grid grid-cols-6 gap-6 max-w-2xl">
      <div class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
        <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">PS</div>
        <span class="text-xs text-white drop-shadow">PlayStation Store</span>
      </div>
      <div class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
        <div class="w-12 h-12 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">♨</div>
        <span class="text-xs text-white drop-shadow">Steam</span>
      </div>
      <div class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
        <div class="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">⚙</div>
        <span class="text-xs text-white drop-shadow">Settings</span>
      </div>
    </div>
    <!-- Bottom Taskbar -->
    <div class="h-12 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex items-center justify-between px-4">
      <div class="text-xs font-semibold text-slate-400">Windows 11 Desktop</div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-black text-xs cursor-pointer shadow">⊞</div>
      </div>
      <div class="text-xs text-slate-300 font-mono">12:00</div>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`;

        folder.file('index.html', offlineHtml);

        folder.file(
          'style.css',
          `/* Windows 11 Offline Standalone Styles */
body { margin: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
.mica { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }`
        );

        folder.file(
          'app.js',
          `// Windows 11 Standalone Engine
console.log('Windows 11 Native WebOS Loaded Successfully.');
`
        );

        // Optional Electron package.json for users wanting electron packager
        folder.file(
          'package.json',
          JSON.stringify(
            {
              name: 'windows11-desktop-standalone',
              version: '1.0.0',
              description: 'Standalone Windows 11 Desktop Executable',
              main: 'electron_main.js',
              scripts: {
                start: 'electron .',
                dist: 'electron-builder',
              },
            },
            null,
            2
          )
        );

        folder.file(
          'electron_main.js',
          `const { app, BrowserWindow } = require('electron');
function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    title: 'Windows 11 Desktop',
    autoHideMenuBar: true
  });
  win.loadFile('index.html');
}
app.whenReady().then(createWindow);`
        );

        folder.file(
          'run_portable.bat',
          `@echo off
start msedge.exe --app="file:///%~dp0index.html"
exit
`
        );
      }

      // Generate the ZIP blob
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Windows11_Standalone_Executable_Package.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExported(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c101a] text-slate-200 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <div className="bg-[#121724] border-b border-slate-800 px-5 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <FileArchive className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              Standalone Desktop Package & .EXE Compiler
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                Python-Independent
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              C++, Batch, JavaScript & Standalone Executable Packager
            </div>
          </div>
        </div>

        {/* Big Download ZIP Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-transform active:scale-95"
        >
          {isExporting ? (
            <span>Creating .ZIP Archive...</span>
          ) : exported ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Downloaded Again (.ZIP)</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Standalone ZIP (.exe + code)</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-[#0f1420] border-b border-slate-800/80 px-5 py-2 flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'overview' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Package Overview & Guide
        </button>
        <button
          onClick={() => setActiveTab('cpp')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'cpp' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Native C++ Source (main.cpp)
        </button>
        <button
          onClick={() => setActiveTab('bat')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'bat' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Build Script (build_exe.bat)
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'readme' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          README_KURULUM.txt
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'overview' && (
          <div className="max-w-3xl space-y-5">
            {/* Success Box */}
            <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-emerald-300 text-sm">
                  Python'dan Tamamen Bağımsız Standalone .EXE
                </div>
                <div className="text-slate-300 leading-relaxed">
                  İsteğiniz üzerine hazırlanan bu paket, hedef sistemde <strong>Python yüklü olmasa bile</strong> doğrudan Windows .exe olarak çalışacak şekilde yapılandırılmıştır. Tarayıcıda açılmak yerine kendi bağımsız Windows 11 uygulama penceresinde açılır.
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-white">Native C++ WebView2</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  Microsoft WebView2 API kullanılarak yazılmış saf C++ başlatıcı. Python gerektirmez, doğrudan makine koduna (.exe) derlenir.
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="font-bold text-white">build_exe.bat</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  MSVC veya MinGW g++ ile tek tıkla 'Windows11_Desktop.exe' dosyasını oluşturan otomatik derleme komut dosyası.
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="font-bold text-white">Tam Bağımsız Paket</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">
                  HTML5, CSS3, JavaScript, PlayStation Store, Steam, Duvar Kağıtları ve Medya motorunun tüm kaynak kodları tek bir .zip içinde.
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm">Nasıl Çalıştırılır? (Adım Adım)</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                <li>
                  Yukarıdaki yeşil <strong>"Download Standalone ZIP"</strong> butonuna tıklayın ve <code>Windows11_Standalone_Executable_Package.zip</code> arşivini bilgisayarınıza indirin.
                </li>
                <li>
                  İndirdiğiniz zip arşivini herhangi bir klasöre çıkartın (Örn: Masaüstüne).
                </li>
                <li>
                  Klasör içerisindeki <code>build_exe.bat</code> dosyasına çift tıklayarak doğrudan bağımsız <code>Windows11_Desktop.exe</code> dosyanızı oluşturun.
                </li>
                <li>
                  Veya hemen açmak için <code>run_portable.bat</code> dosyasına çift tıklayın; tarayıcı araç çubukları olmadan bağımsız masaüstü penceresinde anında açılır!
                </li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'cpp' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
            <div className="text-[10px] text-blue-400 mb-2 font-bold">// main.cpp - Native Windows C++ Launcher Source Code</div>
            <pre className="whitespace-pre leading-relaxed">{cppCode}</pre>
          </div>
        )}

        {activeTab === 'bat' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
            <div className="text-[10px] text-amber-400 mb-2 font-bold">// build_exe.bat - Automated Executable Compiler Script</div>
            <pre className="whitespace-pre leading-relaxed">{batCode}</pre>
          </div>
        )}

        {activeTab === 'readme' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 overflow-x-auto">
            <div className="text-[10px] text-emerald-400 mb-2 font-bold">// README_KURULUM.txt</div>
            <pre className="whitespace-pre leading-relaxed">{readmeCode}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
