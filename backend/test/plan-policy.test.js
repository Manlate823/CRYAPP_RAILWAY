'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {PLANS,trialEnd,effectivePlan,visibility} = require('../plan-policy');

test('precios aprobados',()=>{
 assert.equal(PLANS.pro.monthlyUsd,12.99);
 assert.equal(PLANS.pro.annualUsd,129);
 assert.equal(PLANS.criadero.monthlyUsd,24.99);
 assert.equal(PLANS.criadero.annualUsd,249);
});
test('límite gratuito conserva el total sin borrarlo',()=>{
 for (const [total,visible,hidden] of [[0,0,0],[24,24,0],[25,25,0],[26,25,1],[132,25,107]]) {
  assert.deepEqual(visibility(total,'free'),{total,visible,hidden,limit:25});
 }
 assert.deepEqual(visibility(132,'pro'),{total:132,visible:132,hidden:0,limit:null});
});
test('30 días de prueba exactos y vencimiento',()=>{
 const started='2026-11-01T00:00:00.000Z';
 assert.equal(trialEnd(started),'2026-12-01T00:00:00.000Z');
 assert.equal(effectivePlan({trialStartedAt:started,now:new Date('2026-11-30T23:59:59Z')}).source,'trial');
 assert.equal(effectivePlan({trialStartedAt:started,now:new Date('2026-12-01T00:00:00Z')}).plan,'free');
});
test('plan pagado activo prevalece sobre prueba; heredado premium se conserva',()=>{
 const state=effectivePlan({paidPlan:'premium',paidUntil:'2027-01-01T00:00:00Z',trialStartedAt:'2026-11-01T00:00:00Z',now:new Date('2026-11-15T00:00:00Z')});
 assert.equal(state.plan,'criadero');
 assert.equal(state.source,'paid');
});
test('cuenta sin concesión explícita de prueba permanece gratuita',()=>{
 assert.equal(effectivePlan({now:new Date('2026-11-15T00:00:00Z')}).plan,'free');
});
