"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[3783],{93704:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>a,contentTitle:()=>i,default:()=>p,frontMatter:()=>t,metadata:()=>c,toc:()=>d});var o=n(85893),s=n(3905);const t={sidebar_position:1},i="Manage Docs Versions",c={id:"tutorial-extras/manage-docs-versions",title:"Manage Docs Versions",description:"Docusaurus can manage multiple versions of your docs.",source:"@site/tutorial/tutorial-extras/manage-docs-versions.md",sourceDirName:"tutorial-extras",slug:"/tutorial-extras/manage-docs-versions",permalink:"/project-thrilltyper/tutorial/tutorial-extras/manage-docs-versions",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"docsSidebar",previous:{title:"Tutorial - Extras",permalink:"/project-thrilltyper/tutorial/category/tutorial---extras"},next:{title:"Translate your site",permalink:"/project-thrilltyper/tutorial/tutorial-extras/translate-your-site"}},a={},d=[{value:"Create a docs version",id:"create-a-docs-version",level:2},{value:"Add a Version Dropdown",id:"add-a-version-dropdown",level:2},{value:"Update an existing version",id:"update-an-existing-version",level:2}];function l(e){const r={code:"code",h1:"h1",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.ah)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.h1,{id:"manage-docs-versions",children:"Manage Docs Versions"}),"\n",(0,o.jsx)(r.p,{children:"Docusaurus can manage multiple versions of your docs."}),"\n",(0,o.jsx)(r.h2,{id:"create-a-docs-version",children:"Create a docs version"}),"\n",(0,o.jsx)(r.p,{children:"Release a version 1.0 of your project:"}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-bash",children:"npm run docusaurus docs:version 1.0\n"})}),"\n",(0,o.jsxs)(r.p,{children:["The ",(0,o.jsx)(r.code,{children:"docs"})," folder is copied into ",(0,o.jsx)(r.code,{children:"versioned_docs/version-1.0"})," and ",(0,o.jsx)(r.code,{children:"versions.json"})," is created."]}),"\n",(0,o.jsx)(r.p,{children:"Your docs now have 2 versions:"}),"\n",(0,o.jsxs)(r.ul,{children:["\n",(0,o.jsxs)(r.li,{children:[(0,o.jsx)(r.code,{children:"1.0"})," at ",(0,o.jsx)(r.code,{children:"http://localhost:3000/docs/"})," for the version 1.0 docs"]}),"\n",(0,o.jsxs)(r.li,{children:[(0,o.jsx)(r.code,{children:"current"})," at ",(0,o.jsx)(r.code,{children:"http://localhost:3000/docs/next/"})," for the ",(0,o.jsx)(r.strong,{children:"upcoming, unreleased docs"})]}),"\n"]}),"\n",(0,o.jsx)(r.h2,{id:"add-a-version-dropdown",children:"Add a Version Dropdown"}),"\n",(0,o.jsx)(r.p,{children:"To navigate seamlessly across versions, add a version dropdown."}),"\n",(0,o.jsxs)(r.p,{children:["Modify the ",(0,o.jsx)(r.code,{children:"docusaurus.config.js"})," file:"]}),"\n",(0,o.jsx)(r.pre,{children:(0,o.jsx)(r.code,{className:"language-js",metastring:'title="docusaurus.config.js"',children:"module.exports = {\n  themeConfig: {\n    navbar: {\n      items: [\n        // highlight-start\n        {\n          type: 'docsVersionDropdown',\n        },\n        // highlight-end\n      ],\n    },\n  },\n};\n"})}),"\n",(0,o.jsx)(r.p,{children:"The docs version dropdown appears in your navbar:"}),"\n",(0,o.jsx)(r.p,{children:(0,o.jsx)(r.img,{alt:"Docs Version Dropdown",src:n(11950).Z+"",width:"370",height:"302"})}),"\n",(0,o.jsx)(r.h2,{id:"update-an-existing-version",children:"Update an existing version"}),"\n",(0,o.jsx)(r.p,{children:"It is possible to edit versioned docs in their respective folder:"}),"\n",(0,o.jsxs)(r.ul,{children:["\n",(0,o.jsxs)(r.li,{children:[(0,o.jsx)(r.code,{children:"versioned_docs/version-1.0/hello.md"})," updates ",(0,o.jsx)(r.code,{children:"http://localhost:3000/docs/hello"})]}),"\n",(0,o.jsxs)(r.li,{children:[(0,o.jsx)(r.code,{children:"docs/hello.md"})," updates ",(0,o.jsx)(r.code,{children:"http://localhost:3000/docs/next/hello"})]}),"\n"]})]})}function p(e={}){const{wrapper:r}={...(0,s.ah)(),...e.components};return r?(0,o.jsx)(r,{...e,children:(0,o.jsx)(l,{...e})}):l(e)}},3905:(e,r,n)=>{n.d(r,{ah:()=>d});var o=n(67294);function s(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function t(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?t(Object(n),!0).forEach((function(r){s(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):t(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function c(e,r){if(null==e)return{};var n,o,s=function(e,r){if(null==e)return{};var n,o,s={},t=Object.keys(e);for(o=0;o<t.length;o++)n=t[o],r.indexOf(n)>=0||(s[n]=e[n]);return s}(e,r);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);for(o=0;o<t.length;o++)n=t[o],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var a=o.createContext({}),d=function(e){var r=o.useContext(a),n=r;return e&&(n="function"==typeof e?e(r):i(i({},r),e)),n},l={inlineCode:"code",wrapper:function(e){var r=e.children;return o.createElement(o.Fragment,{},r)}},p=o.forwardRef((function(e,r){var n=e.components,s=e.mdxType,t=e.originalType,a=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=d(n),h=s,j=u["".concat(a,".").concat(h)]||u[h]||l[h]||t;return n?o.createElement(j,i(i({ref:r},p),{},{components:n})):o.createElement(j,i({ref:r},p))}));p.displayName="MDXCreateElement"},11950:(e,r,n)=>{n.d(r,{Z:()=>o});const o=n.p+"assets/images/docsVersionDropdown-35e13cbe46c9923327f30a76a90bff3b.png"}}]);