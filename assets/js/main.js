/* sjmer.top — 极少量脚本。没有 JS 时页面依旧完整可用。 */
(function () {
  var root = document.documentElement;

  // 开场动画（≈2.4s）结束后移除 .intro，让幕布彻底退出、所有元素回到常态
  if (root.classList.contains('intro')) {
    window.setTimeout(function () {
      root.classList.remove('intro');
    }, 2600);
  }
})();
