import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'entry',
            component: () => import('@/views/EntryView.vue')
        },
        {
            path: "/register",
            name: "register",
            component: () => import("@/views/EntryRegister.vue")
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/EntryLogin.vue")
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/HomeView.vue')
          },
          {
            path: '/create',
            name: 'create',
            component: () => import('../views/CreateView.vue')
          },
          {
            path: '/overview/:overviewType',
            name: 'overview',
            component: () => import('../views/OverviewView.vue'),
            props: true
          },
          {
            path: '/ticket/:ticketCrf',
            name: 'ticket',
            component: () => import('../views/TicketView.vue'),
            props: true
          },
          {
            path: '/forecast',
            name: 'forecaast',
            component: () => import('../views/ForecastView.vue')
          }
    ]
  })
  
  router.beforeEach((to) => {
    let user: null | string = null
    const storageItem = localStorage.getItem('user')
    if (storageItem) {
        user = JSON.parse(storageItem)
    }
    if (!user) {
        if (to.name !== 'entry' && to.name !== 'register' && to.name !== 'login') {
            return { name: 'entry' }
        }
    }
    if (user && (to.name === 'entry' || to.name === 'register' || to.name === 'login')) {
        return { name: 'home' }
    }
  })