define([
    'common/angular',
    'common/lodash',
    'common/moment',
    'common/angularMocks',
    'common/mocks/services/hr-settings-mock',
    'common/mocks/services/api/appraisal-cycle-mock',
    'appraisals/app',
    'mocks/models/instances/appraisal-cycle-instance'
], function (angular, _, moment) {
    'use strict';

    describe('AppraisalCycleModalCtrl', function () {
        var $compile, $controller, $q, $modalInstance, $provide, $rootScope, $scope,
            $templateCache, AppraisalCycle, AppraisalCycleInstance, appraisalCycleAPIMock,
            ctrl, dialog, validCycle;

        validCycle = {
            cycle_name: 'Appraisal Cycle #1',
            cycle_type_id: '1',
            cycle_is_active: true,
            cycle_start_date: moment('2015-01-01').toDate(),
            cycle_end_date: moment('2015-12-31').toDate(),
            cycle_self_appraisal_due: moment('2016-01-31').toDate(),
            cycle_manager_appraisal_due: moment('2016-02-28').toDate(),
            cycle_grade_due: moment('2016-03-30').toDate()
        };

        beforeEach(function () {
            module('appraisals', 'common.mocks', 'appraisals.mocks', 'appraisals.templates', function (_$provide_) {
                $provide = _$provide_;
            });
            // Override api.appraisal-cycle with the mocked version
            inject([
                'api.appraisal-cycle.mock', 'HR_settingsMock',
                function (_appraisalCycleAPIMock_, HR_settingsMock) {
                    appraisalCycleAPIMock = _appraisalCycleAPIMock_;

                    $provide.value('api.appraisal-cycle', appraisalCycleAPIMock);
                    $provide.value('HR_settings', HR_settingsMock);
                }
            ]);
        });
        beforeEach(inject(function (_$compile_, _$controller_, _$q_, _$rootScope_, _$templateCache_, _AppraisalCycle_, _AppraisalCycleInstanceMock_, _dialog_) {
            $compile = _$compile_;
            $controller = _$controller_;
            $q = _$q_;
            $modalInstance = jasmine.createSpyObj('modalInstance', ['close']);
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            $templateCache = _$templateCache_;

            AppraisalCycle = _AppraisalCycle_;
            AppraisalCycleInstance = _AppraisalCycleInstanceMock_;
            dialog = _dialog_;

            spyOn(AppraisalCycle, 'types').and.callThrough();
            spyOn(AppraisalCycle, 'find').and.callThrough();

            initController();
        }));

        describe('inheritance', function () {
            it('inherits from BasicModalCtrl', function () {
                expect(ctrl.cancel).toBeDefined();
            });
        });

        describe('init', function () {
            it('marks the form as not submitted', function () {
                expect(ctrl.formSubmitted).toBe(false);
            });

            it('has an empty list of form errors', function () {
                expect(ctrl.formErrors).toEqual({});
            });

            describe('cycle types list', function () {
                it('waits for data to be loaded', function () {
                    expect(ctrl.loaded.types).toBe(false);
                });

                it('requests the list to the model', function () {
                    expect(AppraisalCycle.types).toHaveBeenCalled();
                });

                describe('when the model returns the data', function () {
                    beforeEach(function () {
                        $rootScope.$digest();
                    });

                    it('marks the list as loaded', function () {
                        expect(ctrl.loaded.types).toBe(true);
                    });
                });
            });

            describe('when in "create mode"', function () {
                it('marks the flag as such', function () {
                    expect(ctrl.edit).toBe(false);
                });

                it('does not fetch the data of any cycle', function () {
                    expect(AppraisalCycle.find).not.toHaveBeenCalled();
                    expect(ctrl.cycle).toEqual({});
                    expect(ctrl.loaded.cycle).toBe(true);
                });
            });

            describe('when in "edit mode', function () {
                var $scope;

                beforeEach(function () {
                    $scope = $rootScope.$new();
                    $scope.cycleId = '6';

                    initController({ $scope: $scope });
                });

                it('marks the flag as such', function () {
                    expect(ctrl.edit).toBe(true);
                });

                it('waits for the cycle to be loaded', function () {
                    expect(ctrl.loaded.cycle).toBe(false);
                });

                it('fetches the data of the cycle with the given id', function () {
                    expect(AppraisalCycle.find).toHaveBeenCalledWith($scope.cycleId);
                });

                describe('when the model returns the data', function () {
                    beforeEach(function () {
                        $rootScope.$digest();
                    });

                    it('marks the cycle as loaded', function () {
                        expect(ctrl.loaded.cycle).toBe(true);
                    });
                });
            })
        });

        describe('form validation', function () {
            beforeEach(function () {
                spyOn(AppraisalCycle, 'create').and.callThrough();
                initForm();
            });

            describe('valid data', function () {
                beforeEach(function () {
                    submitFormWith(validCycle);
                });

                it('submits the form when validation is passed', function () {
                    expect(ctrl.form.$valid).toBe(true);
                    expect(AppraisalCycle.create).toHaveBeenCalled();
                });
            });

            describe('mandatory fields', function () {
                beforeEach(function () {
                    submitFormWith(_.omit(validCycle, ['cycle_name', 'cycle_grade_due']));
                });

                it('must be present', function () {
                    expect(ctrl.form.$valid).toBe(false);
                    expect(ctrl.form.cycle_name.$error.required).toBe(true);
                    expect(ctrl.form.cycle_grade_due.$error.required).toBe(true);
                    expect(AppraisalCycle.create).not.toHaveBeenCalled();
                });
            });

            describe('end date', function () {
                beforeEach(function () {
                    submitFormWith(_.assign({}, validCycle, {
                        cycle_end_date: moment('2014-12-31').toDate()
                    }));
                });

                it('end date must be after end date', function () {
                    expect(ctrl.form.$valid).toBe(false);
                    expect(ctrl.form.cycle_end_date.$error.isAfter).toBe(true);
                    expect(AppraisalCycle.create).not.toHaveBeenCalled();
                });
            });

            describe('manager appraisal due date', function () {
                beforeEach(function () {
                    submitFormWith(_.assign({}, validCycle, {
                        cycle_manager_appraisal_due: moment('2016-01-05').toDate()
                    }));
                });

                it('manager appraisal due date must be after self appraisal due date', function () {
                    expect(ctrl.form.$valid).toBe(false);
                    expect(ctrl.form.cycle_manager_appraisal_due.$error.isAfter).toBe(true);
                    expect(AppraisalCycle.create).not.toHaveBeenCalled();
                });
            });

            describe('grade due date', function () {
                beforeEach(function () {
                    submitFormWith(_.assign({}, validCycle, {
                        cycle_grade_due: moment('2016-02-10').toDate()
                    }));
                });

                it('grade due date must be after manager appraisal due date', function () {
                    expect(ctrl.form.$valid).toBe(false);
                    expect(ctrl.form.cycle_grade_due.$error.isAfter).toBe(true);
                    expect(AppraisalCycle.create).not.toHaveBeenCalled();
                });
            });
        });

        describe('form errors', function () {
            var cycleWithErrors = _.assign({}, validCycle, {
                cycle_name: '',
                cycle_end_date: moment('2014-12-31').toDate(),
                cycle_grade_due: '',
                cycle_manager_appraisal_due: moment('2016-01-20').toDate()
            });

            beforeEach(function () {
                initForm();
                submitFormWith(cycleWithErrors);
            });

            it('returns the list of fields, each with its own errors', function () {
                expect(ctrl.formErrors).toEqual({
                    cycle_name: { required: true },
                    cycle_end_date: { isAfter: true },
                    cycle_grade_due: { required: true, isAfter: true },
                    cycle_manager_appraisal_due: { isAfter: true }
                })
            });
        });

        describe('form submit', function () {
            beforeEach(function () {
                initForm();
                spyOn($rootScope, '$emit');
            });

            describe('submit status', function () {
                beforeEach(function () {
                    submitFormWith(validCycle);
                });

                it('marks the form as submitted', function () {
                    expect(ctrl.formSubmitted).toBe(true);
                });
            });

            describe('when in "create mode', function () {
                beforeEach(function () {
                    spyOn(AppraisalCycle, 'create').and.callThrough();
                    submitFormWith(validCycle);
                });

                it('sends a request to the api with the new cycle data', function () {
                    expect(AppraisalCycle.create).toHaveBeenCalledWith(validCycle);
                });

                it('emits an event', function () {
                    expect($rootScope.$emit).toHaveBeenCalledWith('AppraisalCycle::new', jasmine.any(Object));
                });

                it('closes the modal', function () {
                    expect($modalInstance.close).toHaveBeenCalled();
                });
            });

            describe('when in "edit mode"', function () {
                var editedCycle;

                beforeEach(function () {
                    $scope = $rootScope.$new();
                    $scope.cycleId = '4217';

                    initController({ $scope: $scope });
                    initForm();

                    $rootScope.$digest();
                    spyOn(ctrl.cycle, 'update').and.callThrough();
                });

                beforeEach(function () {
                    editedCycle = _.assign({}, getMockedCycleFormFields($scope.cycleId), {
                        cycle_name: 'Amended name',
                        cycle_type_id: '2'
                    });
                });

                describe('basic tests', function () {
                    beforeEach(function () {
                        submitFormWith(editedCycle);
                    });

                    it('triggers the update on the model instance', function () {
                        expect(ctrl.cycle.update).toHaveBeenCalled();
                    });

                    it('closes the modal', function () {
                        expect($modalInstance.close).toHaveBeenCalled();
                    });

                    describe('event', function () {
                        it('is emitted', function () {
                            expect($rootScope.$emit).toHaveBeenCalledWith('AppraisalCycle::edit', jasmine.any(Object));
                        });

                        it('gets the same cycle object passed as parameter', function () {
                            expect($rootScope.$emit.calls.argsFor(0)[1]).toBe(ctrl.cycle);
                        });
                    });
                });

                describe('dialog for due dates change', function () {
                    var editedWithNewDueDates;

                    beforeEach(function () {
                        editedWithNewDueDates = _.assign({}, editedCycle, {
                            cycle_grade_due: moment('2016-08-11').toDate()
                        });
                    });

                    describe('when leaving the due dates unchanged', function () {
                        beforeEach(function () {
                            resolveDialogWith(null);
                            submitFormWith(editedCycle);
                        });

                        it('does not show a confirmation dialog', function () {
                            expect(dialog.open).not.toHaveBeenCalled();
                        });
                    });

                    describe('when changing the due dates', function () {
                        describe('basic tests', function () {
                            beforeEach(function () {
                                resolveDialogWith(null);
                                submitFormWith(editedWithNewDueDates);
                            });

                            it('shows a confirmation dialog', function () {
                                expect(dialog.open).toHaveBeenCalled();
                            });
                        });

                        describe('when the dialog is dismissed', function () {
                            beforeEach(function () {
                                resolveDialogWith(false);
                                submitFormWith(editedWithNewDueDates);
                            });

                            it('does not perform the update', function () {
                                expect(ctrl.cycle.update).not.toHaveBeenCalled();
                            });
                        });

                        describe('when the dialog is confirmed', function () {
                            beforeEach(function () {
                                resolveDialogWith(true);
                                submitFormWith(editedWithNewDueDates);
                            });

                            it('performs the update', function () {
                                expect(ctrl.cycle.update).toHaveBeenCalled();
                            });
                        });
                    });
                });

                /**
                 * Fetches the mocked cycle with the given id, initializes it
                 * as an instance (since the mocked cycle simulates the data)
                 * coming from the API), and then return its attributes minus
                 * the default ones (which do not have equivalent fields in the form)
                 *
                 * @param {string} id
                 * @return {Object}
                 */
                function getMockedCycleFormFields(id) {
                    var cycle = AppraisalCycleInstance.init(_.find(appraisalCycleAPIMock.mockedCycles().list, function (cycle) {
                        return cycle.id === id;
                    }), true);

                    return _.omit(cycle.attributes(), Object.keys(cycle.defaultCustomData()));
                }
            });
        });

        /**
         * Initializes the controller with additional injected values
         *
         * @param {object} params - The values to inject in the controller
         */
        function initController(params) {
            ctrl = $controller('AppraisalCycleModalCtrl', angular.extend({}, {
                $uibModalInstance: $modalInstance,
                $scope: $scope,
                AppraisalCycle: AppraisalCycle
            }, params));
        }

        /**
         * Initializes the form the modal controller is tied to.
         *
         * It is necessary to remove the reference to the datepicker directive
         * otherwise it will interfere with the direct insertions of values
         * in the fields the directive it is applied to
         *
         * It compiles it against a scope and then assigns it to the
         * internal `form` property (because of the "controller as" syntax)
         */
        function initForm() {
            var template = $templateCache.get(CRM.vars.appraisals.baseURL + '/views/modals/appraisal-cycle.html');
            template = template.replace(/datepicker-popup=(.+) ?/g, '');

            var $scope = $rootScope.$new();
            $scope.modal = { loaded: { types: true, cycle: true } };

            $compile(angular.element(template))($scope);

            ctrl.form = $scope.modal.form;
        }

        /**
         * Spyes on dialog.open() method and resolves it with the given value
         *
         * @param {any} value
         */
        function resolveDialogWith(value) {
            var spy;

            if (typeof dialog.open.calls !== 'undefined') {
                spy = dialog.open;
            } else {
                spy = spyOn(dialog, 'open');
            }

            spy.and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(value);

                return deferred.promise;
            });;
        }

        /**
         * Prepares the form with the given values and then runs the digest
         * cycles
         *
         * @param {object} formValues
         */
        function submitFormWith(formValues) {
            _.forEach(_.omit(formValues, 'id'), function (value, field) {
                ctrl.form[field].$setViewValue(value);
            }) && $rootScope.$digest();

            if (!ctrl.edit) {
                ctrl.cycle = formValues;
            } else {
                ctrl.cycle = _.assign(ctrl.cycle, formValues);
            }

            ctrl.submit();
            $rootScope.$digest();
        }
    });
});
