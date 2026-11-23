'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {canUseModule,visibleIds,canCreate}=require('../plan-access');
test('marketplace y chat básicos para GRATIS',()=>{
 assert.equal(canUseModule('market','free'),true);
 assert.equal(canUseModule('messages','free'),true);
 assert.equal(canUseModule('stats','free'),false);
 assert.equal(canUseModule('stats','pro'),true);
});
test('132 registros: 25 visibles y 107 ocultos',()=>{
 const rows=Array.from({length:132},(_,i)=>({id:i}));
 const view=visibleIds(rows,'free');
 assert.equal(view.items.length,25);
 assert.equal(view.hidden,107);
 assert.equal(view.total,132);
 assert.equal(visibleIds(rows,'pro').items.length,132);
});
test('creación bloqueada al llegar a 25',()=>{
 assert.equal(canCreate(24,'free'),true);
 assert.equal(canCreate(25,'free'),false);
 assert.equal(canCreate(132,'free'),false);
 assert.equal(canCreate(132,'criadero'),true);
});
