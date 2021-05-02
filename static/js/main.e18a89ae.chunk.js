(this["webpackJsonpchord-sequencer-static"]=this["webpackJsonpchord-sequencer-static"]||[]).push([[0],{70:function(e,t,n){},85:function(e,t,n){"use strict";n.r(t);var r,a=n(3),c=n.n(a),i=n(7),s=n(9),o=n(0),u=n.n(o),l=n(15),f=n.n(l),h=(n(70),function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,125)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,i=t.getTTFB;n(e),r(e),a(e),c(e),i(e)}))}),b=n(1),j=n(2),O=n(112),d=n(11);!function(e){e.A="A",e.B="B",e.C="C",e.D="D",e.E="E",e.F="F",e.G="G"}(r||(r={}));var v,p=function(){function e(){Object(b.a)(this,e),this.letter=r.A,this.sharp=!1,this.octave=0}return Object(j.a)(e,[{key:"getNumber",value:function(){var e="CDEFGBA",t=2*e.indexOf(this.letter);return t/2>e.indexOf("B")&&(t-=1),t/2>e.indexOf("E")&&(t-=1),12*this.octave+t+(this.sharp?1:0)}},{key:"getFreq",value:function(){return 440*Math.pow(1.059463094359,this.getNumber()-49)}},{key:"offset",value:function(t){return e.fromNumber(this.getNumber()+t)}},{key:"toString",value:function(){return this.letter+(this.sharp?"#":"")+this.octave}}],[{key:"fromNumber",value:function(e){var t=[g("C"),g("C#"),g("D"),g("D#"),g("E"),g("F"),g("F#"),g("G"),g("G#"),g("A"),g("A#"),g("B")][e%12],n=Math.floor(e/12);return t.octave=n,t}}]),e}();function x(e){var t=Object(o.useRef)(null),n=[];for(var r in v)n.push(r);return n=n.filter((function(e){return isNaN(parseInt(e))})),Object(d.jsx)("select",{ref:t,onChange:function(){var n;return e.onChange(null===(n=t.current)||void 0===n?void 0:n.value)},children:n.map((function(t){return Object(d.jsx)("option",{value:t,selected:t===e.currentMode,children:t},t)}))})}function g(e){var t,n=e[0],r="#"===e[1];t=e[1]&&e[2]?parseInt(e[2]):r?0:parseInt(e[1]);var a=new p;return a.letter=n,a.octave=t,a.sharp=r,a}!function(e){e.Root="Root",e.Major="Major",e.Minor="Minor",e.Sus2="Sus2",e.Sus4="Sus4"}(v||(v={}));var m,S=function(e,t){return Array.from({length:t-e},(function(t,n){return n+e}))},C=u.a.memo((function(e){var t=Object(o.useRef)(null),n=e.startingNote.getNumber();return Object(d.jsx)(O.a,{container:!0,item:!0,justify:"center",children:Object(d.jsx)("select",{ref:t,onChange:function(){var n,r;return e.onChange(p.fromNumber(parseInt(null!==(n=null===(r=t.current)||void 0===r?void 0:r.value)&&void 0!==n?n:"A0")))},children:S(0,12).map((function(t){return Object(d.jsxs)("option",{value:n+t,children:[" ",e.startingNote.offset(t).toString()," "]},t)}))})})})),y=n(12),k=n(18),N=n(122),w=n(121),F=n(120),E=n(115);!function(e){e[e.Off=0]="Off",e[e.Normal=1]="Normal",e[e.Flat=2]="Flat",e[e.Sharp=3]="Sharp"}(m||(m={}));var M=function e(){Object(b.a)(this,e),this.seventh=m.Off,this.ninth=m.Off,this.eleventh=m.Off},R=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:g("C4"),n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:v.Major,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:new M;Object(b.a)(this,e),this.base=void 0,this.mode=void 0,this.extensions=void 0,this.base=t,this.mode=n,this.extensions=r}return Object(j.a)(e,[{key:"getArray",value:function(){var e,t,n=(e={},Object(k.a)(e,v.Major,[0,4,7]),Object(k.a)(e,v.Minor,[0,3,7]),Object(k.a)(e,v.Root,[0,7]),Object(k.a)(e,v.Sus2,[0,2,7]),Object(k.a)(e,v.Sus4,[0,5,7]),e),r=[],a=Object(y.a)(n[this.mode]);try{for(a.s();!(t=a.n()).done;){var c=t.value;r.push(this.base.offset(c).toString())}}catch(s){a.e(s)}finally{a.f()}function i(e){return[-1,0,1][[m.Flat,m.Normal,m.Sharp].indexOf(e)]}return console.log(this.extensions),this.extensions.seventh!==m.Off&&r.push(this.base.offset(10+i(this.extensions.seventh)).toString()),this.extensions.ninth!==m.Off&&r.push(this.base.offset(14+i(this.extensions.ninth)).toString()),this.extensions.eleventh!==m.Off&&r.push(this.base.offset(17+i(this.extensions.eleventh)).toString()),r}},{key:"isEqual",value:function(e){return JSON.stringify(this)===JSON.stringify(e)}}]),e}(),A=u.a.memo((function(e){var t=Object(o.useRef)(null),n=Object(o.useRef)(null),r=Object(o.useRef)(null),a=u.a.useCallback((function(a,c){if(!1!==c){if(null!==t.current&&null!==n.current&&null!==r.current){t.current.checked=!1,n.current.checked=!1,r.current.checked=!1,[t.current,n.current,r.current][a].checked=!0;var i=[m.Flat,m.Normal,m.Sharp][a];e.updateExtension(i)}}else e.updateExtension(m.Off)}),[e]);return Object(d.jsxs)(O.a,{container:!0,item:!0,direction:"row",justify:"space-between",wrap:"nowrap",alignItems:"center",children:[Object(d.jsx)(N.a,{style:{margin:0},control:Object(d.jsx)(w.a,{color:"secondary",inputRef:t,checked:e.extensionState===m.Flat,onChange:function(e){return a(0,e.target.checked)}}),label:"\u266d",labelPlacement:"top"}),Object(d.jsx)(N.a,{style:{margin:0},control:Object(d.jsx)(w.a,{color:"secondary",inputRef:n,checked:e.extensionState===m.Normal,onChange:function(e){return a(1,e.target.checked)}}),label:e.number,labelPlacement:"top"}),Object(d.jsx)(N.a,{style:{margin:0},control:Object(d.jsx)(w.a,{color:"secondary",inputRef:r,checked:e.extensionState===m.Sharp,onChange:function(e){return a(2,e.target.checked)}}),label:"\u266f",labelPlacement:"top"})]})})),I=u.a.memo((function(e){var t=Object(o.useState)(v.Major),n=Object(s.a)(t,2),r=n[0],a=n[1],c=Object(o.useState)(g("C4")),i=Object(s.a)(c,2),l=i[0],f=i[1],h=Object(o.useState)(m.Off),b=Object(s.a)(h,2),j=b[0],p=b[1],S=Object(o.useState)(m.Off),y=Object(s.a)(S,2),k=y[0],N=y[1],w=Object(o.useState)(m.Off),M=Object(s.a)(w,2),I=M[0],B=M[1],P=e.onChordChange,D=e.index;return u.a.useEffect((function(){var e=new R(l,r,{seventh:j,ninth:k,eleventh:I});P(e,D)}),[r,l,j,k,I,D]),Object(d.jsx)(F.a,{pt:1,children:Object(d.jsx)(E.a,{children:Object(d.jsxs)(O.a,{container:!0,item:!0,direction:"column",alignItems:"stretch",justify:"space-around",spacing:2,children:[Object(d.jsx)(C,{startingNote:g("C4"),onChange:f}),Object(d.jsx)(O.a,{container:!0,item:!0,justify:"center",children:Object(d.jsx)(x,{onChange:a,currentMode:r})}),Object(d.jsxs)(O.a,{container:!0,item:!0,direction:"column",alignItems:"center",children:[Object(d.jsx)(A,{number:7,extensionState:j,updateExtension:p}),Object(d.jsx)(A,{number:9,extensionState:k,updateExtension:N}),Object(d.jsx)(A,{number:11,extensionState:I,updateExtension:B})]})]})})})}),(function(e,t){return e.chord.isEqual(t.chord)&&e.active===t.active&&e.index===t.index&&e.onChordChange===t.onChordChange})),B=n(116),P=n(118),D=n(117),q=n(24);h();var G=new q.a(q.c,{volume:-15}).toDestination();function J(){var e=Object(o.useState)(4),t=Object(s.a)(e,2),n=t[0],r=t[1],a=Object(o.useRef)(),u=Object(o.useState)(Array(n).fill(new R)),l=Object(s.a)(u,2),f=l[0],h=l[1],b=Object(o.useCallback)((function(e){var t=parseInt(e.target.value);if(isNaN(t)&&(t=0),r(t),f.length>t)h(f.slice(0,t));else if(f.length<t){for(var n=f.slice();n.length<t;)n.push(new R);h(n)}}),[f]),j=Object(o.useCallback)((function(e){a.current&&a.current.dispose();var t=new q.b((function(t,n){G.triggerAttackRelease(e[n].getArray(),"8n",t+.1)}),S(0,n),"4n").start(0);a.current=t}),[n]),v=Object(o.useCallback)((function(e,t){var n=f.slice();n[t]=e,h(n),j(n)}),[f,j]),p=Object(o.useState)(120),x=Object(s.a)(p,2),g=(x[0],x[1]),m=Object(o.useCallback)((function(e){var t=parseInt(e.target.value);isNaN(t)&&(t=120),g(t),q.d.bpm.value=t}),[]),C=Object(o.useState)(!1),y=Object(s.a)(C,2),k=y[0],N=y[1];function w(){return(w=Object(i.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!1!==k){e.next=8;break}return e.next=3,q.e();case 3:N(!0),j(f),q.d.start("+0.1"),e.next=11;break;case 8:null===(t=a.current)||void 0===t||t.dispose(),q.d.stop(),N(!1);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(d.jsxs)(F.a,{children:[Object(d.jsx)(B.a,{variant:"contained",onClick:function(){return w.apply(this,arguments)},children:!1===k?"Start":"Stop"}),Object(d.jsx)(P.a,{type:"number",defaultValue:4,onBlur:b,label:"Note Count",InputProps:{inputProps:{min:0,max:30}}}),Object(d.jsx)(P.a,{type:"number",defaultValue:120,onBlur:m,label:"Tempo (BPM)"}),Object(d.jsx)(O.a,{container:!0,children:f.map((function(e,t){return Object(d.jsx)(I,{chord:e,index:t,onChordChange:v,active:!1},t)}))})]})}q.d.bpm.value=120,f.a.render(Object(d.jsxs)(u.a.StrictMode,{children:[Object(d.jsx)(D.a,{}),Object(d.jsx)(J,{})]}),document.getElementById("root"))}},[[85,1,2]]]);
//# sourceMappingURL=main.e18a89ae.chunk.js.map