(this["webpackJsonpbeer-local-client"]=this["webpackJsonpbeer-local-client"]||[]).push([[12],{1387:function(e,t,a){"use strict";var n=a(4),r=a.n(n),c=a(35),s=a.n(c),l=a(21),o=a.n(l),i=a(22),u=a.n(i),d=a(23),m=a.n(d),p=a(18),f=a.n(p),b=a(3),h=a.n(b),E=a(24),g=a.n(E),O=a(1),v=a.n(O),j=a(9),y=a.n(j),C=a(92),x=a.n(C),k=a(917),N=(a(7),a(0)),w=a.n(N),S=a(171),R=a(172),P=function(e){function t(){var e,a;o()(this,t);for(var n=arguments.length,r=new Array(n),c=0;c<n;c++)r[c]=arguments[c];return a=m()(this,(e=f()(t)).call.apply(e,[this].concat(r))),v()(h()(a),"ref",Object(N.createRef)()),v()(h()(a),"focus",(function(){return a.ref.current.focus()})),v()(h()(a),"handleChange",(function(e){var t=x()(e,"target.value");y()(a.props,"onChange",e,s()({},a.props,{value:t}))})),v()(h()(a),"handleInput",(function(e){var t=x()(e,"target.value");y()(a.props,"onInput",e,s()({},a.props,{value:t}))})),a}return g()(t,e),u()(t,[{key:"render",value:function(){var e=this.props,a=e.rows,n=e.value,c=Object(S.a)(t,this.props),s=Object(R.a)(t,this.props);return w.a.createElement(k.a,{innerRef:this.ref},w.a.createElement(s,r()({},c,{onChange:this.handleChange,onInput:this.handleInput,rows:a,value:n})))}}]),t}(N.Component);v()(P,"defaultProps",{as:"textarea",rows:3}),v()(P,"handledProps",["as","onChange","onInput","rows","value"]),P.propTypes={},t.a=P},1412:function(e,t,a){"use strict";var n=a(989),r=a.n(n),c=a(4),s=a.n(c),l=(a(69),a(56)),o=a.n(l),i=a(6),u=a.n(i),d=(a(7),a(0)),m=a.n(d),p=a(171),f=a(172),b=a(8),h=a(306);function E(e){var t=e.children,a=e.className,n=e.content,r=u()("date",a),c=Object(p.a)(E,e),l=Object(f.a)(E,e);return m.a.createElement(l,s()({},c,{className:r}),b.b.isNil(t)?n:t)}E.handledProps=["as","children","className","content"],E.propTypes={};var g=E,O=a(33);function v(e){var t=e.children,a=e.className,n=e.content,r=e.images,c=e.text,l=u()(Object(O.a)(r,"images"),Object(O.a)(n||c,"text"),"extra",a),i=Object(p.a)(v,e),d=Object(f.a)(v,e);if(!b.b.isNil(t))return m.a.createElement(d,s()({},i,{className:l}),t);var E=o()(r,(function(e,t){var a=[t,e].join("-");return Object(h.a)(e,{key:a})}));return m.a.createElement(d,s()({},i,{className:l}),n,E)}v.handledProps=["as","children","className","content","images","text"],v.propTypes={};var j=v,y=a(73);function C(e){var t=e.children,a=e.className,n=e.content,r=e.icon,c=u()("like",a),l=Object(p.a)(C,e),o=Object(f.a)(C,e);return b.b.isNil(t)?m.a.createElement(o,s()({},l,{className:c}),y.a.create(r,{autoGenerateKey:!1}),n):m.a.createElement(o,s()({},l,{className:c}),t)}C.handledProps=["as","children","className","content","icon"],C.defaultProps={as:"a"},C.propTypes={};var x=C;function k(e){var t=e.children,a=e.className,n=e.content,r=e.like,c=u()("meta",a),l=Object(p.a)(k,e),o=Object(f.a)(k,e);return b.b.isNil(t)?m.a.createElement(o,s()({},l,{className:c}),Object(h.e)(x,(function(e){return{content:e}}),r,{autoGenerateKey:!1}),n):m.a.createElement(o,s()({},l,{className:c}),t)}k.handledProps=["as","children","className","content","like"],k.propTypes={};var N=k;function w(e){var t=e.children,a=e.className,n=e.content,r=u()("user",a),c=Object(p.a)(w,e),l=Object(f.a)(w,e);return m.a.createElement(l,s()({},c,{className:r}),b.b.isNil(t)?n:t)}w.handledProps=["as","children","className","content"],w.propTypes={},w.defaultProps={as:"a"};var S=w;function R(e){var t=e.children,a=e.className,n=e.content,r=e.date,c=e.user,l=u()("summary",a),o=Object(p.a)(R,e),i=Object(f.a)(R,e);return b.b.isNil(t)?m.a.createElement(i,s()({},o,{className:l}),Object(h.e)(S,(function(e){return{content:e}}),c,{autoGenerateKey:!1}),n&&" ",n,n&&" ",Object(h.e)(g,(function(e){return{content:e}}),r,{autoGenerateKey:!1})):m.a.createElement(i,s()({},o,{className:l}),t)}R.handledProps=["as","children","className","content","date","user"],R.propTypes={};var P=R;function I(e){var t=e.children,a=e.className,n=e.content,r=e.extraImages,c=e.extraText,l=e.date,o=e.meta,i=e.summary,d=u()("content",a),E=Object(p.a)(I,e),O=Object(f.a)(I,e);return b.b.isNil(t)?m.a.createElement(O,s()({},E,{className:d}),Object(h.e)(g,(function(e){return{content:e}}),l,{autoGenerateKey:!1}),Object(h.e)(P,(function(e){return{content:e}}),i,{autoGenerateKey:!1}),n,Object(h.e)(j,(function(e){return{text:!0,content:e}}),c,{autoGenerateKey:!1}),Object(h.e)(j,(function(e){return{images:e}}),r,{autoGenerateKey:!1}),Object(h.e)(N,(function(e){return{content:e}}),o,{autoGenerateKey:!1})):m.a.createElement(O,s()({},E,{className:d}),t)}I.handledProps=["as","children","className","content","date","extraImages","extraText","meta","summary"],I.propTypes={};var T=I;function D(e){var t=e.children,a=e.className,n=e.content,r=e.icon,c=e.image,l=u()("label",a),o=Object(p.a)(D,e),i=Object(f.a)(D,e);return b.b.isNil(t)?m.a.createElement(i,s()({},o,{className:l}),n,y.a.create(r,{autoGenerateKey:!1}),Object(h.a)(c)):m.a.createElement(i,s()({},o,{className:l}),t)}D.handledProps=["as","children","className","content","icon","image"],D.propTypes={};var _=D;function H(e){var t=e.content,a=e.children,n=e.className,r=e.date,c=e.extraImages,l=e.extraText,o=e.image,i=e.icon,d=e.meta,b=e.summary,E=u()("event",n),g=Object(p.a)(H,e),O=Object(f.a)(H,e),v=t||r||c||l||d||b,j={content:t,date:r,extraImages:c,extraText:l,meta:d,summary:b};return m.a.createElement(O,s()({},g,{className:E}),Object(h.e)(_,(function(e){return{icon:e}}),i,{autoGenerateKey:!1}),Object(h.e)(_,(function(e){return{image:e}}),o,{autoGenerateKey:!1}),v&&m.a.createElement(T,j),a)}H.handledProps=["as","children","className","content","date","extraImages","extraText","icon","image","meta","summary"],H.propTypes={};var Q=H;function A(e){var t=e.children,a=e.className,n=e.events,c=e.size,l=u()("ui",c,"feed",a),i=Object(p.a)(A,e),d=Object(f.a)(A,e);if(!b.b.isNil(t))return m.a.createElement(d,s()({},i,{className:l}),t);var h=o()(n,(function(e){var t=e.childKey,a=e.date,n=e.meta,c=e.summary,l=r()(e,["childKey","date","meta","summary"]),o=t||[a,n,c].join("-");return m.a.createElement(Q,s()({date:a,key:o,meta:n,summary:c},l))}));return m.a.createElement(d,s()({},i,{className:l}),h)}A.handledProps=["as","children","className","events","size"],A.propTypes={},A.Content=T,A.Date=g,A.Event=Q,A.Extra=j,A.Label=_,A.Like=x,A.Meta=N,A.Summary=P,A.User=S;t.a=A},1432:function(e,t,a){"use strict";a.r(t);var n=a(13),r=a.n(n),c=a(100),s=a(110),l=a(36),o=a(68),i=a(0),u=a.n(i),d=a(30),m=a(43),p=a(130),f=a(928),b=a(929),h=a(29),E=a(924),g=a(925),O=a(1414),v=a(920),j=a(922),y=a(1387),C=a(319),x=a(129),k=a(177),N=a(178),w=a(128),S="beerlocal/OrderPage/FETCH_ORDER",R="beerlocal/OrderPage/FETCH_ORDER_SUCCESS",P="beerlocal/OrderPage/FETCH_ORDER_ERROR",I="beerlocal/OrderPage/EDIT_ORDER",T="beerlocal/OrderPage/EDIT_ORDER_SUCCESS",D="beerlocal/OrderPage/EDIT_ORDER_ERROR",_="beerlocal/OrderPage/CLEAR_ORDER",H="beerlocal/OrderPage/SEND_MESSAGE",Q="beerlocal/OrderPage/SEND_MESSAGE_SUCCESS",A="beerlocal/OrderPage/SEND_MESSAGE_ERROR",G={fetchingOrder:!1,fetchOrderError:!1,editingOrder:!1,editingOrderError:!1,order:!1,sendingMessage:!1,sendingMessageError:!1},M=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:G,t=arguments.length>1?arguments[1]:void 0;return Object(w.a)(e,(function(e){switch(t.type){default:break;case S:e.fetchOrderError=!1,e.fetchingOrder=!0;break;case R:t.order&&(e.order=t.order,e.fetchOrderError=!1),e.fetchingOrder=!1;break;case P:e.fetchOrderError=!0,e.fetchingOrder=!1;break;case I:e.editOrderError=!1,e.editingOrder=!0;break;case T:t.order&&(e.order=t.order,e.editOrderError=!1),e.editingOrder=!1;break;case D:e.editOrderError=!0,e.editingOrder=!1;break;case H:e.sendingMessageError=!1,e.sendingMessage=!0;break;case Q:t.order&&(e.order=t.order,e.sendingMessageError=!1),e.sendingMessage=!1;break;case A:e.sendingMessageError=!0,e.sendingMessage=!1;break;case _:e.order=!1}}))},z=a(16);var K=a(91),F=r.a.mark(J),L=r.a.mark(W),q=r.a.mark(X),U=r.a.mark(Z),Y=r.a.mark($),V=r.a.mark(ee),B=r.a.mark(te);function J(e){var t,a,n,c,s;return r.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t=e.pathName,r.prev=1,a=t.split("/")[2],r.next=5,Object(z.a)(K.a);case 5:return n=r.sent,c=function(){return n.get("/orders/".concat(a))},r.next=9,Object(z.a)(c);case 9:if(s=r.sent,console.log("ORDER RETRIEVED",s.data),!s.data){r.next=14;break}return r.next=14,Object(z.c)((o=s.data,{type:R,order:o}));case 14:r.next=20;break;case 16:return r.prev=16,r.t0=r.catch(1),r.next=20,Object(z.c)((l=r.t0,{type:P,error:l}));case 20:case"end":return r.stop()}var l,o}),F,null,[[1,16]])}function W(e){var t,a,n,c;return r.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t=e.editObj,r.prev=1,r.next=4,Object(z.a)(K.a);case 4:return a=r.sent,n=function(){return a.patch("/orders/".concat(t._id),Object(l.a)({},t))},r.next=8,Object(z.a)(n);case 8:if(c=r.sent,console.log("ORDER EDITED",c.data),!c.data){r.next=13;break}return r.next=13,Object(z.c)((o=c.data,{type:T,order:o}));case 13:r.next=19;break;case 15:return r.prev=15,r.t0=r.catch(1),r.next=19,Object(z.c)((s=r.t0,{type:D,error:s}));case 19:case"end":return r.stop()}var s,o}),L,null,[[1,15]])}function X(e){var t,a,n,c;return r.a.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t=e.messageContent,r.prev=1,r.next=4,Object(z.a)(K.a);case 4:return a=r.sent,n=function(){return a.post("/orders/".concat(t._id,"/message"),{content:t.content})},r.next=8,Object(z.a)(n);case 8:if(c=r.sent,console.log("MESSAGE SENT",c.data),!c.data){r.next=13;break}return r.next=13,Object(z.c)((l=c.data,{type:Q,order:l}));case 13:r.next=19;break;case 15:return r.prev=15,r.t0=r.catch(1),r.next=19,Object(z.c)((s=r.t0,{type:A,error:s}));case 19:case"end":return r.stop()}var s,l}),q,null,[[1,15]])}function Z(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(z.b)(2e3,S,J);case 2:case"end":return e.stop()}}),U)}function $(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(z.b)(2e3,I,W);case 2:case"end":return e.stop()}}),Y)}function ee(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(z.b)(2e3,H,X);case 2:case"end":return e.stop()}}),V)}function te(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(z.d)(Z);case 2:return e.next=4,Object(z.d)($);case 4:return e.next=6,Object(z.d)(ee);case 6:case"end":return e.stop()}}),B)}var ae=a(314),ne=a(87),re=function(e){return e.OrderPage||G},ce=a(958),se=a(1412),le=a(323),oe=a(45),ie=a(46);function ue(){var e=Object(oe.a)(["\n  max-height: 200px;\n  overflow-y: scroll;\n"]);return ue=function(){return e},e}var de=ie.b.div(ue());var me=function(e){var t=e.messages,a=e.user,n=e.business,r=e.businessAvatar;return t&&t.length?u.a.createElement(E.a,{className:"message-feed"},u.a.createElement(de,null,u.a.createElement(se.a,{size:"small"},t.map((function(e){return u.a.createElement(se.a.Event,{key:e._id},u.a.createElement(se.a.Label,null,u.a.createElement("img",{alt:"business avatar",src:e.author===a.sub?a.avatarSource:r||"/images/avatars/blank-avatar.webp"})),u.a.createElement(se.a.Content,null,u.a.createElement(se.a.Summary,null,e.author===a.sub?a.primaryContactName:n.primaryContactName," (",u.a.createElement(se.a.User,null,e.author===a.sub?a.businessName:n.businessName),")",u.a.createElement(se.a.Date,null,le.a.format(Date.parse(e.createdAt)))),u.a.createElement(se.a.Extra,{text:!0},e.content)))}))))):null},pe=a(167);function fe(){var e=Object(oe.a)(["\n  height: 100%;\n  width: 100%;\n\n  .leaflet-container {\n    width: 100%;\n    height: 100%;\n    min-height: 200px;\n    display: block;\n    z-index: 1;\n  }\n"]);return fe=function(){return e},e}var be=ie.b.div(fe()),he=a(234);function Ee(){var e=Object(oe.a)(["\n  margin: 1em 0;\n  display: flex;\n  height: 6.5em;\n\n  textarea {\n    flex-grow: 4;\n    resize: none;\n    padding: 1em;\n    border-radius: 4.5px 0 0 4.5px;\n    border: 1px solid rgba(34,36,38,.15);\n    border-right: 0;\n  }\n\n  textarea:focus {\n    outline: none;\n    border-color: #85b7d9;\n  }\n\n  div.primary.right.attached.button {\n    display: flex;\n    align-items: center;\n    padding: 11px 20px;\n  }\n"]);return Ee=function(){return e},e}var ge=ie.b.div(Ee()),Oe=a(53),ve=Object(h.b)({orderInfo:Object(h.a)(re,(function(e){return e.order})),userProfile:Object(ne.e)(),orderEditing:Object(h.a)(re,(function(e){return e.editingOrder})),messageSending:Object(h.a)(re,(function(e){return e.sendingMessage}))});var je=Object(d.c)(ve,(function(e,t){var a=t.location;return{orderFetch:function(){return e((t=a.pathname,{type:S,pathName:t}));var t},orderEdit:function(t){return e(function(e){return{type:I,editObj:e}}(t))},orderClear:function(){return e({type:_})},messageSend:function(t){return e(function(e){return{type:H,messageContent:e}}(t))}}}));t.default=Object(m.d)(je)((function(e){var t=e.orderInfo,a=e.orderFetch,n=e.orderClear,d=e.userProfile,m=e.orderEdit,h=e.orderEditing,w=e.messageSend,S=e.messageSending;Object(k.a)({key:"OrderPage",reducer:M}),Object(N.a)({key:"OrderPage",saga:te});var R=Object(p.b)().isAuthenticated;Object(i.useEffect)((function(){return R&&a(),function(){n()}}),[R,a,n]),console.log("ORDER",t);var P=d.role,I=Object(i.useState)(!1),T=Object(o.a)(I,2),D=T[0],_=T[1],H=Object(i.useState)(Object(l.a)({},t.order)),Q=Object(o.a)(H,2),A=Q[0],G=Q[1],z=Object(i.useState)([]),F=Object(o.a)(z,2),L=F[0],q=F[1],U=Object(i.useState)([]),Y=Object(o.a)(U,2),V=Y[0],B=Y[1],J=Object(i.useState)(""),W=Object(o.a)(J,2),X=W[0],Z=W[1];Object(i.useEffect)((function(){t.order&&t.order.items&&(G(Object(l.a)({},t.order)),q(Object(s.a)(t.order.items)))}),[t]),Object(i.useEffect)((function(){if(d&&d.stock&&L.length){var e=L.map((function(e){return e.id}));B(d.stock.filter((function(t){return"Show"===t.display&&!e.includes(t.id)})).map((function(e){return Object(l.a)(Object(l.a)({},e),{},{value:e.id,label:"".concat(e.name," ").concat(e.packSize," ").concat(e.availability)})})))}}),[d,d.stock,L]),Object(i.useEffect)((function(){A&&function(){var e=Object(c.a)(r.a.mark((function e(){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(K.a)();case 2:t=e.sent,"producer"===P&&A.producerNotification?t.patch("/orders/".concat(A._id),{producerNotification:!1}):"retailer"===P&&A.retailerNotification&&t.patch("/orders/".concat(A._id),{retailerNotification:!1});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[A,P]);var $=function(){var e=Object(c.a)(r.a.mark((function e(){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t={_id:A._id,status:"Confirmed"===A.status?"Pending":"Confirmed"},m(t);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ee=function(){var e=Object(c.a)(r.a.mark((function e(){var t,a;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=L.filter((function(e){return"delete"!==e.orderChange})).map((function(e){return Object(l.a)(Object(l.a)({},e),{},{orderChange:""})})),a={_id:A._id,status:"Pending",items:t},m(a);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),ne=function(){var e=Object(c.a)(r.a.mark((function e(){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t={_id:A._id,status:"Rejected"===A.status?"Pending":"Rejected"},m(t);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),re=function(){var e=Object(c.a)(r.a.mark((function e(){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t={_id:A._id,status:"Cancelled"},m(t);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),se=function(){var e=Object(c.a)(r.a.mark((function e(){var t;return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t={_id:A._id,status:"Changes pending",items:Object(s.a)(L)},m(t),_(!1);case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),le=function(){var e=Object(c.a)(r.a.mark((function e(){return r.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:w({_id:A._id,content:X}),Z("");case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return t.business&&L&&Object.keys(A).length?(console.log("ITEMS",L),u.a.createElement(u.a.Fragment,null,u.a.createElement(C.Helmet,null,u.a.createElement("title",null,"beerLocal - Order Info"),u.a.createElement("meta",{name:"description",content:"Your order"})),u.a.createElement(ae.a,null,u.a.createElement(E.a,{basic:!0,className:"primary wrapper"},u.a.createElement(g.a,{as:"h1"},"Order #SO-".concat(A.orderNumber.toString().padStart(6,"0")," from ").concat(t.business.businessName)),("Cancelled"===A.status||"Rejected"===A.status)&&u.a.createElement(O.a,{negative:!0},u.a.createElement(O.a.Header,null,"This order has been ".concat(A.status.toLowerCase(),".")),u.a.createElement("p",null,"If this is a mistake, please contact us"," ",u.a.createElement(x.a,{to:"/"},"here"),".")),"Confirmed"===A.status&&"retailer"===P&&u.a.createElement(O.a,{info:!0},u.a.createElement(O.a.Header,null,"Your order has been confirmed!")),"Changes pending"===A.status&&"retailer"===P&&u.a.createElement(O.a,{warning:!0},u.a.createElement(O.a.Header,null,"Your order has changes pending."),u.a.createElement("p",null,"Please approve the changes or cancel the order.")),"Changes pending"===A.status&&"producer"===P&&u.a.createElement(O.a,null,u.a.createElement(O.a.Header,null,"Awaiting approval for order changes from the customer.")),"Pending"===A.status&&"retailer"===P&&u.a.createElement(O.a,null,u.a.createElement(O.a.Header,null,"Awaiting order confirmation from the brewery.")),("Pending"===A.status||"Confirmed"===A.status)&&"producer"===P&&t.business.deliveryInstruction&&u.a.createElement(O.a,{warning:!0},u.a.createElement(O.a.Header,null,"This customer has specific requirements for delivery."),u.a.createElement("p",null,t.business.deliveryInstruction)),u.a.createElement(v.a.Group,null,u.a.createElement(pe.a,{role:P,perform:"orders:confirm",yes:function(){return("Pending"===A.status||"Confirmed"===A.status)&&u.a.createElement(v.a,{onClick:$,loading:h,basic:"Confirmed"!==A.status,color:"green",icon:"check",content:"Confirmed"!==A.status?"Confirm order":"Confirmed - click again to undo"})}}),u.a.createElement(pe.a,{role:P,perform:"orders:changes-confirm",yes:function(){return"Changes pending"===A.status&&u.a.createElement(v.a,{onClick:ee,loading:h,color:"green",icon:"check",content:"Approve changes"})}}),u.a.createElement(pe.a,{role:P,perform:"orders:reject",yes:function(){return("Changes pending"===A.status||"Pending"===A.status||"Rejected"===A.status)&&u.a.createElement(v.a,{onClick:ne,loading:h,basic:"Rejected"!==A.status,color:"red",icon:"ban",content:"Rejected"!==A.status?"Reject order":"Rejected - click again to undo"})}}),u.a.createElement(pe.a,{role:P,perform:"orders:cancel",yes:function(){return("Changes pending"===A.status||"Pending"===A.status)&&u.a.createElement(v.a,{onClick:re,loading:h,basic:"Cancelled"!==A.status,color:"red",icon:"close",content:"Cancelled"!==A.status?"Cancel order":"Cancelled - click again to undo"})}})),u.a.createElement(E.a,{basic:!0},u.a.createElement(j.a,{columns:2},u.a.createElement(j.a.Row,null,u.a.createElement(j.a.Column,null,u.a.createElement("p",null,t.business.businessName),t.business.address.split(",").map((function(e){return u.a.createElement("p",{key:e},e)}))),u.a.createElement(j.a.Column,null,u.a.createElement(be,null,u.a.createElement(f.a,{className:"profileViewMap",center:t.business.location,zoom:12,zoomControl:!1},u.a.createElement(b.a,{url:Oe.g}),u.a.createElement(he.a,{type:"customer",location:t.business.location,name:t.business.businessName}))))))),u.a.createElement(ce.a,{editingOrder:D,orderItems:L,availableStock:V,handleAddItem:function(e){var t=e;delete t.label,delete t.value,t.orderChange="add",t.orderQuant=1,q([].concat(Object(s.a)(L),[t]))},handleDeleteItem:function(e){q(L.map((function(t){return t.id===e&&"delete"===t.orderChange?Object(l.a)(Object(l.a)({},t),{},{orderChange:""}):t.id===e?Object(l.a)(Object(l.a)({},t),{},{orderChange:"delete"}):t})))},handleDecreaseQuant:function(e){var t=L.map((function(t){if(t.id===e&&t.orderQuant>1){var a=Object(l.a)(Object(l.a)({},t),{},{orderQuant:t.orderQuant-1}),n=A.items.filter((function(t){return t.id===e}))[0];return"add"!==t.orderChange&&(n&&a.orderQuant<n.orderQuant?a.orderChange="decrease":delete a.orderChange),a}return t}));q(t)},handleIncreaseQuant:function(e){var t=L.map((function(t){if(t.id===e){var a=Object(l.a)(Object(l.a)({},t),{},{orderQuant:t.orderQuant+1}),n=A.items.filter((function(t){return t.id===e}))[0];return"add"!==t.orderChange&&(n&&a.orderQuant>n.orderQuant?a.orderChange="increase":delete a.orderChange),a}return t}));q(t)},businessName:t.business.businessName,type:"orderInfo"}),u.a.createElement("br",null),D?u.a.createElement(v.a.Group,null,u.a.createElement(v.a,{content:"Cancel",onClick:function(){q(Object(s.a)(t.order.items)),_(!1)}}),u.a.createElement(v.a,{content:"Save",primary:!0,onClick:se})):u.a.createElement(pe.a,{role:P,perform:"orders:edit",yes:function(){return"Cancelled"!==A.status&&"Rejected"!==A.status&&u.a.createElement(v.a,{primary:!0,content:"Edit",size:"large",onClick:function(){return _(!0)}})}}),u.a.createElement(me,{messages:A.messages,user:d,business:t.business,businessAvatar:t.image}),u.a.createElement(ge,null,u.a.createElement(y.a,{maxLength:Oe.j,value:X,onChange:function(e){return Z(e.target.value)},placeholder:"Write your message to ".concat(t.business.primaryContactName," at ").concat(t.business.businessName,"...")}),u.a.createElement(v.a,{attached:"right",primary:!0,content:"Send",onClick:le,loading:S})),!!X.length&&u.a.createElement("p",{style:{textAlign:"right",fontSize:"10px"}},X.length,"/",Oe.j))))):(console.log(!t.business,!L,!Object.keys(A).length),null)}))},958:function(e,t,a){"use strict";var n=a(68),r=a(0),c=a.n(r),s=a(1431),l=a(925),o=a(919),i=a(920),u=a(922),d=a(1414),m=a(938),p=a(955),f=a(53),b=a(45);function h(){var e=Object(b.a)(["\n  .quantity-buttons {\n    margin-left: 10px;\n\n    button.primary.button {\n      width: 30px;\n      padding: 7.5px 0;\n    }\n  }\n"]);return h=function(){return e},e}var E=a(46).b.div(h());var g=function(e){var t=e.orderLine,a=e.editingOrder,n=e.handleDeleteItem,r=e.handleDecreaseQuant,s=e.handleIncreaseQuant;return t?c.a.createElement(o.a.Row,{positive:"add"===t.orderChange,key:t.id},c.a.createElement(o.a.Cell,{disabled:"delete"===t.orderChange},t.name),c.a.createElement(o.a.Cell,{disabled:"delete"===t.orderChange},c.a.createElement(m.a,{displayType:"text",decimalScale:1,fixedDecimalScale:!0,suffix:"%",value:t.abv})),c.a.createElement(o.a.Cell,{disabled:"delete"===t.orderChange},f.k[t.packSize]),c.a.createElement(o.a.Cell,{disabled:"delete"===t.orderChange},c.a.createElement(m.a,{displayType:"text",thousandSeparator:!0,decimalScale:2,fixedDecimalScale:!0,prefix:"\xa3",value:t.price})),c.a.createElement(o.a.Cell,{disabled:"delete"===t.orderChange,positive:"increase"===t.orderChange,negative:"decrease"===t.orderChange},c.a.createElement(E,null,c.a.createElement("span",null,t.orderQuant),a&&c.a.createElement(i.a.Group,{className:"quantity-buttons",size:"mini",compact:!0},c.a.createElement(i.a,{primary:!0,basic:!0,icon:"minus",onClick:function(){return r(t.id)},title:"Decrease quantity"}),c.a.createElement(i.a,{primary:!0,basic:!0,icon:"plus",onClick:function(){return s(t.id)},title:"Increase quantity"})))),c.a.createElement(o.a.Cell,{disabled:"delete"===t.orderChange},c.a.createElement(m.a,{displayType:"text",thousandSeparator:!0,decimalScale:2,fixedDecimalScale:!0,prefix:"\xa3",value:t.price*t.orderQuant})),a&&c.a.createElement(o.a.Cell,{textAlign:"center"},c.a.createElement(i.a,{color:"red",size:"mini",icon:"close",title:"Cancel item",onClick:function(){return n(t.id)}}))):null};t.a=function(e){var t=e.editingOrder,a=e.businessName,f=e.orderItems,b=e.distancePurchase,h=e.deliveryInstruction,E=e.distantPurchasingConditions,O=e.distantPurchasingMinimumMet,v=e.availableStock,j=e.handleAddItem,y=e.handleDeleteItem,C=e.handleDecreaseQuant,x=e.handleIncreaseQuant,k=e.type,N=Object(r.useState)({}),w=Object(n.a)(N,2),S=w[0],R=w[1],P=Object(r.useState)(!1),I=Object(n.a)(P,2),T=I[0],D=I[1];return f?c.a.createElement(s.a.Content,{style:{overflowX:"scroll"}},"draftOrder"===k&&c.a.createElement(c.a.Fragment,null,c.a.createElement(l.a,{as:"h5"},"Your order from ".concat(a)),c.a.createElement("p",null,"This is the contents of your order. Click below to confirm, or cancel to go back.")),c.a.createElement(o.a,{celled:!0,unstackable:!0,style:{minWidth:"600px"}},c.a.createElement(o.a.Header,null,c.a.createElement(o.a.Row,null,c.a.createElement(o.a.HeaderCell,null,"Name"),c.a.createElement(o.a.HeaderCell,null,"ABV"),c.a.createElement(o.a.HeaderCell,null,"Pack Size"),c.a.createElement(o.a.HeaderCell,null,"List Price"),c.a.createElement(o.a.HeaderCell,null,"Order #"),c.a.createElement(o.a.HeaderCell,null,"Total"),t&&c.a.createElement(o.a.HeaderCell,null))),c.a.createElement(o.a.Body,null,f.filter((function(e){return e.orderQuant})).map((function(e){return c.a.createElement(c.a.Fragment,{key:e.id},c.a.createElement(g,{orderLine:e,editingOrder:t,handleDeleteItem:y,handleDecreaseQuant:C,handleIncreaseQuant:x}))}))),c.a.createElement(o.a.Footer,null,t&&!T&&c.a.createElement(o.a.Row,null,c.a.createElement(o.a.HeaderCell,{colSpan:"16"},c.a.createElement(i.a,{attached:!0,basic:!0,icon:"plus",content:"Add item",onClick:function(){return D(!0)}}))),t&&T&&c.a.createElement(o.a.Row,null,c.a.createElement(o.a.HeaderCell,{colSpan:"7"},c.a.createElement(u.a,{columns:2},c.a.createElement(u.a.Column,{width:12},c.a.createElement(p.a,{options:v,onChange:function(e){R(e)},placeholder:"Select item"})),c.a.createElement(u.a.Column,{width:4},c.a.createElement(i.a,{icon:"add",primary:!0,fluid:!0,content:"Add",onClick:function(){j(S),D(!1)}}))))),c.a.createElement(o.a.Row,null,c.a.createElement(o.a.HeaderCell,{colSpan:t?6:5,textAlign:"right"},"Estimated Total:"),c.a.createElement(o.a.HeaderCell,null,c.a.createElement(m.a,{displayType:"text",thousandSeparator:!0,decimalScale:2,fixedDecimalScale:!0,prefix:"\xa3",value:f.reduce((function(e,t){return e+="delete"!==t.orderChange&&t.price*t.orderQuant}),0)}))))),b&&!O&&c.a.createElement(d.a,{warning:!0},c.a.createElement(d.a.Header,null,"You are outside this brewery's distribution area"),c.a.createElement("p",null,"To process your order, you must spent at least \xa3",Number(E.minSpend).toFixed(2),".")),h&&c.a.createElement(d.a,{info:!0},c.a.createElement(d.a.Header,null,"The following delivery instructions will be passed along with your order:"),c.a.createElement("p",null,h))):null}},989:function(e,t,a){var n=a(964);e.exports=function(e,t){if(null==e)return{};var a,r,c=n(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)a=s[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(c[a]=e[a])}return c}}}]);
//# sourceMappingURL=12.d61133c1.chunk.js.map