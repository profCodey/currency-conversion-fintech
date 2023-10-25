export function useDisableScroll() {
  return function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    document.body.style.height = "100vh";
    document.body.style.overflowY = "hidden";
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  };
}



export function useEnableScroll() {
  return function () {
    document.body.style.height = "100%";
    document.body.style.overflowY = "scroll";
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    window.onscroll = function () {};
  };
}
