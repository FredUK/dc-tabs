import Ember from 'ember';

const {
  A,
  ArrayProxy,
  Component,
  computed
} = Ember;

export default Component.extend({
  tagName: 'dc-tabs',
  activeTab: null,
  'selected-index': 0,

  tabPanels: computed(function() {
    return ArrayProxy.create({
      content: new A()
    });
  }),

  select(tab) {
    const tabIndex = tab.get('custom-index') || tab.get('index');
    this.set('activeTab', tab);
    this.set('selected-index', tabIndex);
  },

  actions: {
    registerTabList(tabList) {
      this.set('tabList', tabList);
    },

    registerTabPanel(tabPanel) {
      this.get('tabPanels').addObject(tabPanel);
    },

    unregisterTabPanel(tabPanel) {
      this.get('tabPanels').removeObject(tabPanel);
    }
  }
});
