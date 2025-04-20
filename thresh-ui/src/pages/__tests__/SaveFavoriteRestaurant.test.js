import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SaveFavoriteRestaurant from '../SaveFavoriteRestaurant.vue'

describe('SaveFavoriteRestaurant', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SaveFavoriteRestaurant)
  })

  it('should add a restaurant to favorites when clicking the save button', async () => {
    // Find the first restaurant's save button
    const saveButton = wrapper.findAll('button')[0]
    
    // Click the save button
    await saveButton.trigger('click')
    
    // Check if the restaurant appears in favorites
    const favoritesList = wrapper.findAll('li')
    expect(favoritesList.length).toBe(1)
    expect(favoritesList[0].text()).toBe('Tasty Tacos')
  })

  it('should prevent adding duplicate restaurants to favorites', async () => {
    // Find the first restaurant's save button
    const saveButton = wrapper.findAll('button')[0]
    
    // Click the save button twice
    await saveButton.trigger('click')
    await saveButton.trigger('click')
    
    // Check if the restaurant appears only once in favorites
    const favoritesList = wrapper.findAll('li')
    expect(favoritesList.length).toBe(1)
  })

  it('should load all dummy restaurants when mounted', () => {
    // Check if all 5 restaurants are displayed
    const restaurantCards = wrapper.findAll('.restaurant-card')
    expect(restaurantCards.length).toBe(5)
    
    // Verify the first restaurant's properties
    const firstRestaurant = wrapper.find('.restaurant-card')
    expect(firstRestaurant.text()).toContain('Tasty Tacos')
    expect(firstRestaurant.text()).toContain('Mexican')
    expect(firstRestaurant.text()).toContain('123 Main St, Dallas, TX')
  })
}) 