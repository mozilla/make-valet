function onResize( e ) {
  var iframeWrapper = document.querySelector( ".embed-wrapper" ),
      iframeContainer = document.querySelector( ".embed-container" ),
      margin = 26,
      controls = 41,
      marginOffset = margin * 2;

  iframeWrapper.style.width = ( iframeContainer.clientWidth - marginOffset ) + "px";
  iframeWrapper.style.margin = margin + "px " + margin + "px";
  // If the current screen size does not fit the aspect ratios height,
  // we need to shrink the height to fit, thus shrink the width.
  if ( iframeContainer.clientHeight < iframeWrapper.offsetHeight + marginOffset ) {
    iframeWrapper.style.margin = margin + "px auto";
    iframeWrapper.style.width = ( 16 / 9 * ( iframeContainer.clientHeight - marginOffset - controls ) ) + "px";
  }
}  

window.addEventListener( "resize", onResize, false );
// Get the initial sizes setup.
document.addEventListener( "DOMContentLoaded", onResize, false );

