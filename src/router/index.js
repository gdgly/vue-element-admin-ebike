import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/vue-element-admin-ebike',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        // component: () => import('@/views/redirect/index')
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'eindex', affix: true }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/index',
    children: [
      {
        path: 'dashboard',
        redirect: '/vue-element-admin-ebike',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'eindex', affix: true }
      }
    ]
  }
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: '引导', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: '权限',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: '页面权限管理',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //
  //     // {
  //     //   path: 'directive',
  //     //   component: () => import('@/views/permission/directive'),
  //     //   name: 'DirectivePermission',
  //     //   meta: {
  //     //     title: 'Directive Permission'
  //     //     // if do not set roles, means: this page does not require permission
  //     //   }
  //     // },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: '角色权限管理',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/customer-table',
    // alwaysShow: true, // will always show the root menu
    name: 'order',
    meta: {
      title: '会员',
      icon: 'ecustom',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'customerTable',
        component: () => import('@/views/customer/customer-table'),
        name: 'orderTable',
        meta: {
          title: '会员管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'orderTable',
        component: () => import('@/views/orders/order-table'),
        name: 'orderTable',
        meta: {
          title: '订单管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }, {
        path: '',
        component: () => import('@/views/customer/vipRule'),
        name: 'favourable',
        meta: {
          title: '优惠管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/orders/order-table',
    // alwaysShow: true, // will always show the root menu
    name: 'order',
    meta: {
      title: '订单',
      icon: 'eorder',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'orderTable',
        component: () => import('@/views/orders/order-table'),
        name: 'orderTable',
        meta: {
          title: '订单管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'backMoneyTable',
        component: () => import('@/views/orders/backMoney-table'),
        name: 'orderTable',
        meta: {
          title: '退款管理',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/elecfence',
    component: Layout,
    redirect: '/elec-fence/fence-table',
    alwaysShow: true, // will always show the root menu
    name: 'elecFence',
    meta: {
      title: '电子围栏',
      icon: 'efence',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/elec-fence/fence-table'),
        name: 'elecFenceTable',
        meta: {
          title: '电子围栏列表',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }, {
        path: 'fence-map',
        component: () => import('@/views/elec-fence/fence-map'),
        name: 'elecFenceMap',
        meta: {
          title: '电子围栏地图',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }
    ]
  }, {
    path: '/elecbike',
    component: Layout,
    redirect: '/elec-bike/bike-table',
    alwaysShow: true, // will always show the root menu
    name: 'elecBike',
    meta: {
      title: '车辆',
      icon: 'ebike',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'elecBike',
        component: () => import('@/views/elec-bike/bike-table'),
        name: 'elecBikeTable',
        meta: {
          title: '车辆列表',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }, {
        path: 'bikeMonitor',
        component: () => import('@/views/elec-bike/bike-monitor'),
        name: 'bikeMonitor',
        meta: {
          title: '车辆监控',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }, {
        path: 'bikeWarning',
        component: () => import('@/views/elec-bike/bike-warning'),
        name: 'bikeWarning',
        meta: {
          title: '车辆报警',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }, {
        path: 'bikeLocation',
        component: () => import('@/views/elec-bike/bike-location'),
        name: 'bikeLocation',
        meta: {
          title: '车辆位置',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }, {
        path: 'bikeLine',
        component: () => import('@/views/elec-bike/bike-line'),
        name: 'bikeLine',
        meta: {
          title: '车辆追踪',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      }

    ]
  },
  {
    path: '/tradingRecord',
    component: Layout,
    children: [
      {
        path: 'tradingRecord',
        component: () => import('@/views/tradingRecord/tradingRecord'),
        name: 'tradingRecord',
        meta: { title: '交易记录', icon: 'etransaction' }
      }
    ]
  },
  {
    path: '/messages',
    component: Layout,
    children: [
      {
        path: 'messgages',
        component: () => import('@/views/messages/messages'),
        name: 'messages',
        meta: { title: '消息', icon: 'emessage' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    children: [
      {
        path: 'system',
        component: () => import('@/views/system/system'),
        name: 'system',
        meta: { title: '系统', icon: 'esystem' }
      }
    ]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/redirect', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support  history  hash
  // base: '/dist/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
