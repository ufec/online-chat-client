import type { Router } from 'vue-router';
import type { RouterGuards } from '../common/interface';

export function loadAllRouterGuards(router: Router, routerGuards: RouterGuards): void {
  routerGuards.beforeEach.forEach((guard) => {
    router.beforeEach(guard);
  });

  routerGuards.beforeResolve.forEach((guard) => {
    router.beforeResolve(guard);
  });

  routerGuards.afterEach.forEach((guard) => {
    router.afterEach(guard);
  });
}
