import { RouteRecordRaw } from 'vue-router'

// Layout
import DashboardLayout from '../views/DashboardLayout.vue'

// Views
import Dashboard from '../views/Dashboard.vue'
import Budget from '../views/Budget.vue'
import Transactions from '../views/Transactions.vue'
import DebtSnowball from '../views/DebtSnowball.vue'
import Reports from '../views/Reports.vue'
import Settings from '../views/Settings.vue'
import NotFound from '../views/NotFound.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'budget',
        name: 'budget',
        component: Budget,
        meta: { title: 'Budget' }
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: Transactions,
        meta: { title: 'Transactions' }
      },
      {
        path: 'debts',
        name: 'debts',
        component: DebtSnowball,
        meta: { title: 'Debt Snowball' }
      },
      {
        path: 'reports',
        name: 'reports',
        component: Reports,
        meta: { title: 'Reports' }
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings,
        meta: { title: 'Settings' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: 'Page Not Found' }
  }
]

export default routes