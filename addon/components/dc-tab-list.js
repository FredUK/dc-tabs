import Ember from 'ember';

const {
  A,
  ArrayProxy,
  Component,
  computed,
  on
} = Ember;

const {
  alias
} = Ember.computed;

export default Component.extend({
  tagName: 'dc-tab-list',

  attributeBindings: [
    'role',
    'aria-multiselectable'
  ],

  tabsComponent: alias('parentView'),
  target: alias('tabsComponent'),

  role: 'tablist',

  'aria-multiselectable': false,

  activeTab: alias('tabsComponent.activeTab'),

  registerTabListOnInit: function() {
    Ember.run.schedule('afterRender', this, function() {
      this.send('registerTabList', this);
    });
  }.on('init'),

  tabs: computed(function() {
    return ArrayProxy.create({
      content: new A()
    });
  }),

  navigateOnKeyDown: on('keyDown', function(event) {
    const  key = event.keyCode;
    if (key === 37 /*<*/ || key === 38 /*^*/) {
      this.selectPrevious();
    } else if (key === 39 /*>*/ || key === 40 /*v*/) {
      this.selectNext();
    } else {
      return;
    }
    event.preventDefault();
  }),

  activeTabIndex: computed('activeTab', function() {
    return this.get('tabs').indexOf(this.get('activeTab'));
  }),

  selectNext() {
    let index = this.get('activeTabIndex') + 1;
    if (index === this.get('tabs.length')) {
      index = 0;
    }
    this.selectTabAtIndex(index);
  },

  selectPrevious() {
    let index = this.get('activeTabIndex') - 1;
    if (index === -1) {
      index = this.get('tabs.length') - 1;
    }
    this.selectTabAtIndex(index);
  },

  selectTabAtIndex(index) {
    const tab = this.get('tabs').objectAt(index);
    tab.select({ focus: true });
  },

  actions: {
    registerTab(tab) {
      this.get('tabs').addObject(tab);
    },

    unregisterTab(tab) {
      this.get('tabs').removeObject(tab);
    }
  }
});
