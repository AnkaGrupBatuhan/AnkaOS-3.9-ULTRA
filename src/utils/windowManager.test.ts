import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialWindowState,
  openWindow,
  closeWindow,
  toggleMinimize,
  toggleMaximize,
  bringToFront,
  updateWindowPosition,
  WindowState,
} from './windowManager';

test('createInitialWindowState creates expected default state', () => {
  const win = createInitialWindowState('steam', 'Steam', 'gamepad', 900, 600, 100, 50);
  assert.equal(win.id, 'steam');
  assert.equal(win.title, 'Steam');
  assert.equal(win.isOpen, false);
  assert.equal(win.isMinimized, false);
  assert.equal(win.isMaximized, false);
  assert.equal(win.width, 900);
  assert.equal(win.height, 600);
  assert.equal(win.x, 100);
  assert.equal(win.y, 50);
});

test('openWindow opens a closed window and sets highest z-index', () => {
  const initial: Record<string, WindowState> = {
    steam: createInitialWindowState('steam', 'Steam', 'gamepad'),
    settings: createInitialWindowState('settings', 'Settings', 'settings'),
  };

  const opened = openWindow(initial, 'steam');
  assert.equal(opened.steam.isOpen, true);
  assert.equal(opened.steam.isMinimized, false);
  assert.ok(opened.steam.zIndex > opened.settings.zIndex);
});

test('toggleMinimize flips minimized state', () => {
  let windows: Record<string, WindowState> = {
    steam: { ...createInitialWindowState('steam', 'Steam', 'gamepad'), isOpen: true },
  };

  windows = toggleMinimize(windows, 'steam');
  assert.equal(windows.steam.isMinimized, true);

  windows = toggleMinimize(windows, 'steam');
  assert.equal(windows.steam.isMinimized, false);
});

test('toggleMaximize flips maximized state', () => {
  let windows: Record<string, WindowState> = {
    steam: { ...createInitialWindowState('steam', 'Steam', 'gamepad'), isOpen: true },
  };

  windows = toggleMaximize(windows, 'steam');
  assert.equal(windows.steam.isMaximized, true);

  windows = toggleMaximize(windows, 'steam');
  assert.equal(windows.steam.isMaximized, false);
});

test('bringToFront un-minimizes and increments zIndex', () => {
  const windows: Record<string, WindowState> = {
    steam: { ...createInitialWindowState('steam', 'Steam', 'gamepad'), isOpen: true, zIndex: 10, isMinimized: true },
    ps: { ...createInitialWindowState('ps', 'PlayStation', 'playstation'), isOpen: true, zIndex: 15 },
  };

  const updated = bringToFront(windows, 'steam');
  assert.equal(updated.steam.isMinimized, false);
  assert.equal(updated.steam.zIndex, 16);
});

test('closeWindow resets open and maximized states', () => {
  const windows: Record<string, WindowState> = {
    steam: {
      ...createInitialWindowState('steam', 'Steam', 'gamepad'),
      isOpen: true,
      isMaximized: true,
      isMinimized: false,
    },
  };

  const closed = closeWindow(windows, 'steam');
  assert.equal(closed.steam.isOpen, false);
  assert.equal(closed.steam.isMaximized, false);
});

test('updateWindowPosition clamps coordinates to non-negative', () => {
  const windows: Record<string, WindowState> = {
    steam: createInitialWindowState('steam', 'Steam', 'gamepad'),
  };

  const moved = updateWindowPosition(windows, 'steam', -20, 100);
  assert.equal(moved.steam.x, 0);
  assert.equal(moved.steam.y, 100);
});
