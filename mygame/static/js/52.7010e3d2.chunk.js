(this.webpackJsonpmygame=this.webpackJsonpmygame||[]).push([[52],{108:function(t,e,n){"use strict";n.r(e),n.d(e,"KEYBOARD_DID_CLOSE",(function(){return r})),n.d(e,"KEYBOARD_DID_OPEN",(function(){return i})),n.d(e,"copyVisualViewport",(function(){return D})),n.d(e,"keyboardDidClose",(function(){return b})),n.d(e,"keyboardDidOpen",(function(){return p})),n.d(e,"keyboardDidResize",(function(){return g})),n.d(e,"resetKeyboardAssist",(function(){return a})),n.d(e,"setKeyboardClose",(function(){return h})),n.d(e,"setKeyboardOpen",(function(){return c})),n.d(e,"startKeyboardAssist",(function(){return s})),n.d(e,"trackViewportChanges",(function(){return v}));var i="ionKeyboardDidShow",r="ionKeyboardDidHide",o={},u={},d=!1,a=function(){o={},u={},d=!1},s=function(t){f(t),t.visualViewport&&(u=D(t.visualViewport),t.visualViewport.onresize=function(){v(t),p()||g(t)?c(t):b(t)&&h(t)})},f=function(t){t.addEventListener("keyboardDidShow",(function(e){return c(t,e)})),t.addEventListener("keyboardDidHide",(function(){return h(t)}))},c=function(t,e){w(t,e),d=!0},h=function(t){y(t),d=!1},p=function(){var t=(o.height-u.height)*u.scale;return!d&&o.width===u.width&&t>150},g=function(t){return d&&!b(t)},b=function(t){return d&&u.height===t.innerHeight},w=function(t,e){var n=e?e.keyboardHeight:t.innerHeight-u.height,r=new CustomEvent(i,{detail:{keyboardHeight:n}});t.dispatchEvent(r)},y=function(t){var e=new CustomEvent(r);t.dispatchEvent(e)},v=function(t){o=Object.assign({},u),u=D(t.visualViewport)},D=function(t){return{width:Math.round(t.width),height:Math.round(t.height),offsetTop:t.offsetTop,offsetLeft:t.offsetLeft,pageTop:t.pageTop,pageLeft:t.pageLeft,scale:t.scale}}}}]);
//# sourceMappingURL=52.7010e3d2.chunk.js.map