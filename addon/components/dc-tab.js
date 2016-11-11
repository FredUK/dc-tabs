import Ember from 'ember';

const {
  Component,
  computed,
  observer,
  on
} = Ember;

const {
  alias
} = Ember.computed;

const {
  schedule
} = Ember.run;

export default Component.extend({

  tagName: 'dc-tab',

  attributeBindings: [
    'role',
    'aria-controls',
    'aria-selected',
    'aria-expanded',
    'tabindex',
    'selected'
  ],

  target: alias('tabList'),
  role: 'tab',

  selected: computed('active', function() {
    return this.get('active') ? 'selected' : null;
  }),

  tabindex: computed('active', function() {
    return this.get('active') ? 0 : null;
  }),

  tabs: alias('tabList.tabsComponent'),
  tabList: function() { return this.get('parentView')}.property(),
  'aria-controls': alias('tabPanel.elementId'),
  'aria-selected': computed('active', function() {
    return this.get('active').toString();
  }),
  'aria-expanded': alias('aria-selected'),

  selectFromTabsSelectedIndexOnInit: function() {
    Ember.run.schedule('afterRender', this, function() {
      this.send('registerTab', this);
      this.selectFromTabsSelectedIndex();
    });
  }.on('init'),

  willDestroyElement() {
    this.send('unregisterTab', this);
  },

  active: computed('tabs.activeTab', function() {
    return this.get('tabs.activeTab') === this;
  }),

  select: on('click', function(options) {
    this.get('tabs').select(this);
    if (options && options.focus) {
      schedule('afterRender', this, function() {
        this.$().focus();
      });
    }
  }),

  index: computed('tabList.tabs.[]', function() {
    return this.get('tabList.tabs').indexOf(this);
  }),

  tabPanel: computed('tabs.tabPanels.[]', function() {
    const index = this.get('index');
    const panels = this.get('tabs.tabPanels');
    return panels && panels.objectAt(index);
  }),

  selectFromTabsSelectedIndex: observer('tabs.selected-index', function() {
    const activeTab = this.get('tabs.activeTab');
    if (activeTab === this) {
      return; // this was just selected
    }
    const selectedIndex = this.get('tabs.selected-index');
    const index = parseInt(this.get('tabs.selected-index'), 10);
    const myIndex = this.get('index');
    if (index === myIndex || (this.get('custom-index') && this.get('custom-index') === selectedIndex)) {
      this.select();
    }
  })
});
