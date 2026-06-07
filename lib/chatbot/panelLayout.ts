const BASE_PANEL_CLASS =
  "flex flex-col overflow-hidden rounded-2xl border border-line bg-page/95 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-[width,height,max-width,max-height] duration-200 ease-out";

const COLLAPSED_PANEL_CLASS =
  "max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] max-w-96 sm:max-h-[calc(100dvh-7rem)]";

const EXPANDED_PANEL_CLASS =
  "h-[80dvh] max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] max-w-[72rem] sm:h-[80dvh] sm:max-h-[80dvh] sm:w-[80vw]";

export function getChatbotPanelClassName(expanded: boolean) {
  return `${BASE_PANEL_CLASS} ${
    expanded ? EXPANDED_PANEL_CLASS : COLLAPSED_PANEL_CLASS
  }`;
}
