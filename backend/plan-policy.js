'use strict';

// Política de suscripciones para la edición Railway. Sin acceso a DB ni efectos secundarios.
const PLANS = Object.freeze({
  free: Object.freeze({id:'free',monthlyUsd:0,annualUsd:0,visibleRecords:25}),
  pro: Object.freeze({id:'pro',monthlyUsd:12.99,annualUsd:129,visibleRecords:null}),
  criadero: Object.freeze({id:'criadero',monthlyUsd:24.99,annualUsd:249,visibleRecords:null})
});
const TRIAL_DAYS = 30;

function normalizePlan(value) {
  const plan = String(value || '').toLowerCase();
  // Las suscripciones heredadas premium mantienen su nivel hasta expirar.
  if (plan === 'premium') return 'criadero';
  return Object.hasOwn(PLANS, plan) ? plan : 'free';
}
function isActive(until, now = new Date()) {
  if (!until) return false;
  const date = new Date(until);
  return Number.isFinite(date.getTime()) && date.getTime() > now.getTime();
}
function trialEnd(startedAt) {
  const date = new Date(startedAt);
  if (!Number.isFinite(date.getTime())) return null;
  return new Date(date.getTime() + TRIAL_DAYS * 86400000).toISOString();
}
// trialStartedAt solo debe existir si el servidor registró explícitamente la concesión;
// no debe deducirse de created_at de cuentas existentes.
function effectivePlan({paidPlan, paidUntil, trialStartedAt, now = new Date()} = {}) {
  if (paidPlan && isActive(paidUntil, now)) {
    return {plan:normalizePlan(paidPlan),source:'paid',endsAt:new Date(paidUntil).toISOString()};
  }
  const end = trialStartedAt ? trialEnd(trialStartedAt) : null;
  if (end && isActive(end, now)) return {plan:'criadero',source:'trial',endsAt:end};
  return {plan:'free',source:'free',endsAt:null};
}
function visibility(total, plan) {
  if (!Number.isSafeInteger(total) || total < 0) throw new TypeError('total debe ser un entero no negativo');
  const normalized = normalizePlan(plan);
  const limit = PLANS[normalized].visibleRecords;
  const visible = limit === null ? total : Math.min(limit,total);
  return {total,visible,hidden:total-visible,limit};
}
module.exports = {PLANS,TRIAL_DAYS,normalizePlan,isActive,trialEnd,effectivePlan,visibility};
