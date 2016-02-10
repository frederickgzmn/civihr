define([
    'common/angular',
    'common/lodash',
    'common/moment',
    'common/angularMocks',
    'appraisals/app',
    'mocks/models/appraisal-cycle',
    'mocks/models/instances/appraisal-cycle-instance'
], function (angular, _, moment) {
    'use strict';

    describe('AppraisalCycle', function () {
        var $q, $rootScope, AppraisalCycle, AppraisalCycleMock, AppraisalCycleInstance, appraisalsAPI, cycles;


        beforeEach(module('appraisals', 'appraisals.mocks'));
        beforeEach(inject(['$q', '$rootScope', 'AppraisalCycle', 'AppraisalCycleMock', 'AppraisalCycleInstanceMock', 'api.appraisals',
            function (_$q_, _$rootScope_, _AppraisalCycle_, _AppraisalCycleMock_, _AppraisalCycleInstanceMock_, _appraisalsAPI_) {
                $q = _$q_;
                $rootScope = _$rootScope_;
                AppraisalCycle = _AppraisalCycle_;
                AppraisalCycleMock = _AppraisalCycleMock_;
                AppraisalCycleInstance = _AppraisalCycleInstanceMock_;
                appraisalsAPI = _appraisalsAPI_;

                cycles = AppraisalCycleMock.mockedCycles();
            }
        ]));

        it('has the expected api', function () {
            expect(Object.keys(AppraisalCycle)).toEqual([
                'active', 'all', 'create', 'find', 'grades', 'statuses',
                'statusOverview', 'total', 'types'
            ]);
        });

        describe('active()', function () {
            var activeCount;

            beforeEach(function () {
                activeCount = cycles.list.filter(function (cycle) {
                    return cycle.cycle_is_active;
                }).length;

                resolveApiCallTo('total').with(activeCount);
            });

            it('returns the active cycles', function (done) {
                AppraisalCycle.active().then(function (count) {
                    expect(appraisalsAPI.total).toHaveBeenCalledWith({ cycle_is_active: true });
                    expect(count).toEqual(activeCount);
                })
                .finally(done) && $rootScope.$digest();
            });
        });

        describe('statusOverview()', function () {
            beforeEach(function () {
                resolveApiCallTo('statusOverview').with([
                    {
                        status_id: 1,
                        status_name: "Awaiting self appraisal",
                        contacts_count: { due: 4, overdue: 2 }
                    },
                    {
                        status_id: 2,
                        status_name: "Awaiting manager appraisal",
                        contacts_count: { due: 10, overdue: 6 }
                    },
                    {
                        status_id: 3,
                        status_name: "Awaiting grade",
                        contacts_count: { due: 20, overdue: 12 }
                    },
                    {
                        status_id: 4,
                        status_name: "Awaiting HR approval",
                        contacts_count: { due: 7, overdue: 3 }
                    },
                    {
                        status_id: 5,
                        status_name: "Complete",
                        contacts_count: { due: 13, overdue: 8 }
                    }
                ]);
            });

            describe('API call', function () {
                it('calls the correct API method', function (done) {
                    AppraisalCycle.statusOverview().then(function (overview) {
                        expect(appraisalsAPI.statusOverview).toHaveBeenCalled();
                    })
                    .finally(done) && $rootScope.$digest();
                });

                it('passes a date to the API method', function (done) {
                    AppraisalCycle.statusOverview().then(function (overview) {
                        var date = appraisalsAPI.statusOverview.calls.argsFor(0)[0].current_date;

                        expect(moment(date, 'YYYY-MM-DD').isValid()).toBe(true);
                    })
                    .finally(done) && $rootScope.$digest();
                });

                describe('current_date argument', function () {
                    var p;

                    describe('when it is not passed', function () {
                        beforeEach(function () {
                            jasmine.clock().mockDate(new Date(2016, 11, 2));

                            p = AppraisalCycle.statusOverview();
                        })

                        it('calls the API method with the actual current date', function (done) {
                            p.then(function (overview) {
                                expect(appraisalsAPI.statusOverview).toHaveBeenCalledWith({ current_date: '2016-12-02' });
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });

                    describe('when it is passed', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.statusOverview({ current_date: '2015-10-11' });
                        })

                        it('calls the API method with it', function (done) {
                            p.then(function (overview) {
                                expect(appraisalsAPI.statusOverview).toHaveBeenCalledWith({ current_date: '2015-10-11' });
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });
                });

                describe('start_date and end_date arguments', function () {
                    var p;

                    describe('when they are not passed', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.statusOverview();
                        })

                        it('calls the API method without them', function (done) {
                            p.then(function (overview) {
                                expect(appraisalsAPI.statusOverview).not.toHaveBeenCalledWith(jasmine.objectContaining({
                                    start_date: jasmine.any(String),
                                    end_date: jasmine.any(String)
                                }));
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });

                    describe('when they are passed', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.statusOverview({
                                start_date: '2016-03-25',
                                end_date: '2016-05-25',
                            });
                        })

                        it('calls the API method with them', function (done) {
                            p.then(function (overview) {
                                expect(appraisalsAPI.statusOverview).toHaveBeenCalledWith(jasmine.objectContaining({
                                    start_date: '2016-03-25',
                                    end_date: '2016-05-25'
                                }));
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });
                });

                describe('cycles_ids argument', function () {
                    var p;

                    describe('when it is not passed', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.statusOverview();
                        })

                        it('calls the API method without it', function (done) {
                            p.then(function (overview) {
                                expect(appraisalsAPI.statusOverview).not.toHaveBeenCalledWith(jasmine.objectContaining({
                                    cycles_ids: jasmine.any(String)
                                }));
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });

                    describe('when it is passed', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.statusOverview({ cycles_ids: '3543,7654,6363,4534' });
                        })

                        it('calls the API method with it', function (done) {
                            p.then(function (overview) {
                                expect(appraisalsAPI.statusOverview).toHaveBeenCalledWith(jasmine.objectContaining({
                                    cycles_ids: '3543,7654,6363,4534'
                                }));
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });
                });
            });

            it('contains the list of steps and the total number of appraisals', function (done) {
                AppraisalCycle.statusOverview().then(function (overview) {
                    expect(Object.keys(overview)).toEqual(['steps', 'totalAppraisalsNumber']);
                    expect(Object.keys(overview.steps).length).toEqual(5);
                    expect(overview.totalAppraisalsNumber).toEqual(85);
                })
                .finally(done) && $rootScope.$digest();
            });

            it('normalizes the steps list', function (done) {
                AppraisalCycle.statusOverview().then(function (overview) {
                    expect(Object.keys(overview.steps)).toEqual(['1', '2', '3', '4', '5'])
                    expect(Object.keys(overview.steps['1'])).toEqual(['name', 'due', 'overdue']);
                })
                .finally(done) && $rootScope.$digest();
            });

            it('retains the data for each step', function (done) {
                AppraisalCycle.statusOverview().then(function (overview) {
                    expect(overview.steps['2'].due).toEqual(10);
                    expect(overview.steps['2'].overdue).toEqual(6);
                })
                .finally(done) && $rootScope.$digest();
            });
        });

        describe('grades()', function () {
            beforeEach(function () {
                resolveApiCallTo('grades').with([
                    { label: '1', value: 30 },
                    { label: '2', value: 10 },
                    { label: '3', value: 55 },
                    { label: '4', value: 87 },
                    { label: '5', value: 54 }
                ]);
            });

            it('returns the grades data', function (done) {
                AppraisalCycle.grades().then(function (grades) {
                    expect(appraisalsAPI.grades).toHaveBeenCalled();

                    expect(grades.length).toEqual(5);
                    expect(Object.keys(grades[0])).toEqual(['label', 'value']);
                    expect(grades[0].label).toEqual('1');
                    expect(grades[0].value).toEqual(30);
                })
                .finally(done) && $rootScope.$digest();
            });
        });

        describe('types()', function () {
            beforeEach(function () {
                resolveApiCallTo('types').with([
                    { id: '1', label: 'type 1', value: '1', weight: '1' },
                    { id: '2', label: 'type 2', value: '2', weight: '2' },
                    { id: '3', label: 'type 3', value: '3', weight: '3' }
                ]);
            });

            it('returns the appraisal cycle types', function (done) {
                AppraisalCycle.types().then(function (types) {
                    expect(appraisalsAPI.types).toHaveBeenCalled();

                    expect(types.length).toEqual(3);
                    expect(types).toEqual([
                        { label: 'type 1', value: '1' },
                        { label: 'type 2', value: '2' },
                        { label: 'type 3', value: '3' }
                    ]);
                })
                .finally(done) && $rootScope.$digest();
            });
        })

        describe('statuses()', function () {
            beforeEach(function () {
                resolveApiCallTo('statuses').with([
                    { id: '1', label: 'status 1', value: '1', weight: '1' },
                    { id: '2', label: 'status 2', value: '2', weight: '2' }
                ]);
            });

            it('returns the appraisal cycle statuses', function (done) {
                AppraisalCycle.statuses().then(function (statuses) {
                    expect(appraisalsAPI.statuses).toHaveBeenCalled();

                    expect(statuses.length).toEqual(2);
                    expect(statuses).toEqual([
                        { label: 'status 1', value: '1' },
                        { label: 'status 2', value: '2' }
                    ]);
                })
                .finally(done) && $rootScope.$digest();
            });
        });

        describe('create()', function () {
            var newCycle = {
                name: 'new cycle',
                type: 'type 4',
                cycle_start_date: '01/01/2014',
                cycle_end_date: '01/01/2015'
            };

            beforeEach(function () {
                resolveApiCallTo('create').with(null);
            });

            it('creates a new appraisal cycle', function (done) {
                AppraisalCycle.create(newCycle).then(function () {
                    expect(appraisalsAPI.create).toHaveBeenCalled();
                })
                .finally(done) && $rootScope.$digest();
            });

            it('sanitizes the data via instance before calling the api', function (done) {
                var sanitizedData = AppraisalCycleInstance.init(newCycle).toAPI();

                AppraisalCycle.create(newCycle).then(function () {
                    expect(appraisalsAPI.create).toHaveBeenCalledWith(sanitizedData);
                })
                .finally(done) && $rootScope.$digest();
            });

            it('returns an instance of the model', function (done) {
                AppraisalCycle.create(newCycle).then(function (savedCycle) {
                    expect(AppraisalCycleInstance.isInstance(savedCycle)).toBe(true);
                })
                .finally(done) && $rootScope.$digest();
            });
        });

        describe('all()', function () {
            describe('instances', function () {
                beforeEach(function () {
                    resolveApiCallTo('all').with(cycles);
                });

                it('returns a list of model instances', function (done) {
                    AppraisalCycle.all().then(function (cycles) {
                        expect(cycles.list.every(function (cycle) {
                            return AppraisalCycleInstance.isInstance(cycle);
                        })).toBe(true);
                    })
                    .finally(done) && $rootScope.$digest();
                });
            });

            describe('when called without arguments', function () {
                beforeEach(function () {
                    resolveApiCallTo('all').with(cycles);
                });

                it('returns all appraisal cycles', function (done) {
                    AppraisalCycle.all().then(function (cycles) {
                        expect(appraisalsAPI.all).toHaveBeenCalled();
                        expect(cycles.list.length).toEqual(10);
                    })
                    .finally(done) && $rootScope.$digest();
                });
            });

            describe('when called with filters', function () {
                var p;

                describe('falsey values', function () {
                    beforeEach(function () {
                        resolveApiCallTo('all').with({
                            list: cycles.list,
                            total: cycles.count
                        });
                    });

                    beforeEach(function () {
                        p = AppraisalCycle.all({
                            filter_1: 'a non-empty string',
                            filter_2: '',
                            filter_3: 456,
                            filter_4: 0,
                            filter_5: undefined,
                            filter_6: { foo: 'foo' },
                            filter_7: null,
                            filter_8: {},
                            filter_9: false
                        });
                    });

                    it('skips falsey (null, undefined, empty string), except for 0', function (done) {
                        p.then(function () {
                            expect(appraisalsAPI.all).toHaveBeenCalledWith({
                                filter_1: 'a non-empty string',
                                filter_3: 456,
                                filter_4: 0,
                                filter_6: { foo: 'foo' },
                                filter_8: {},
                                filter_9: false
                            }, undefined);
                        })
                        .finally(done) && $rootScope.$digest();
                    });
                });

                describe('simple filter', function () {
                    var filtered = null;
                    var typeFilter = 'Type #3';

                    beforeEach(function () {
                        resolveApiCallTo('all').with((function () {
                            filtered = cycles.list.filter(function (cycle) {
                                return cycle.type === typeFilter;
                            });

                            return { list: filtered, total: filtered.length };
                        })());
                    });

                    it('can filter the appraisal cycles list', function (done) {
                        AppraisalCycle.all({
                            type: typeFilter
                        }).then(function (cycles) {
                            expect(appraisalsAPI.all).toHaveBeenCalledWith({ type: typeFilter }, undefined);
                            expect(cycles.list.length).toEqual(filtered.length);
                        })
                        .finally(done) && $rootScope.$digest();
                    });
                });

                describe('date filters', function () {
                    beforeEach(function () {
                        resolveApiCallTo('all').with({
                            list: cycles.list,
                            total: cycles.count
                        });
                    });

                    describe('filter names', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.all({
                                cycle_start_date_from: jasmine.any(Date),
                                cycle_self_appraisal_due_to: jasmine.any(Date),
                                cycle_manager_appraisal_due_to: jasmine.any(Date),
                                cycle_grade_due_from: jasmine.any(Date)
                            });
                        });

                        it('converts the filter names to the correct api parameter names', function (done) {
                            p.then(function () {
                                expect(appraisalsAPI.all).toHaveBeenCalledWith({
                                    cycle_start_date: jasmine.any(Object),
                                    cycle_self_appraisal_due: jasmine.any(Object),
                                    cycle_manager_appraisal_due: jasmine.any(Object),
                                    cycle_grade_due: jasmine.any(Object)
                                }, undefined);
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });

                    describe('when searching only by "from" date', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.all({
                                cycle_start_date_from: '01/09/2016'
                            });
                        });

                        it('provides the API with the correct filter values', function (done) {
                            p.then(function () {
                                expect(appraisalsAPI.all).toHaveBeenCalledWith({
                                    cycle_start_date: { '>=': '2016-09-01' }
                                }, undefined);
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });

                    describe('when searching only by "to" date', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.all({
                                cycle_grade_due_to: '22/10/2016'
                            });
                        })

                        it('provides the API with the correct filter values', function (done) {
                            p.then(function () {
                                expect(appraisalsAPI.all).toHaveBeenCalledWith({
                                    cycle_grade_due: { '<=': '2016-10-22' }
                                }, undefined);
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });

                    describe('when searching both by "from" and "to" date', function () {
                        beforeEach(function () {
                            p = AppraisalCycle.all({
                                cycle_manager_appraisal_due_from: '01/09/2016',
                                cycle_manager_appraisal_due_to: '22/10/2016'
                            });
                        })

                        it('provides the API with the correct filter values', function (done) {
                            p.then(function () {
                                expect(appraisalsAPI.all).toHaveBeenCalledWith({
                                    cycle_manager_appraisal_due: { '>=': '2016-09-01' },
                                    cycle_manager_appraisal_due: { '<=': '2016-10-22' }
                                }, undefined);
                            })
                            .finally(done) && $rootScope.$digest();
                        });
                    });
                });
            });

            describe('when called with pagination', function () {
                var pagination = { page: 3, size: 2 };

                beforeEach(function () {
                    var start = pagination.page * pagination.size;
                    var end = start + pagination.size;

                    resolveApiCallTo('all').with((function () {
                        var paginated = cycles.list.slice(start, end);

                        return { list: paginated, total: paginated.length };
                    })());
                });

                it('can paginate the appraisla cycles list', function (done) {
                    AppraisalCycle.all(null, pagination).then(function (cycles) {
                        expect(appraisalsAPI.all).toHaveBeenCalledWith(null, pagination);
                        expect(cycles.list.length).toEqual(2);
                    })
                    .finally(done) && $rootScope.$digest();
                });
            });
        });

        describe('find()', function () {
            var targetId = '4217';

            beforeEach(function () {
                resolveApiCallTo('find').with(cycles.list.filter(function (cycle) {
                    return cycle.id === targetId;
                })[0]);
            });

            it('finds a cycle by id', function (done) {
                AppraisalCycle.find(targetId).then(function (cycle) {
                    expect(appraisalsAPI.find).toHaveBeenCalledWith(targetId);
                    expect(cycle.id).toBe('4217');
                    expect(cycle.cycle_type_id).toBe('2');
                })
                .finally(done) && $rootScope.$digest();
            });

            it('returns an instance of the model', function (done) {
                AppraisalCycle.find(targetId).then(function (cycle) {
                    expect(AppraisalCycleInstance.isInstance(cycle)).toBe(true);
                })
                .finally(done) && $rootScope.$digest();
            });
        });

        describe('total()', function () {
            beforeEach(function () {
                resolveApiCallTo('total').with(cycles.list.length);
            });

            it('gets the total number of cycles', function (done) {
                AppraisalCycle.total().then(function (total) {
                    expect(appraisalsAPI.total).toHaveBeenCalled();
                    expect(total).toBe(cycles.list.length);
                })
                .finally(done) && $rootScope.$digest();
            });
        });

        /**
         * Adds a `spyOn` on the given `appraisalsApi` method, and then returns
         * an object with a `.with()` method, which receives the value the
         * stubbed method must respond with
         *
         * @param {string} method
         * @return {object}
         */
        function resolveApiCallTo(method) {
            var spy = spyOn(appraisalsAPI, method);

            return {

                /**
                 * Creates a fake call for the stubbed method, that
                 * returns a promise which resolves with the given value
                 *
                 * @param {any} value
                 * @return {Promise}
                 */
                with: function (value) {
                    spy.and.callFake(function () {
                        var deferred = $q.defer();
                        deferred.resolve(value);

                        return deferred.promise;
                    });
                }
            };
        }
    });
});