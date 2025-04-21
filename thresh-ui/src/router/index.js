// thresh-ui/src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

// Page components
import Home                    from '@/pages/Home.vue'
import AccountCreation         from '@/pages/AccountCreation.vue'
import SignIn                  from '@/pages/SignIn.vue'
import RateRestaurant          from '@/pages/RateRestaurant.vue'
import RemoveRestaurant        from '@/pages/RemoveRestaurant.vue'
import FilterSearch            from '@/pages/FilterSearch.vue'
import ViewAllergens           from '@/pages/ViewAllergens.vue'
import DeleteAccount           from '@/pages/DeleteAccount.vue'
import BanUser                 from '@/pages/BanUser.vue'
import SaveFavoriteRestaurant  from '@/pages/SaveFavoriteRestaurant.vue'
import MapView                 from '@/pages/Map.vue'
import Profile                 from '@/pages/Profile.vue'
import ReportIncorrectAllergy  from '@/pages/ReportIncorrectAllergy.vue'
import NotFound                from '@/pages/NotFound.vue'

const routes = [
  { path: '/',                      component: Home },
  { path: '/sign-up',               component: AccountCreation },
  { path: '/sign-in',               component: SignIn },
  { path: '/rate-restaurant',       component: RateRestaurant },
  { path: '/remove-restaurant',     component: RemoveRestaurant },      // UC11
  { path: '/filter-search',         component: FilterSearch },
  { path: '/view-allergens',        component: ViewAllergens },
  { path: '/delete-account',        component: DeleteAccount },
  { path: '/ban-user',              component: BanUser },
  { path: '/save-favorite-restaurant', component: SaveFavoriteRestaurant },
  { path: '/map',                   component: MapView },
  { path: '/profile',               component: Profile },
  { path: '/report-allergy',        component: ReportIncorrectAllergy }, // UC10
  { path: '/:pathMatch(.*)*',       component: NotFound }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
