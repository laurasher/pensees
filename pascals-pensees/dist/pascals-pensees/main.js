"use strict";
(self["webpackChunkpascals_pensees"] = self["webpackChunkpascals_pensees"] || []).push([["main"],{

/***/ 90158:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 52816);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);



const routes = [];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule.forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule] }); })();


/***/ }),

/***/ 55041:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 28784);
/* harmony import */ var _lite_brite_chart_lite_brite_chart_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lite-brite-chart/lite-brite-chart.component */ 30245);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 36362);




class AppComponent {
  constructor(http) {
    this.http = http;
    this.title = "Pascal's Pensées"; // subtitle = "Explore NLP clustering and topic modeling of Pascal's 924 pensées.";

    this.instructions = "Explore NLP clustering and topic modeling of Pascal's 924 pensées. Each colored box represents one of Pascal's penseés, arranged chronologically. \
  Each penseé has been assigned to 1 of 10 clusters by k-means clustering of their TF-IDF vector representations. Double click a box to recolor all boxes\
  according to their topic-modeled similarity to the clicked pensée, from dark meaning most similar to light, meaning not related thematically.";
    this.data = this.http.get('assets/pensee_clusters.json');
    console.log("In AppComponent constructor");
    console.log(this.data);
  }

  ngOnInit() {}

}

AppComponent.ɵfac = function AppComponent_Factory(t) {
  return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
};

AppComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: AppComponent,
  selectors: [["app-root"]],
  decls: 10,
  vars: 5,
  consts: [["rel", "stylesheet", "href", "https://use.typekit.net/pjc2sqf.css"], [1, "main-page-content"], ["id", "titles-top-half"], ["id", "main-page-title"], ["id", "main-page-instructions"], ["id", "charts-bottom-half"], [1, "column", 3, "data"]],
  template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "link", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "app-lite-brite-chart", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](9, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    }

    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.title);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.instructions);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("data", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](9, 3, ctx.data));
    }
  },
  directives: [_lite_brite_chart_lite_brite_chart_component__WEBPACK_IMPORTED_MODULE_0__.LiteBriteChartComponent],
  pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.AsyncPipe],
  styles: [".main-page-content[_ngcontent-%COMP%] {\n  display: flex;\n  \n  flex-direction: column;\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden;\n}\n#main-page-title[_ngcontent-%COMP%] {\n  font-family: adso, sans-serif;\n  font-weight: 200 !important;\n  font-style: italic;\n  font-size: 3.8vw;\n  margin: 0 !important;\n}\n#main-page-subtitle[_ngcontent-%COMP%] {\n  font-family: \"Effra Lt\";\n  font-size: 0.9vw;\n  margin-top: 0;\n  margin-bottom: 0.5vw;\n}\n#main-page-instructions[_ngcontent-%COMP%] {\n  font-family: \"Effra Lt\";\n  font-size: 1vw;\n  margin-top: 0;\n  margin-bottom: 1.2vw;\n  width: 65%;\n}\n#charts-bottom-half[_ngcontent-%COMP%] {\n  flex: 1;\n  min-height: 0;\n  overflow: hidden;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGFBQUE7RUFDRixtQkFBbUI7RUFBakIsc0JBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0FBRUo7QUFBQTtFQUNJLDZCQUFBO0VBQ0EsMkJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0Esb0JBQUE7QUFFSjtBQUFBO0VBQ0ksdUJBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSxvQkFBQTtBQUVKO0FBQ0E7RUFDRSx1QkFBQTtFQUNBLGNBQUE7RUFDQSxhQUFBO0VBQ0Esb0JBQUE7RUFDQSxVQUFBO0FBQ0Y7QUFDQTtFQUNJLE9BQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7QUFDSiIsImZpbGUiOiJhcHAuY29tcG9uZW50Lmxlc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubWFpbi1wYWdlLWNvbnRlbnQge1xuICAgIGRpc3BsYXk6IGZsZXg7IC8qIG9yIGlubGluZS1mbGV4ICovXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xufVxuI21haW4tcGFnZS10aXRsZSB7XG4gICAgZm9udC1mYW1pbHk6IGFkc28sIHNhbnMtc2VyaWY7XG4gICAgZm9udC13ZWlnaHQ6IDIwMCAhaW1wb3J0YW50O1xuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICBmb250LXNpemU6IDMuOHZ3O1xuICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xufVxuI21haW4tcGFnZS1zdWJ0aXRsZSB7XG4gICAgZm9udC1mYW1pbHk6IFwiRWZmcmEgTHRcIjtcbiAgICBmb250LXNpemU6IDAuOXZ3O1xuICAgIG1hcmdpbi10b3A6IDA7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41dnc7XG4gICAgLy8gbWFyZ2luLWJvdHRvbTogMnZ3O1xufVxuI21haW4tcGFnZS1pbnN0cnVjdGlvbnMge1xuICBmb250LWZhbWlseTogXCJFZmZyYSBMdFwiO1xuICBmb250LXNpemU6IDF2dztcbiAgbWFyZ2luLXRvcDogMDtcbiAgbWFyZ2luLWJvdHRvbTogMS4ydnc7XG4gIHdpZHRoOiA2NSU7XG59XG4jY2hhcnRzLWJvdHRvbS1oYWxmIHtcbiAgICBmbGV4OiAxO1xuICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuIl19 */"]
});

/***/ }),

/***/ 36747:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ 50318);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 90158);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 55041);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ 28784);
/* harmony import */ var _lite_brite_chart_lite_brite_chart_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lite-brite-chart/lite-brite-chart.component */ 30245);
/* harmony import */ var _pensees_display_pensees_display_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pensees-display/pensees-display.component */ 98468);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser/animations */ 73598);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ 65590);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/autocomplete */ 43188);
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/badge */ 70178);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/button */ 87317);
/* harmony import */ var _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! @angular/material/button-toggle */ 31959);
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/card */ 11961);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/checkbox */ 61534);
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/chips */ 81196);
/* harmony import */ var _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/datepicker */ 5818);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/dialog */ 95758);
/* harmony import */ var _angular_material_expansion__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/expansion */ 12928);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/form-field */ 44770);
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/grid-list */ 63346);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/input */ 43365);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/list */ 26131);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/menu */ 82796);
/* harmony import */ var _angular_material_paginator__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! @angular/material/paginator */ 26439);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/material/progress-bar */ 60833);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! @angular/material/progress-spinner */ 74742);
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/radio */ 68390);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/select */ 91434);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/sidenav */ 7216);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/slide-toggle */ 6623);
/* harmony import */ var _angular_material_slider__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/slider */ 61859);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! @angular/material/snack-bar */ 32528);
/* harmony import */ var _angular_material_sort__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! @angular/material/sort */ 64316);
/* harmony import */ var _angular_material_stepper__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/stepper */ 7650);
/* harmony import */ var _angular_material_table__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! @angular/material/table */ 97217);
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @angular/material/tabs */ 12379);
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/toolbar */ 19946);
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! @angular/material/tooltip */ 40089);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3184);








































// import { FilterPipe } from './pipe/filter.pipe';
class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent] });
AppModule.ɵinj = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({ providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__.BrowserModule,
            _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClientModule,
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__.NoopAnimationsModule,
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule,
            _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialogModule,
            _angular_material_form_field__WEBPACK_IMPORTED_MODULE_11__.MatFormFieldModule,
            _angular_material_input__WEBPACK_IMPORTED_MODULE_12__.MatInputModule,
            _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__.MatCheckboxModule,
            _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__.MatCheckboxModule,
            _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule,
            _angular_material_input__WEBPACK_IMPORTED_MODULE_12__.MatInputModule,
            _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_15__.MatAutocompleteModule,
            _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_16__.MatDatepickerModule,
            _angular_material_form_field__WEBPACK_IMPORTED_MODULE_11__.MatFormFieldModule,
            _angular_material_radio__WEBPACK_IMPORTED_MODULE_17__.MatRadioModule,
            _angular_material_select__WEBPACK_IMPORTED_MODULE_18__.MatSelectModule,
            _angular_material_slider__WEBPACK_IMPORTED_MODULE_19__.MatSliderModule,
            _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__.MatSlideToggleModule,
            _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuModule,
            _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_22__.MatSidenavModule,
            _angular_material_badge__WEBPACK_IMPORTED_MODULE_23__.MatBadgeModule,
            _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_24__.MatToolbarModule,
            _angular_material_list__WEBPACK_IMPORTED_MODULE_25__.MatListModule,
            _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_26__.MatGridListModule,
            _angular_material_card__WEBPACK_IMPORTED_MODULE_27__.MatCardModule,
            _angular_material_stepper__WEBPACK_IMPORTED_MODULE_28__.MatStepperModule,
            _angular_material_tabs__WEBPACK_IMPORTED_MODULE_29__.MatTabsModule,
            _angular_material_expansion__WEBPACK_IMPORTED_MODULE_30__.MatExpansionModule,
            _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_31__.MatButtonToggleModule,
            _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__.MatChipsModule,
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule,
            _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_33__.MatProgressSpinnerModule,
            _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_34__.MatProgressBarModule,
            _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialogModule,
            _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_35__.MatTooltipModule,
            _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_36__.MatSnackBarModule,
            _angular_material_table__WEBPACK_IMPORTED_MODULE_37__.MatTableModule,
            _angular_material_sort__WEBPACK_IMPORTED_MODULE_38__.MatSortModule,
            _angular_material_paginator__WEBPACK_IMPORTED_MODULE_39__.MatPaginatorModule,
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent,
        _lite_brite_chart_lite_brite_chart_component__WEBPACK_IMPORTED_MODULE_2__.LiteBriteChartComponent,
        _pensees_display_pensees_display_component__WEBPACK_IMPORTED_MODULE_3__.PenseesDisplayComponent], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__.BrowserModule,
        _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule,
        _angular_common_http__WEBPACK_IMPORTED_MODULE_6__.HttpClientModule,
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_7__.NoopAnimationsModule,
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule,
        _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule,
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialogModule,
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_11__.MatFormFieldModule,
        _angular_material_input__WEBPACK_IMPORTED_MODULE_12__.MatInputModule,
        _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__.MatCheckboxModule,
        _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_13__.MatCheckboxModule,
        _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule,
        _angular_material_input__WEBPACK_IMPORTED_MODULE_12__.MatInputModule,
        _angular_material_autocomplete__WEBPACK_IMPORTED_MODULE_15__.MatAutocompleteModule,
        _angular_material_datepicker__WEBPACK_IMPORTED_MODULE_16__.MatDatepickerModule,
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_11__.MatFormFieldModule,
        _angular_material_radio__WEBPACK_IMPORTED_MODULE_17__.MatRadioModule,
        _angular_material_select__WEBPACK_IMPORTED_MODULE_18__.MatSelectModule,
        _angular_material_slider__WEBPACK_IMPORTED_MODULE_19__.MatSliderModule,
        _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_20__.MatSlideToggleModule,
        _angular_material_menu__WEBPACK_IMPORTED_MODULE_21__.MatMenuModule,
        _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_22__.MatSidenavModule,
        _angular_material_badge__WEBPACK_IMPORTED_MODULE_23__.MatBadgeModule,
        _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_24__.MatToolbarModule,
        _angular_material_list__WEBPACK_IMPORTED_MODULE_25__.MatListModule,
        _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_26__.MatGridListModule,
        _angular_material_card__WEBPACK_IMPORTED_MODULE_27__.MatCardModule,
        _angular_material_stepper__WEBPACK_IMPORTED_MODULE_28__.MatStepperModule,
        _angular_material_tabs__WEBPACK_IMPORTED_MODULE_29__.MatTabsModule,
        _angular_material_expansion__WEBPACK_IMPORTED_MODULE_30__.MatExpansionModule,
        _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_31__.MatButtonToggleModule,
        _angular_material_chips__WEBPACK_IMPORTED_MODULE_32__.MatChipsModule,
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIconModule,
        _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_33__.MatProgressSpinnerModule,
        _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_34__.MatProgressBarModule,
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialogModule,
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_35__.MatTooltipModule,
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_36__.MatSnackBarModule,
        _angular_material_table__WEBPACK_IMPORTED_MODULE_37__.MatTableModule,
        _angular_material_sort__WEBPACK_IMPORTED_MODULE_38__.MatSortModule,
        _angular_material_paginator__WEBPACK_IMPORTED_MODULE_39__.MatPaginatorModule] }); })();


/***/ }),

/***/ 30245:
/*!****************************************************************!*\
  !*** ./src/app/lite-brite-chart/lite-brite-chart.component.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LiteBriteChartComponent": () => (/* binding */ LiteBriteChartComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ 17659);
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! d3-selection */ 52825);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/icon */ 65590);







const _c0 = ["chart"];
function LiteBriteChartComponent_mat_icon_3_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-icon", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function LiteBriteChartComponent_mat_icon_3_Template_mat_icon_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r3); const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r2.clearSearch(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "close");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
// resizable chart angular tutorial https://medium.com/@jeanphilippelemieux/creating-a-responsive-graph-with-angular-and-d3-b45bb8065588
class LiteBriteChartComponent {
    constructor() {
        this.data = null;
        this.filterBy = '';
        this.filterControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl();
        this.searchTerm = '';
        this.matchedIndices = new Set();
        this.previousMatchedIndices = new Set();
        this.searchDebounceTimer = null;
        this.searchCache = [];
        this.resizeTimeout = null;
        this.message = "Click colored boxes to see pensées text below. Double click to see n-most similar pensées to the one you clicked. \nClick within text area to reset.";
        // public message = ""
        this.square = 10;
        this.squareBuffer = 0;
        this.NUM_CLUSTERS = 10;
        this.margin = { top: 0, right: 0, bottom: 0, left: 0 };
        this.width = 0;
        this.scatter_svg_width = 0;
        this.scatter_svg_height = 0;
        this.height = 0;
        this.contentWidth = 0;
        this.adjustWidth = 0;
        this.adjustHeight = 0;
        this.contentHeight = 0;
        this.cluster_color_map = {
            0: "#D3BCBC",
            1: "#DA6627",
            2: "#08332C",
            3: "#4D7F71",
            4: "#3A4D22",
            5: "#B39530",
            6: "#EADB9F",
            7: "#604F5B",
            8: "#937F7F",
            9: "#3F5450",
        };
    }
    onResize() {
        // Debounce resize events to avoid excessive redraws
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            this.handleResize();
        }, 250);
    }
    handleResize() {
        if (!this.data) {
            return;
        }
        // Remove existing SVG elements only within this component
        d3__WEBPACK_IMPORTED_MODULE_0__.select(this.chartContainer.nativeElement).selectAll('svg').remove();
        d3__WEBPACK_IMPORTED_MODULE_0__.select('#cluster-scatterplot').selectAll('svg').remove();
        // Rebuild and redraw
        this.buildSvg();
        this.drawLites();
    }
    ngOnInit() {
        this.tooltip = d3__WEBPACK_IMPORTED_MODULE_0__.select('#container') // or d3.select('#bar')
            .append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);
        this.textviewer = d3__WEBPACK_IMPORTED_MODULE_0__.select('#text-viewer')
            .append('div').attr('class', 'text-viewer');
    }
    ;
    ngOnDestroy() {
        // Clean up resize timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
    }
    ngOnChanges() {
        if (!this.data) {
            return;
        }
        console.log(this.data);
        // Build search cache to avoid repeated toLowerCase() operations
        if (Array.isArray(this.data)) {
            this.searchCache = this.data.map(item => {
                var _a, _b, _c;
                return ({
                    corpusLower: ((_a = item.corpus) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '',
                    indexStr: ((_b = item.fragment_index) === null || _b === void 0 ? void 0 : _b.toString()) || '',
                    numberStr: ((_c = item.fragment_number) === null || _c === void 0 ? void 0 : _c.toString()) || ''
                });
            });
        }
        this.buildSvg();
        this.drawLites();
    }
    buildSvg() {
        const element = this.chartContainer.nativeElement;
        this.svg = d3__WEBPACK_IMPORTED_MODULE_0__.select(element).append('svg')
            .attr('width', element.offsetWidth)
            .attr('height', element.offsetHeight);
        this.scatter_svg = d3__WEBPACK_IMPORTED_MODULE_0__.select("#cluster-scatterplot").append('svg').attr("height", "100%").attr("width", "100%");
        this.scatter_svg_width = +this.scatter_svg.style("width").replace("px", "") - 20;
        this.scatter_svg_height = +this.scatter_svg.style("height").replace("px", "") - 20;
        this.margin = {
            top: +this.svg.style("margin-top").replace("px", ""),
            right: +this.svg.style("margin-right").replace("px", ""),
            bottom: +this.svg.style("margin-bottom").replace("px", ""),
            left: +this.svg.style("margin-left").replace("px", "")
        };
        this.width = +this.svg.style("width").replace("px", "");
        this.height = +this.svg.style("height").replace("px", "");
        this.contentWidth = this.width - this.margin.left - this.margin.right;
        this.contentHeight = this.height - this.margin.top - this.margin.bottom;
        this.adjustWidth = this.contentWidth / 44;
        this.adjustHeight = this.contentHeight / 21;
        this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.scatter_svg_g = this.scatter_svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }
    drawLites() {
        const cluster_color_map = this.cluster_color_map;
        const tooltip = d3__WEBPACK_IMPORTED_MODULE_0__.select('.tooltip')
            .style('display', 'none').style('opacity', 0);
        const textviewer = d3__WEBPACK_IMPORTED_MODULE_0__.select('.text-viewer');
        const scatter = this.scatter_svg_g;
        this.g.selectAll("lites")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("class", "lites")
            .attr('x', (d, i) => d.col * (this.adjustWidth + this.squareBuffer))
            .attr('y', (d, i) => d.row * (this.adjustHeight + this.squareBuffer))
            .attr('width', this.adjustWidth)
            .attr('height', this.adjustHeight)
            .attr("fill", "white")
            .attr("stroke", "white")
            .transition(d3__WEBPACK_IMPORTED_MODULE_0__.transition(), 40000)
            .attr("fill", (d) => cluster_color_map[d.cluster])
            .attr("stroke", (d) => cluster_color_map[d.cluster]);
        let x = d3__WEBPACK_IMPORTED_MODULE_0__.scaleLinear()
            .domain([-0.45, 0.45])
            .range([0, this.scatter_svg_width]);
        let y = d3__WEBPACK_IMPORTED_MODULE_0__.scaleLinear()
            .domain([-0.3, 0.44])
            .range([this.scatter_svg_height, 0]);
        for (let ci = 0; ci < this.NUM_CLUSTERS; ci++) {
            scatter.selectAll("dot")
                .data(this.data)
                .enter()
                .filter((d) => d.cluster == ci)
                .append("g")
                .attr('class', "scatter-cluster scatter-cluster-" + ci)
                .append("circle")
                .attr("cx", (d) => x(d.x0))
                .attr("cy", (d) => y(d.x1))
                .transition(d3__WEBPACK_IMPORTED_MODULE_0__.transition(), 40000)
                .attr("r", 1.6)
                .attr("fill", (d) => cluster_color_map[d.cluster])
                .attr("stroke", (d) => cluster_color_map[d.cluster]);
        }
        let color_amplifier = 5;
        this.g.selectAll("lites-overlay")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("class", "lites-overlay")
            .attr('x', (d, i) => d.col * (this.adjustWidth + this.squareBuffer))
            .attr('y', (d, i) => d.row * (this.adjustHeight + this.squareBuffer))
            .attr('width', this.adjustWidth)
            .attr('height', this.adjustHeight)
            .attr("fill", "white")
            .attr("fill-opacity", 0)
            .on("mouseover", function (_event, d) {
            d3_selection__WEBPACK_IMPORTED_MODULE_3__["default"](this);
            tooltip
                .style('top', (_event.layerY + 15) + 'px').style('left', (_event.layerX) + 'px')
                .style('background', "#f6efe3")
                .style('display', 'block').style('opacity', 0.99)
                .html(`cluster: ${_event.target.__data__['cluster']}<br>number: ${_event.target.__data__['fragment_number']}<br>index: ${_event.target.__data__['fragment_index']}<br>row: ${_event.target.__data__['row']}<br>col: ${_event.target.__data__['col']}`);
        })
            .on("mouseout", function () {
            d3_selection__WEBPACK_IMPORTED_MODULE_3__["default"](this);
            // .style("stroke", function (d: any) {return cluster_color_map[d.cluster];})
            tooltip
                .style('display', 'none').style('opacity', 0);
        })
            .on("click", function (_event, _d) {
            textviewer
                .html(`${_d.corpus}`);
            //reset
            scatter.selectAll(".scatter-cluster")
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);
            scatter.selectAll(".scatter-cluster-" + _d.cluster)
                .transition(d3__WEBPACK_IMPORTED_MODULE_0__.transition())
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);
        })
            .on("dblclick", function (_event, _d) {
            d3__WEBPACK_IMPORTED_MODULE_0__.selectAll(".lites")
                .data(_d.sim_arr)
                .transition(d3__WEBPACK_IMPORTED_MODULE_0__.transition())
                .attr("fill", cluster_color_map[_d.cluster])
                .attr("fill-opacity", (d) => d * color_amplifier)
                .style("stroke-opacity", (d) => d * color_amplifier)
                .style("stroke-color", cluster_color_map[_d.cluster]);
        });
    }
    searchPensees() {
        // Clear any existing debounce timer
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
        // Debounce search execution by 300ms (increased for better performance)
        this.searchDebounceTimer = setTimeout(() => {
            this.executeSearch();
        }, 300);
    }
    executeSearch() {
        // Store previous state for comparison
        this.previousMatchedIndices = new Set(this.matchedIndices);
        this.matchedIndices.clear();
        if (!this.searchTerm || this.searchTerm.trim() === '') {
            // If search is empty, just reset styles without rebuilding SVG
            this.resetSearchHighlighting();
            return;
        }
        const searchLower = this.searchTerm.toLowerCase().trim();
        // Use cached lowercase strings for much faster search
        this.searchCache.forEach((cached, index) => {
            if (cached.corpusLower.includes(searchLower) ||
                cached.indexStr.includes(searchLower) ||
                cached.numberStr.includes(searchLower)) {
                this.matchedIndices.add(index);
            }
        });
        // Apply highlighting to existing rectangles
        this.applySearchHighlighting();
    }
    resetSearchHighlighting() {
        // Reset all rectangles to normal appearance without transitions for instant feedback
        const allRects = d3__WEBPACK_IMPORTED_MODULE_0__.selectAll('.lites');
        allRects
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 1)
            .attr('stroke', (d) => this.cluster_color_map[d.cluster])
            .attr('stroke-width', 1);
        this.previousMatchedIndices.clear();
    }
    applySearchHighlighting() {
        const hasMatches = this.matchedIndices.size > 0;
        const cluster_color_map = this.cluster_color_map;
        // Get all rectangles once
        const allRects = d3__WEBPACK_IMPORTED_MODULE_0__.selectAll('.lites');
        if (!hasMatches) {
            // No matches - dim all rectangles instantly
            allRects
                .attr('fill-opacity', 0.3)
                .attr('stroke-opacity', 0.3)
                .attr('stroke', (d) => cluster_color_map[d.cluster])
                .attr('stroke-width', 1);
        }
        else {
            // Only update rectangles that changed state
            allRects.each((d, i, nodes) => {
                const isMatch = this.matchedIndices.has(i);
                const wasMatch = this.previousMatchedIndices.has(i);
                // Skip if state hasn't changed
                if (isMatch === wasMatch && this.previousMatchedIndices.size > 0) {
                    return;
                }
                // Update only changed rectangles
                d3__WEBPACK_IMPORTED_MODULE_0__.select(nodes[i])
                    .attr('fill-opacity', isMatch ? 1 : 0.3)
                    .attr('stroke-opacity', isMatch ? 1 : 0.3)
                    .attr('stroke', cluster_color_map[d.cluster])
                    .attr('stroke-width', 1);
            });
        }
        // Update previous state
        this.previousMatchedIndices = new Set(this.matchedIndices);
    }
    clearSearch() {
        this.searchTerm = '';
        this.matchedIndices.clear();
        // Clear any pending debounce timer
        if (this.searchDebounceTimer) {
            clearTimeout(this.searchDebounceTimer);
        }
        // Just reset styles without rebuilding SVG
        this.resetSearchHighlighting();
    }
    refreshLiteBrites() {
        // Clear search state
        this.searchTerm = '';
        this.matchedIndices.clear();
        // d3.select('svg').remove();
        this.scatter_svg_g.selectAll(".scatter-cluster")
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);
        d3__WEBPACK_IMPORTED_MODULE_0__.selectAll('svg').remove();
        this.buildSvg();
        this.drawLites();
        d3__WEBPACK_IMPORTED_MODULE_0__.select('.text-viewer').html(``);
    }
}
LiteBriteChartComponent.ɵfac = function LiteBriteChartComponent_Factory(t) { return new (t || LiteBriteChartComponent)(); };
LiteBriteChartComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: LiteBriteChartComponent, selectors: [["app-lite-brite-chart"]], viewQuery: function LiteBriteChartComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵviewQuery"](_c0, 5);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵloadQuery"]()) && (ctx.chartContainer = _t.first);
    } }, hostBindings: function LiteBriteChartComponent_HostBindings(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("resize", function LiteBriteChartComponent_resize_HostBindingHandler($event) { return ctx.onResize($event); }, false, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresolveWindow"]);
    } }, inputs: { data: "data" }, features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵNgOnChangesFeature"]], decls: 17, vars: 3, consts: [["id", "container"], ["id", "search-container"], ["type", "text", "id", "search-input", "placeholder", "Search pens\u00E9es...", 3, "ngModel", "ngModelChange", "input"], ["id", "clear-icon", 3, "click", 4, "ngIf"], ["id", "refresh-icon", 3, "click"], [1, "tooltip"], ["id", "subcontainer"], ["id", "chart"], ["chart", ""], ["id", "cluster-scatterplot"], ["id", "text-viewer", 3, "click"], ["id", "clear-icon", 3, "click"]], template: function LiteBriteChartComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "input", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngModelChange", function LiteBriteChartComponent_Template_input_ngModelChange_2_listener($event) { return ctx.searchTerm = $event; })("input", function LiteBriteChartComponent_Template_input_input_2_listener() { return ctx.searchPensees(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, LiteBriteChartComponent_mat_icon_3_Template, 2, 0, "mat-icon", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-icon", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function LiteBriteChartComponent_Template_mat_icon_click_4_listener() { return ctx.refreshLiteBrites(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "refresh");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "div", 7, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "div", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "div", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function LiteBriteChartComponent_Template_div_click_12_listener() { return ctx.refreshLiteBrites(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "i");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](15, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](16, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngModel", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.searchTerm);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.message);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgModel, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_material_icon__WEBPACK_IMPORTED_MODULE_5__.MatIcon], styles: ["#container[_ngcontent-%COMP%] {\n  height: 100%;\n  width: 100%;\n}\n#subcontainer[_ngcontent-%COMP%] {\n  display: grid;\n  height: 100%;\n  width: 100%;\n  grid-template-columns: 66% 30%;\n  \n  grid-column-gap: 2%;\n}\nsvg[_ngcontent-%COMP%] {\n  margin-right: 0px;\n}\n#chart[_ngcontent-%COMP%] {\n  overflow: inherit;\n  height: calc(100vh - 200px);\n  width: 100%;\n}\n#text-viewer[_ngcontent-%COMP%] {\n  height: calc(40vh - 80px);\n  min-height: 200px;\n  width: 100%;\n  overflow-y: scroll;\n  font-size: 1.01vw;\n}\n#cluster-scatterplot[_ngcontent-%COMP%] {\n  margin-top: 2vh;\n  height: calc(40vh - 80px);\n  min-height: 200px;\n  width: 100%;\n}\n.tooltip[_ngcontent-%COMP%] {\n  position: absolute;\n  background: white;\n  padding: 1%;\n  padding-top: 1% !important;\n  margin: auto;\n  font-family: \"Effra Rg\" !important;\n  font-size: 0.8vw !important;\n  padding-top: 0px;\n  vertical-align: middle;\n  border-radius: 7px;\n  height: auto !important;\n  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 7px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;\n}\n#refresh-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  float: right;\n  right: 2vw;\n  cursor: pointer;\n}\n#search-container[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 1vh;\n  left: 2vw;\n  display: flex;\n  align-items: center;\n  gap: 0.5vw;\n  z-index: 10;\n}\n#search-input[_ngcontent-%COMP%] {\n  padding: 0.5vw 1vw;\n  font-family: \"Effra Rg\" !important;\n  font-size: 0.8vw !important;\n  border: 1px solid #e0e0e0;\n  border-radius: 7px;\n  background: white;\n  outline: none;\n  width: 20vw;\n  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 7px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;\n}\n#search-input[_ngcontent-%COMP%]:focus {\n  border-color: #4D7F71;\n}\n#search-input[_ngcontent-%COMP%]::placeholder {\n  color: #999;\n  font-family: \"Effra Lt\" !important;\n}\n#clear-icon[_ngcontent-%COMP%] {\n  cursor: pointer;\n  font-size: 1.2vw !important;\n  width: 1.2vw;\n  height: 1.2vw;\n  color: #666;\n}\n#clear-icon[_ngcontent-%COMP%]:hover {\n  color: #333;\n}\n.mat-icon[_ngcontent-%COMP%] {\n  vertical-align: middle !important;\n}\n.pensees-search[_ngcontent-%COMP%] {\n  font-size: 0.9vw;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpdGUtYnJpdGUtY2hhcnQuY29tcG9uZW50Lmxlc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0E7RUFDRSxZQUFBO0VBQ0EsV0FBQTtBQUpGO0FBTUE7RUFDRSxhQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7RUFDQSw4QkFBQTtFQUpBLGFBQWE7RUFLYixtQkFBQTtBQUhGO0FBS0E7RUFDRSxpQkFBQTtBQUhGO0FBS0E7RUFDRSxpQkFBQTtFQUNBLDJCQUFBO0VBQ0EsV0FBQTtBQUhGO0FBTUE7RUFJRSx5QkFBQTtFQUNBLGlCQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBRUEsaUJBQUE7QUFSRjtBQVVBO0VBR0UsZUFBQTtFQUVBLHlCQUFBO0VBQ0EsaUJBQUE7RUFDQSxXQUFBO0FBWEY7QUFhQTtFQUNFLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxXQUFBO0VBQ0EsMEJBQUE7RUFDQSxZQUFBO0VBQ0Esa0NBQUE7RUFDQSwyQkFBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtFQUNBLHVCQUFBO0VBQ0Esd0ZBQUE7QUFYRjtBQWFBO0VBQ0Usa0JBQUE7RUFDQSxZQUFBO0VBQ0EsVUFBQTtFQUNBLGVBQUE7QUFYRjtBQWNBO0VBQ0Usa0JBQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFVBQUE7RUFDQSxXQUFBO0FBWkY7QUFlQTtFQUNFLGtCQUFBO0VBQ0Esa0NBQUE7RUFDQSwyQkFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxXQUFBO0VBQ0Esd0ZBQUE7QUFiRjtBQWVFO0VBQ0UscUJBQUE7QUFiSjtBQWdCRTtFQUNFLFdBQUE7RUFDQSxrQ0FBQTtBQWRKO0FBa0JBO0VBQ0UsZUFBQTtFQUNBLDJCQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxXQUFBO0FBaEJGO0FBa0JFO0VBQ0UsV0FBQTtBQWhCSjtBQW9CQTtFQUVFLGlDQUFBO0FBbkJGO0FBdUJBO0VBQ0UsZ0JBQUE7QUFyQkYiLCJmaWxlIjoibGl0ZS1icml0ZS1jaGFydC5jb21wb25lbnQubGVzcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExheW91dCBjb25zdGFudHNcbkBoZWFkZXItb2Zmc2V0OiAyMDBweDtcbkBzaWRlLXBhbmVsLW1pbi1oZWlnaHQ6IDIwMHB4O1xuQHNpZGUtcGFuZWwtc3BhY2luZzogODBweDtcblxuI2NvbnRhaW5lciB7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG4jc3ViY29udGFpbmVyIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiA2NiUgMzAlOyAvKjEwMC0yLTI9OTYqL1xuICBncmlkLWNvbHVtbi1nYXA6IDIlO1xufVxuc3ZnIHtcbiAgbWFyZ2luLXJpZ2h0OiAwcHg7XG59XG4jY2hhcnQge1xuICBvdmVyZmxvdzogaW5oZXJpdDtcbiAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gQGhlYWRlci1vZmZzZXQpO1xuICB3aWR0aDogMTAwJTtcbiAgLy8gb3V0bGluZTogMnB4IGRvdHRlZCByZWQ7XG59XG4jdGV4dC12aWV3ZXIge1xuICAvLyBvdXRsaW5lOiAycHggZG90dGVkIHJlZDtcbiAgLy8gaGVpZ2h0OiAxMDAlO1xuICAvLyBoZWlnaHQ6IDUwJTtcbiAgaGVpZ2h0OiBjYWxjKDQwdmggLSBAc2lkZS1wYW5lbC1zcGFjaW5nKTtcbiAgbWluLWhlaWdodDogQHNpZGUtcGFuZWwtbWluLWhlaWdodDtcbiAgd2lkdGg6IDEwMCU7XG4gIG92ZXJmbG93LXk6IHNjcm9sbDtcbiAgLy8gZm9udC1zaXplOiAwLjl2dztcbiAgZm9udC1zaXplOiAxLjAxdnc7XG59XG4jY2x1c3Rlci1zY2F0dGVycGxvdCB7XG4gIC8vIG91dGxpbmU6IDJweCBkb3R0ZWQgcmVkO1xuICAvLyBtYXJnaW4tdG9wOiAzJTtcbiAgbWFyZ2luLXRvcDogMnZoO1xuICAvLyBoZWlnaHQ6IDQyJTtcbiAgaGVpZ2h0OiBjYWxjKDQwdmggLSBAc2lkZS1wYW5lbC1zcGFjaW5nKTtcbiAgbWluLWhlaWdodDogQHNpZGUtcGFuZWwtbWluLWhlaWdodDtcbiAgd2lkdGg6IDEwMCU7XG59XG4udG9vbHRpcCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIHBhZGRpbmc6IDElO1xuICBwYWRkaW5nLXRvcDogMSUgIWltcG9ydGFudDtcbiAgbWFyZ2luOiBhdXRvO1xuICBmb250LWZhbWlseTogXCJFZmZyYSBSZ1wiICFpbXBvcnRhbnQ7XG4gIGZvbnQtc2l6ZTogMC44dncgIWltcG9ydGFudDtcbiAgcGFkZGluZy10b3A6IDBweDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgYm9yZGVyLXJhZGl1czogN3B4O1xuICBoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcbiAgYm94LXNoYWRvdzogcmdiYSg1MCwgNTAsIDEwNSwgMC4xNSkgMHB4IDJweCA3cHggMHB4LCByZ2JhKDAsIDAsIDAsIDAuMDUpIDBweCAxcHggMXB4IDBweDtcbn1cbiNyZWZyZXNoLWljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGZsb2F0OiByaWdodDtcbiAgcmlnaHQ6IDJ2dztcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4jc2VhcmNoLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAxdmg7XG4gIGxlZnQ6IDJ2dztcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjV2dztcbiAgei1pbmRleDogMTA7XG59XG5cbiNzZWFyY2gtaW5wdXQge1xuICBwYWRkaW5nOiAwLjV2dyAxdnc7XG4gIGZvbnQtZmFtaWx5OiBcIkVmZnJhIFJnXCIgIWltcG9ydGFudDtcbiAgZm9udC1zaXplOiAwLjh2dyAhaW1wb3J0YW50O1xuICBib3JkZXI6IDFweCBzb2xpZCAjZTBlMGUwO1xuICBib3JkZXItcmFkaXVzOiA3cHg7XG4gIGJhY2tncm91bmQ6IHdoaXRlO1xuICBvdXRsaW5lOiBub25lO1xuICB3aWR0aDogMjB2dztcbiAgYm94LXNoYWRvdzogcmdiYSg1MCwgNTAsIDEwNSwgMC4xNSkgMHB4IDJweCA3cHggMHB4LCByZ2JhKDAsIDAsIDAsIDAuMDUpIDBweCAxcHggMXB4IDBweDtcbiAgXG4gICY6Zm9jdXMge1xuICAgIGJvcmRlci1jb2xvcjogIzREN0Y3MTtcbiAgfVxuICBcbiAgJjo6cGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiAjOTk5O1xuICAgIGZvbnQtZmFtaWx5OiBcIkVmZnJhIEx0XCIgIWltcG9ydGFudDtcbiAgfVxufVxuXG4jY2xlYXItaWNvbiB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZm9udC1zaXplOiAxLjJ2dyAhaW1wb3J0YW50O1xuICB3aWR0aDogMS4ydnc7XG4gIGhlaWdodDogMS4ydnc7XG4gIGNvbG9yOiAjNjY2O1xuICBcbiAgJjpob3ZlciB7XG4gICAgY29sb3I6ICMzMzM7XG4gIH1cbn1cblxuLm1hdC1pY29uIHtcbiAgLy8gYmFja2dyb3VuZC1jb2xvcjogIzcwNzA3MDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZSAhaW1wb3J0YW50O1xuICAvLyBwb3NpdGlvbjogc3RpY2t5ICFpbXBvcnRhbnQ7XG59XG5cbi5wZW5zZWVzLXNlYXJjaCB7XG4gIGZvbnQtc2l6ZTogMC45dnc7XG59XG4iXX0= */"] });


/***/ }),

/***/ 98468:
/*!**************************************************************!*\
  !*** ./src/app/pensees-display/pensees-display.component.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PenseesDisplayComponent": () => (/* binding */ PenseesDisplayComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3184);

class PenseesDisplayComponent {
    constructor() { }
    ngOnInit() {
    }
}
PenseesDisplayComponent.ɵfac = function PenseesDisplayComponent_Factory(t) { return new (t || PenseesDisplayComponent)(); };
PenseesDisplayComponent.ɵcmp = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: PenseesDisplayComponent, selectors: [["app-pensees-display"]], decls: 3, vars: 0, consts: [[1, "outline-box"]], template: function PenseesDisplayComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "pensee's that are selected will go here");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: [".outline-box[_ngcontent-%COMP%] {\n  outline: 5px dotted red;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBlbnNlZXMtZGlzcGxheS5jb21wb25lbnQubGVzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLHVCQUFBO0FBQ0oiLCJmaWxlIjoicGVuc2Vlcy1kaXNwbGF5LmNvbXBvbmVudC5sZXNzIiwic291cmNlc0NvbnRlbnQiOlsiLm91dGxpbmUtYm94IHtcbiAgICBvdXRsaW5lOiA1cHggZG90dGVkIHJlZDtcbn0iXX0= */"] });


/***/ }),

/***/ 92340:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": () => (/* binding */ environment)
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ 14431:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 50318);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 36747);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 92340);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule)
    .catch(err => console.error(err));


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(14431)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map