(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore'], factory);
    } else {
        // Browser globals
        factory(this._);
    }
}(function (_) {
    var oldUniq, newUniq, isUniq, oldClone, newClone, oldResult, oldExtend, newResult, deepExtend, all, setTimer, clearTimer;

    function isUniq(element, index, array) {
        for(index += 1; index < array.length; index += 1 ) {
            if (_.isEqual(element, array[index])) return false; // duplicate found
        }
        return true;    // no duplicate was found
    };

    // oldClone = _.clone;

    // newClone = function (obj, goDeep) {
    //     var newObj = oldClone(obj);

    //     if (goDeep) {
    //         _.each(obj, function (curProp, curPropName) {
    //             if (_.isObject(curProp) && !_.isFunction(curProp)) {
    //                 newObj[curPropName] = newClone(curProp, true);
    //             }
    //         });
    //     }

    //     return newObj;
    // };

    oldUniq = _.uniq;
    newUniq = function (array) {
        var newArray;
        if (!_.isObject(array)) {
            // delegate to original
            newArray = oldUniq.apply(this, arguments);
        } else {
            newArray = _.filter(array, isUniq);
        }

        return newArray;
    };

    oldResult = _.result;

    newResult = function(object, property) {
        if (property != null) {
            return oldResult(object, property);
        } else {
            return _.isFunction(object) ? object() : object;
        }
    };


    // take a function as a parameter and returns a `getNewCallback` function
    // `getNewCallback` returns a callback function and starts tracking it
    // once all functions created using the `getNewCallback` function have run, the original input function will be called
    // can pass 'true' into one of the callbacks to call it immediately (so that if this is the only callback created, `func` will run)
    all = function (func, onceOnly) {
        var getNewCallback, requiredCallbackIds = [], hasBeenCalled = false, idCounter = 0;

        getNewCallback = function (callImmediately) {
            var newCallbackId = idCounter++, newCallback;

            requiredCallbackIds.push(newCallbackId);

            newCallback = function () {
                // NOTE: this will do nothing if `newCallbackId` isn't in the array
                requiredCallbackIds.splice(_.indexOf(requiredCallbackIds, newCallbackId), 1);

                if (requiredCallbackIds.length === 0 && (!onceOnly || hasBeenCalled === false)) {
                    hasBeenCalled = true;
                    func();
                }
            };

            return callImmediately ? newCallback() : newCallback;
        };

        return getNewCallback;
    };

    // replacement timer functions (for indefinite length)
    (function () {
        var currentTimerId = -1,    // negative to help prevent interference with standard timeouts
            timers = {};

        // set timers (of indefinte length)
        setTimer = function (func, time, id) {
            var thisTimerId;

            if (id != null) {
                thisTimerId = id;
            } else {
                thisTimerId = currentTimerId;
                currentTimerId -= 1;
            }

            // this is the max amount of time any timeout can be set for
            if (time > 2147483647) {
                func = _.partial(setTimer, func, time - 2147483647, thisTimerId);
                time = 2147483647;
            }

            timers[thisTimerId] = setTimeout(func, time);

            return thisTimerId;
        };
        
        clearTimer = function (timerId) {
            clearTimeout(timers[timerId]);
        };
    })();

    oldExtend = _.extend;
    deepExtend = function(obj) {
        var parentRE = /#{\s*?_\s*?}/,
            slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty,
            dontCopyByReference = false,
            params = slice.call(arguments, 1);

        if (!_.isObject(params[params.length - 1])) {
            dontCopyByReference = params.pop();
        }
     
        _.each(params, function(source) {
            for (var prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop])) {
                        if (dontCopyByReference && _.isUndefined(obj[prop]) && _.isObject(source[prop]) && !_.isFunction(source[prop])) {
                            // don't copy by reference (may be an array or an object)
                            obj[prop] = deepExtend(_.isArray(source[prop]) ? [] : {} , source[prop], dontCopyByReference);
                        } else {
                            obj[prop] = source[prop];
                        }
                    } else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
                        if (_.isString(obj[prop])) {
                            obj[prop] = source[prop].replace(parentRE, obj[prop]);
                        }
                    } else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
                        if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
                            console.log(obj[prop], source[prop]);
                            throw 'Error: Cannot combine an array with a non-array (' + prop + ')';
                        } else {
                            obj[prop] = _.reject(deepExtend(obj[prop], source[prop], dontCopyByReference), function (item) { return _.isNull(item);});
                        }
                    } else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
                        if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
                            throw 'Error: Cannot combine an object with a non-object (' + prop + ')';
                        } else {
                            obj[prop] = deepExtend(obj[prop], source[prop], dontCopyByReference);
                        }
                    } else {
                        obj[prop] = source[prop];
                    }
                }
            }
        });
        return obj;
    };
    
    _.mixin({
        uniq: newUniq,
        unique: newUniq,
        capitalise: function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        },
        round: function (number, decimalPlaces, toString) {
            var power = Math.pow(10, decimalPlaces || 0),
                roundedNumber = Math.round(number * power)/power;

            return !toString ? roundedNumber : roundedNumber.toFixed(decimalPlaces || 0);
        },
        toDecimalString: function (numString, base) {
            // see http://stackoverflow.com/questions/1160008/which-keycode-for-escape-key-with-jquery
            // leading zeros are stripped automatically
            var i, j, digits = [0], carry;

            for (i = 0; i < numString.length; i += 1) {
                carry = parseInt(numString.charAt(i), base);

                for (j = 0; j < digits.length; j += 1) {
                    digits[j] = digits[j] * base + carry;
                    carry = digits[j] / 10 | 0;
                    digits[j] %= 10;
                }

                while (carry > 0) {
                    digits.push(carry % 10);
                    carry = carry / 10 | 0;
                }
            }

            return digits.reverse().join('');
        },
        extend: function () {
            var lastIndex = arguments.length - 1, params = _.toArray(arguments), goDeep;

            // go deep if last param is true
            if (_.isBoolean(params[lastIndex])) {
                goDeep = params[lastIndex];
                // remove the last element either way
                params = params.slice(0, lastIndex);
            }

            // call the appropriate function
            return (goDeep === true ? deepExtend : oldExtend).apply(this, params);
        },
        // clone: newClone,
        result: newResult,
        noop: function () {},
        // a replacement version of `bind` to support the `passDefaultContext` param (but no pre-filled arguments)
        proxy: function (callback, context, passDefaultContext) {
            return function () {
                var args = arguments;

                if (passDefaultContext) {
                    args = _.toArray(args);
                    args.unshift(this);
                }

                return callback.apply(context, args);
            };
        },
        // inserts a new element into a sorted array (at the correct location)
        insert: function (originArr, el) {
            var arr = _.clone(originArr);
            arr.splice(_.sortedIndex(arr, el), 0, el);
            return arr;
        },
        // prefills the arguments of a function
        // more arguments passed are added at the end (or optionally at the start)
        prefill: function (func, args, before, context) {
            args = !_.isArray(args) ? _.toArray(args) : args;

            return function () {
                var newArgs = _.toArray(arguments);
                return func.apply(context || this, before ? newArgs.concat(args) : args.concat(newArgs));
            };
        },
        mean: function (arr) {
            return _.reduce(arr, function(memo, num) {
                return memo + num;
            }, 0) / arr.length;
        },
        replaceArgs: function (func) {
            // the function itself is not included
            var args = _.toArray(arguments).slice(1);
            
            return function () {
                // maintain `this` value
                return func.apply(this, args);
            };
        },
        render: function (template, params) {
            return (_.template(template))(params);
        },
        trim: function (text) {
            // includes trim BOM and NBSP
            return text == null ? '' : (text + '').replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        },
        replace: function (oldArr, newContents) {
            _.each(newContents, function (curItem, curItemIndex) {
                oldArr[curItemIndex] = curItem;
            });

            oldArr.splice(newContents.length, oldArr.length - newContents.length);
        },
        mapObject: _.compose(_.object, _.map),
        all: all,
        setTimer: setTimer,
        clearTimer: clearTimer
    });
}));