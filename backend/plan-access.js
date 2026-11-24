'use strict';
const {normalizePlan,visibility}=require('./plan-policy');
const BASIC_MODULES=new Set(['market','messages']);
function canUseModule(moduleName,plan){
  return normalizePlan(plan)!=='free'||BASIC_MODULES.has(moduleName);
}
function visibleIds(rows,plan){
  const summary=visibility(rows.length,plan);
  return {items:rows.slice(0,summary.visible),...summary};
}
function canCreate(total,plan){
  return visibility(total,plan).hidden===0 && (normalizePlan(plan)!=='free'||total<25);
}
module.exports={canUseModule,visibleIds,canCreate};
