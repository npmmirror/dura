import {createDuraCore} from "../src";

describe("demo", () => {

    it("replace model", function () {
        const defaultModel = {
            namespace: "default",
            initialState: {
                name: "张三"
            }
        };

        const nextModel = {
            namespace: "next",
            initialState: {
                address: "江苏省南京市"
            }
        };

        const duraCore = createDuraCore({
            models: [defaultModel]
        });

        expect(duraCore.reduxStore.getState()["default"]).toEqual(defaultModel.initialState);
        expect(duraCore.reduxStore.getState()["next"]).toBeUndefined();

        duraCore.replaceModel([nextModel],function () {
            console.log("hello")
        });

        expect(duraCore.reduxStore.getState()["default"]).toBeUndefined();
        expect(duraCore.reduxStore.getState()["next"]).toEqual(nextModel.initialState);

        duraCore.replaceModel();

        expect(duraCore.reduxStore.getState()["default"]).toBeUndefined();

    });

    it("empty create", function () {

        const duraCore = createDuraCore({});
        expect(duraCore.reduxStore.getState()["@@duraCore"]).toEqual(0);

        const duraCoreTwo = createDuraCore();
        expect(duraCoreTwo.reduxStore.getState()["@@duraCore"]).toEqual(0);

    });

    it("dispatch reducers", function () {

        const initialState = {
            name: "张三",
            age: 12
        };

        const model = {
            namespace: "user",
            initialState: {...initialState},
            reducers: {
                onChangeName: function (state, action) {
                    return {...state, name: action?.payload?.name};
                }
            }
        };

        const duraCore = createDuraCore({
            models: [model]
        });

        expect(duraCore.reduxStore.getState()["user"]).toEqual(initialState);

        duraCore.reduxStore.dispatch({
            type: "user/reducers/onChangeName",
            payload: {name: "李四"}
        });

        expect(duraCore.reduxStore.getState()["user"]).toEqual({name: "李四", age: 12});
    });

    it("dispatch effects", function (done) {
        const initialState = {
            name: "张三",
            age: 12
        };

        const model = {
            namespace: "user",
            initialState: {...initialState},
            reducers: {
                onChangeName: function (state, action) {
                    return {...state, name: action?.payload?.name};
                }
            },
            effects: {
                enhanceName: function* ({put, delay}, action) {
                    yield delay(500);
                    const newName = "enhanceName" + action?.payload?.name;
                    yield put({
                        type: "user/reducers/onChangeName",
                        payload: {name: newName}
                    });
                }
            }
        };

        const duraCore = createDuraCore({
            models: [model]
        });

        expect(duraCore.reduxStore.getState()["user"]).toEqual(initialState);

        duraCore.reduxStore.dispatch({
            type: "user/effects/enhanceName",
            payload: {name: "李四"}
        });

        setTimeout(() => {
            expect(duraCore.reduxStore.getState()["user"]).toEqual({
                name: "enhanceName李四",
                age: 12
            });
            done();
        }, 1000);
    });


    it("array default effect ", function () {
        const defaultModel = {
                namespace: "default",
                initialState: {
                    name: "张三"
                },
                reducers: {
                    onChangeName(state, action) {
                        return {...state, name: action?.payload?.name || undefined};
                    }
                },
                effects: {
                    onChangeName: [
                        function* ({put}, action) {
                            yield put({
                                type: "default/reducers/onChangeName",
                                payload: action?.payload
                            });
                        }
                    ]
                }
            },
            stringModel = {
                namespace: "string",
                initialState: {
                    type: "string"
                },
                reducers: {
                    onChangeType(state, action) {
                        return {...state, type: action?.payload?.type};
                    }
                },
                effects: {
                    onChangeType: [
                        function* ({put}, action) {
                            yield put({
                                type: "string/reducers/onChangeType",
                                payload: action?.payload
                            });
                        },
                        "takeEvery"
                    ]
                }
            },
            objectModel = {
                namespace: "object",
                initialState: {
                    object: false
                },
                reducers: {
                    onChangeObject(state, action) {
                        return {...state, object: action?.payload?.object};
                    }
                },
                effects: {
                    onChangeObject: [
                        function* ({put}, action) {
                            yield put({
                                type: "object/reducers/onChangeObject",
                                payload: action?.payload
                            });
                        },
                        {type: "takeEvery"}
                    ]
                }
            },
            emptyModel = {
                namespace: "empty",
                initialState: {
                    empty: false
                },
                reducers: {
                    onChangeEmpty: function (state, action) {
                        return {...state, empty: action?.payload?.empty};
                    }
                },
                effects: {
                    onChangeEmpty: [
                        function* ({put}, action) {
                            yield put({
                                type: "empty/reducers/onChangeEmpty",
                                payload: action?.payload
                            });
                        },
                        {}
                    ]
                }
            };

        const duraCore = createDuraCore({
            models: [defaultModel, stringModel, objectModel, emptyModel]
        });

        expect(duraCore.reduxStore.getState()["default"]).toEqual(defaultModel.initialState);
        expect(duraCore.reduxStore.getState()["string"]).toEqual(stringModel.initialState);
        expect(duraCore.reduxStore.getState()["object"]).toEqual(objectModel.initialState);
        expect(duraCore.reduxStore.getState()["empty"]).toEqual(emptyModel.initialState);

        duraCore.reduxStore.dispatch({
            type: "empty/effects/onChangeEmpty",
            payload: {
                empty: true
            }
        });

        duraCore.reduxStore.dispatch({
            type: "default/effects/onChangeName",
            payload: {
                name: "李四"
            }
        });

        duraCore.reduxStore.dispatch({
            type: "string/effects/onChangeType",
            payload: {
                type: "number"
            }
        });

        duraCore.reduxStore.dispatch({
            type: "object/effects/onChangeObject",
            payload: {
                object: true
            }
        });

        expect(duraCore.reduxStore.getState()["empty"]).toEqual({empty: true});
        expect(duraCore.reduxStore.getState()["object"]).toEqual({object: true});
        expect(duraCore.reduxStore.getState()["default"]).toEqual({name: "李四"});
        expect(duraCore.reduxStore.getState()["string"]).toEqual({type: "number"});
    });

    it("takeLatest effects", function (done) {
        const takeLatestModel = {
            namespace: "takeLatest",
            initialState: {
                name: "张三"
            },
            reducers: {
                onChangeName(state, action) {
                    return {...state, name: action?.payload?.name};
                }
            },
            effects: {
                onChangeName: [
                    function* ({put, delay}, action) {
                        yield delay(1000);
                        yield put({
                            type: "takeLatest/reducers/onChangeName",
                            payload: action?.payload
                        });
                    },
                    "takeLatest"
                ]
            }
        };

        const duraCore = createDuraCore({
            models: [takeLatestModel]
        });

        expect(duraCore.reduxStore.getState()["takeLatest"]).toEqual(
            takeLatestModel.initialState
        );

        for (let i = 0; i < 10; i++) {
            const targetAction = {
                type: "takeLatest/effects/onChangeName",
                payload: {
                    name: `新名称${i}`
                }
            };
            duraCore.reduxStore.dispatch(targetAction);
            expect(duraCore.reduxStore.getState()["takeLatest"]).toEqual(
                takeLatestModel.initialState
            );
        }

        setTimeout(
            () =>
                expect(duraCore.reduxStore.getState()["takeLatest"]).toEqual(
                    takeLatestModel.initialState
                ),
            998
        );

        setTimeout(() => {
            expect(duraCore.reduxStore.getState()["takeLatest"]).toEqual({name: "新名称9"});
            done();
        }, 2000);
    });

    it("takeLeading effects", function (done) {
        const takeLeadingModel = {
            namespace: "takeLeading",
            initialState: {
                name: "张三"
            },
            reducers: {
                onChangeName(state, action) {
                    return {...state, name: action?.payload?.name};
                }
            },
            effects: {
                onChangeName: [
                    function* ({put, delay}, action) {
                        yield delay(1000);
                        yield put({
                            type: "takeLeading/reducers/onChangeName",
                            payload: action?.payload
                        });
                    },
                    "takeLeading"
                ]
            }
        };

        const duraCore = createDuraCore({
            models: [takeLeadingModel]
        });

        expect(duraCore.reduxStore.getState()["takeLeading"]).toEqual(
            takeLeadingModel.initialState
        );

        for (let i = 0; i < 10; i++) {
            const targetAction = {
                type: "takeLeading/effects/onChangeName",
                payload: {
                    name: `新名称${i}`
                }
            };
            duraCore.reduxStore.dispatch(targetAction);
            expect(duraCore.reduxStore.getState()["takeLeading"]).toEqual(
                takeLeadingModel.initialState
            );
        }


        setTimeout(() => {
            expect(duraCore.reduxStore.getState()["takeLeading"]).toEqual({name: "新名称0"});
            done();
        }, 2000);
    });

    it("throttle effects", function (done) {
        const throttleModel = {
            namespace: "throttle",
            initialState: {
                name: "张三"
            },
            reducers: {
                onChangeName(state, action) {
                    return {...state, name: action?.payload?.name};
                }
            },
            effects: {
                onChangeName: [
                    function* ({put, delay}, action) {
                        yield delay(500);
                        yield put({
                            type: "throttle/reducers/onChangeName",
                            payload: action?.payload
                        });
                    },
                    {type: "throttle", ms: 1000}
                ]
            }
        };

        const duraCore = createDuraCore({
            models: [throttleModel]
        });

        expect(duraCore.reduxStore.getState()["throttle"]).toEqual(
            throttleModel.initialState
        );

        for (let i = 0; i < 10; i++) {
            const targetAction = {
                type: "throttle/effects/onChangeName",
                payload: {
                    name: `新名称${i}`
                }
            };
            duraCore.reduxStore.dispatch(targetAction);
            expect(duraCore.reduxStore.getState()["throttle"]).toEqual(
                throttleModel.initialState
            );
        }

        setTimeout(
            () =>
                expect(duraCore.reduxStore.getState()["throttle"]).toEqual(
                    throttleModel.initialState
                ),
            400
        );

        setTimeout(() => {
            expect(duraCore.reduxStore.getState()["throttle"]).toEqual({name: "新名称9"});
            done();
        }, 2000);
    });

    it("only namespace", function () {
        const defaultModel = {
            namespace: "default"
        };
        const duraCore = createDuraCore({
            models: [defaultModel]
        });
        expect(duraCore.reduxStore.getState()["default"]).toEqual({});
    });

    it('init state', function () {

        process.env.NODE_ENV = "production"

        const model = {
            namespace: 'default',
            initialState: {
                name: "张三"
            },
            reducers: {},
            effects: {}
        }

        const duraCore = createDuraCore({
            models: [model],
            initialState: {default: {name: "李四"}}
        })

        expect(duraCore.reduxStore.getState()?.default).toEqual({name: '李四'})

    });
});
