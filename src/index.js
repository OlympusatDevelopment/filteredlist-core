import Rxdux from './rxdux';
import Data from './apis/data';
import Filters from './apis/filters';
import Views from './apis/views';
import Queries from './apis/queries';
import Settings from './apis/settings';
import Workspace from './apis/workspace';
import Hooks from './hooks';
import createHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

export default class{
  constructor(options) {
    this.options = options; //  @todo add options schema validation in the future
    this.initialQueryString = '';
    this._isPhantomHistory = false; 
    this.history = options.history;
    this._setupHistory();

    /** 
     * Need access to this.options and there is a preference in order of instantiation 
     * so we need this setup procedure as is
    */
    this.hooks = this._setupHooks();
    this.rxdux = new Rxdux(this, this.hooks); 
    this.queries = new Queries(this.rxdux, this.options, this);
    this.workspace = new Workspace(this.rxdux, this.options, this); 
    this.settings = new Settings(this.rxdux, this.options, this); 
    this.data = new Data(this.rxdux, this.options, this); 
    this.views = new Views(this.rxdux, this.options, this);
    this.filters = new Filters(this.rxdux, this.options, this);

    this._setViews(this.options.views);
    this._setupReloadListener();
    this._onPageLoad();
    this._makeGlobal();

    return this;
  }

  /**
   * With a full instance built, expose it as a global, when not in a testing env
   *
   */
  _makeGlobal() {
    try{
      if(!window && !window.Filteredlist) {window['Filteredlist'] = {};}
      if(window && window.Filteredlist && !window.Filteredlist.instance) {window.Filteredlist.instance = {};}

      window.Filteredlist.instance[this.options.id || Math.random()*10000] = this;
    }catch(e){}
  }

  /**
   * PUSH - the filteredlist wrote to the url but didn't load the page. The user handles getting data from the onFIlterChange hook
   * POP - the page reloaded. Trigger a filter run
   * REPLACE - something triggered the url to change and the page to load that url
   *
   */
  _setupReloadListener() {
    const unsubscribeFromHistoryChanges = this.history.listen((location, action) => {
      if (action !== 'PUSH') { // PUSH, REPLACE, POP
        this._onPageLoad(location.search); //  Pass it the queryString
      }
    });

    // unsubscribeFromHistoryChanges(); // cleanup
  }

  /** 
   * Memory History is used by the test runner as there's no DOM. 
   * Passed in the constructor as history.
   * createHistory requires a DOM.
   * */
  _setupHistory() {
    if (!this.history) {
      try{ this.history = createHistory(); }
      catch(e) { 
        this.history = this.options.history || createMemoryHistory();
        this._isPhantomHistory = true; 
      }
    }   
  }

  /**
   * Instantiates hoks, and flattens them down to the instance prototype
   *
   * @returns {}
   */
  _setupHooks() {
    const hooks = new Hooks();

    /** Flatten */
    Object.keys(hooks)
      .forEach(hookName => {
        this[hookName] = hooks[hookName];
      });

    return hooks;
  }

  /**
   * Set the store up with the views
   *
   * @param {*} views
   */
  _setViews(views) {
    this.views.setViews(views);
  }

  /**
   * Setup page load listeners to handle query string processing
   * OPtionally accepts a query string to run
   * @param {*} queryString
   * @returns
   */
  _onPageLoad(_queryString){
    let queryString = _queryString;;
    
    if (!queryString) {
      queryString = this.queries._readQueryStringFromURL();
    }

    return this.filters.run(
      this.queries._makeFilterObjectFromQueryString(queryString) // filterObject
    );
  }
}