export interface NavigationSafeArea {
  navTopPx: number;
  navHeightPx: number;
  capsuleReservePx: number;
}

interface MenuButtonRect {
  top: number;
  height: number;
  width: number;
  right: number;
}

export function getNavigationSafeArea(): NavigationSafeArea {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const wechatUni = uni as unknown as {
      getMenuButtonBoundingClientRect?: () => MenuButtonRect;
    };
    const menuButtonRect = wechatUni.getMenuButtonBoundingClientRect?.();

    if (menuButtonRect) {
      return {
        navTopPx: menuButtonRect.top,
        navHeightPx: menuButtonRect.height,
        capsuleReservePx: Math.max(systemInfo.windowWidth - menuButtonRect.right + menuButtonRect.width + 12, 118)
      };
    }

    return {
      navTopPx: (systemInfo.statusBarHeight ?? 0) + 8,
      navHeightPx: 40,
      capsuleReservePx: 24
    };
  } catch {
    return {
      navTopPx: 24,
      navHeightPx: 40,
      capsuleReservePx: 24
    };
  }
}
