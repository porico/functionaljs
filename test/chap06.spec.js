"use strict";

// 関数を利用する
// ========

var expect = require('expect.js');

var match = (data, pattern) => {
  return data(pattern);
};


var uncurry = (fun) => {
  return function() {
    var result = fun;
    for (var i = 0; i < arguments.length; i++)
      result = result(arguments[i]);
    return result;
  };
};

var flip = (fun) => {
  return  (f) => {
    return (g) => {
      return fun(g)(f);
    };
  };
};

var id = (any) => {
  return any;
};

var compose = (f) => {
  return (g) => {
    return (arg) => {
      return f(g(arg));
    };
  };
};

var list = {
  empty: (_) => {
    return (pattern) => {
      return pattern.empty();
    };
  },
  cons: (value, list) => {
    return (pattern) => {
      return pattern.cons(value, list);
    };
  },
  isEmpty: (alist) => {
    return match(alist, { // match関数で分岐する
      empty: true,
      cons: (head, tail) => { // headとtailにそれぞれ先頭要素、末尾要素が入る
        return false;
      }
    });
  },
  head: (alist) => {
    return match(alist, {
      empty: null, // 空のリストには先頭要素はありません
      cons: (head, tail) => {
        return head;
      }
    });
  },
  tail: (alist) => {
    return match(alist, {
      empty: null,  // 空のリストには末尾要素はありません
      cons: (head, tail) => {
        return tail;
      }
    });
  },
  toArray: (alist) => {
    var toArrayAux = (alist,accumulator) => {
      return match(alist, {
        empty: (_) => {
          return accumulator;
        },
        cons: (head, tail) => {
          return toArrayAux(tail, accumulator.concat(head));
        }
      });
    };
    return toArrayAux(alist, []);
  }
};
// ## 関数の基本
describe('関数の基本', () => {
  var seq = {
    match: (data, pattern) => {
      return data(pattern);
    },
    empty: (_) => {
      return (pattern) => {
        return pattern.empty();
      };
    },
    cons: (value, list) => {
      return (pattern) => {
        return pattern.cons(value, list);
      };
    },
    isEmpty: (list) => {
      return match(list, { // match関数で分岐する
        empty: true,
        cons: (head, tail) => { // headとtailにそれぞれ先頭要素、末尾要素が入る
          return false;
        }
      });
    },
    head: (list) => {
      return match(list, {
        empty: null, // 空のリストには先頭要素はありません
        cons: (head, tail) => {
          return head;
        }
      });
    },
    tail: (list) => {
      return match(list, {
        empty: null,  // 空のリストには末尾要素はありません
        cons: (head, tail) => {
          return tail;
        }
      });
    }
  };
  var infiniteLoop = (_) => {
    return infiniteLoop(_);
  };
  describe('関数の定義', () => {
    it('恒等関数の定義', (next) => {
      /* #@range_begin(identity_function_definition) */
      var identity = (any) => {
        return any;
      };
      /* #@range_end(identity_function_definition) */
      /* #@range_begin(identity_function_test) */
      expect(
        identity(1)
      ).to.eql(
        1
      );
      expect(
        identity("a")
      ).to.eql(
        "a"
      );
      /* #@range_end(identity_function_test) */
      next();
    });
    it('succ関数の定義', (next) => {
      /* #@range_begin(succ_function_definition) */
      var succ = (n) => {
        return n + 1;
      };
      /* #@range_end(succ_function_definition) */
      /* テスト */
      expect(
        succ(0)  // 0 を引数にsucc関数を適用する
      ).to.eql(
        1
      );
      /* #@range_begin(succ_function_test) */
      var succ = (n) => { // nは仮引数 
        return n + 1;
      };
      expect(
        succ(1)  // 数値1をsucc関数を適用する
      ).to.eql(
        2
      );
      /* #@range_end(succ_function_test) */
      next();
    });
    it('複数の引数を持つ関数', (next) => {
      /* #@range_begin(add_function_definition) */
      // add:: (NUM, NUM) => NUM
      var add = (n, m) => {
        return n + m;
      };
      /* #@range_end(add_function_definition) */
      /* テスト */
      expect(
        add(0,1)
      ).to.eql(
        1
      );
      next();
    });
    it('引数を参照しない関数', (next) => {
      /* #@range_begin(constant_one_function) */
      var alwaysOne = (x) => {
        return 1;
      };
      /* #@range_end(constant_one_function) */
      expect(
        alwaysOne(1)
      ).to.eql(
        1
      );
      expect(
        alwaysOne("a")
      ).to.eql(
        1
      );
      /* #@range_begin(left_function) */
      var left = (x,y) => {
        return x;
      };
      /* #@range_end(left_function) */
      expect(
        left(1,2)
      ).to.eql(
        1
      );
      next();
    });
    it('関数の変数へのバインド', (next) => {
      /* #@range_begin(function_bound_to_variable) */
      var succ = (x) => {
        return x + 1;
      };
      /* #@range_end(function_bound_to_variable) */
      next();
    });
  });
  // ### 関数の適用
  describe('関数の適用', () => {
    // #### 関数の評価戦略
    describe('関数の評価戦略', () => {
      it('JavaScriptの正格評価', (next) => {
        /* #@range_begin(strict_evaluation_in_javascript) */
        var left = (x,y) => {
          return x;
        };
        var infiniteLoop = (_) => {
          return infiniteLoop(_);
        };
        /* このテストは無限ループになるのでコメントアウトしています
         expect(
           left(1, infiniteLoop())
         ).to.eql(
           1
         )
         */
        /* #@range_end(strict_evaluation_in_javascript) */
        next();
      });
      it('条件文と遅延評価', (next) => {
        /* #@range_begin(conditional_is_nonstrict) */
        var infiniteLoop = () => {
          return infiniteLoop();
        };

        var conditional = (n) => {
          if(n === 1) {
            return true;
          } else {
            /* 条件文が真の場合には評価されない */
            return infiniteLoop();
          }
        };
        expect(
          conditional(1)
        ).to.eql(
          true // 無限ループに陥いることなく計算に成功する
        );
        /* #@range_end(conditional_is_nonstrict) */
        next();
      });
      it('乗算の遅延評価', (next) => {
        var infiniteLoop = () => {
          return infiniteLoop();
        };
        /* #@range_begin(multiply_lazy_evaluation) */
        var lazyMultiply = (funX,funY) => {
          var x = funX();

          if(x === 0){
            return 0;         // xが0ならば、funYは評価しない
          } else {
            return x * funY(); // ここで初めてfunYを評価する
          }
        };
        /* #@range_end(multiply_lazy_evaluation) */
        /* #@range_begin(multiply_lazy_evaluation_test) */
        expect(
          lazyMultiply((_) => { // 値を関数でラッピングする
            return 0;
          }, (_) => {
            return infiniteLoop(); // ここが評価されると無限ループに陥いる
          })
        ).to.eql(
          0
        );
        /* #@range_end(multiply_lazy_evaluation_test) */
        next();
      });
    });
    // #### サンクで無限を表現する
    describe('サンクで無限を表現する', () => {
      /* #@range_begin(definition_thunk_force) */
      var thunk = (func) => {
        return (arg) => {
          return (_) => { // サンクを返す
            return func(arg);
          };
        };
      };
      var force = (thunk) => {
        return thunk();
      };
      /* #@range_end(definition_thunk_force) */
      it('thunkによる遅延評価', (next) => {
        /* #@range_begin(nonstrict_function_via_thunk) */
        var multiply = (thunkX,thunkY) => {
          if(force(thunkX) === 0){
            return 0;
          } else {
            return thunkX() * thunkY(); // サンクを評価する
          }
        };
        var id = (any) => {
          return any;
        };
        expect(
          multiply((_) => { // サンクで包む
            return 0;
          }, (_) => {
            return 2;
          })
        ).to.eql(
          0
        );
        /* #@range_end(nonstrict_function_via_thunk) */
        next();
      });
      it('thunkによる条件式', (next) => {
        /* #@range_begin(functionalIf_via_thunk) */
        var functionalIf = (predicate, trueClauseThunk, falseClauseThunk) => {
          if(predicate){
            return trueClauseThunk(); // 判定式が真の場合に実行する
          } else {
            return falseClauseThunk();  // 判定式が真の場合に実行する
          }
        };
        /* テスト */
        expect(
          functionalIf((2 < 3), (_) => {
            return 2;
          }, (_) => {
            return 3;
          })
        ).to.eql(
          2
        );
        /* #@range_end(functionalIf_via_thunk) */
        next();
      });
    });
    describe('thunkによるStream型', () => {
      /* #@range_begin(stream_with_thunk) */
      var stream = {
        match: (data, pattern) => {
          return data(pattern);
        },
        empty: (_) => {
          return (pattern) => {
            return pattern.empty();
          };
        },
        cons: (head,tailThunk) => {
          return (pattern) => {
            return pattern.cons(head,tailThunk);
          };
        },
        /* head:: STREAM[T] => T */
        /* ストリーム型headの定義は、リスト型headと同じ */
        head: (astream) => {
          return stream.match(astream,{
            empty: (_) => { return null; },
            cons: (value, tailThunk) => { return value; }
          });
        },
        /* tail:: STREAM[T] => STREAM[T] */
        tail: (astream) => {
          return stream.match(astream,{
            empty: (_) => { return null; },
            cons: (head, tailThunk) => {
              return tailThunk(); // ここで初めてサンクを評価する
            }
          });
        }
      };
      /* #@range_end(stream_with_thunk) */
      it("stream#cons", (next) => {
        /* #@range_begin(stream_with_thunk_test) */
        var theStream = stream.cons(1, (_) => { // 第2引数にサンクを渡す
          return stream.cons(2,(_) => {     // 第2引数にサンクを渡す
            return stream.empty();
          });
        });
        expect(
          stream.head(theStream)  // ストリームの先頭要素を取り出す
        ).to.eql(
          1
        );
        /* #@range_end(stream_with_thunk_test) */
        next();
      });
      describe("無限ストリーム", () => {
        var stream = {
          empty: (_) => {
            return (pattern) => {
              return pattern.empty();
            };
          },
          cons: (head,tailThunk) => {
            return (pattern) => {
              return pattern.cons(head,tailThunk);
            };
          },
          /* head:: STREAM[T] => T */
          /* ストリーム型headの定義は、リスト型headと同じ */
          head: (astream) => {
            return match(astream,{
              empty: (_) => { return null; },
              cons: (value, tailThunk) => { return value; }
            });
          },
          /* tail:: STREAM[T] => STREAM[T] */
          tail: (astream) => {
            return match(astream,{
              empty: (_) => { return null; },
              cons: (head, tailThunk) => {
                return tailThunk();  // ここで初めてサンクを評価する
              }
            });
          },
          take: (astream, n) => {
            return match(astream,{
              empty: (_) => {
                return list.empty();
              },
              cons: (head,tailThunk) => {
                if(n === 0) {
                  return list.empty();
                } else {
                  return list.cons(head,stream.take(tailThunk(),(n -1)));
                }
              }
            });
          }
        };
        /* #@range_begin(infinite_ones) */
        /* ones = 1,1,1,1,... */
        var ones = stream.cons(1, (_) => {
          return ones; // onesを再帰的に呼び出す
        });
        /* #@range_end(infinite_ones) */
        /* #@range_begin(infinite_integer) */
        var enumFrom = (n) => {
          return stream.cons(n, (_) => {
            return enumFrom(n + 1);
          });
        };
        /* #@range_end(infinite_integer) */
        /* #@range_begin(infinite_ones_test) */
        expect(
          stream.head(ones) // 最初の要素を取りだす
        ).to.eql(
          1
        );
        expect(
          stream.head(stream.tail(ones))  // 2番目の要素を取りだす
        ).to.eql(
          1
        );
        /* #@range_end(infinite_ones_test) */
        it("素数列を作る", (next) => {
          var sieve = (astream) => {
            var head = stream.head(astream);
            var tail = stream.tail(astream);
            var mark = (astream, k, m) => {
              var head = stream.head(astream);
              var tail = stream.tail(astream);
              if(k === m) {
                return stream.cons(0,(_) => {
                  return mark(tail, 1, m);
                });
              } else {
                return stream.cons(head, (_) => {
                  return mark(tail, k+1, m);
                });
              }
            };
            if(head === 0) {
              return sieve(tail);
            } else {
              return stream.cons(head, (_) => {
                return sieve(mark(tail, 1, head));
              });
            }
          };
          expect(
            list.toArray(stream.take(sieve(enumFrom(2)), 10))
          ).to.eql(
            [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
          );
          next();
        });
        it("無限の整数列をテストする", (next) => {
          this.timeout(3000);
          var list = {
            match: (data, pattern) => {
              return data(pattern);
            },
            empty: (_) => {
              return (pattern) => {
                return pattern.empty();
              };
            },
            cons: (value, list) => {
              return (pattern) => {
                return pattern.cons(value, list);
              };
            },
            isEmpty: (alist) => {
              return match(alist, { // match関数で分岐する
                empty: true,
                cons: (head, tail) => { // headとtailにそれぞれ先頭要素、末尾要素が入る
                  return false;
                }
              });
            },
            head: (alist) => {
              return match(alist, {
                empty: null, // 空のリストには先頭要素はありません
                cons: (head, tail) => {
                  return head;
                }
              });
            },
            tail: (alist) => {
              return match(alist, {
                empty: null,  // 空のリストには末尾要素はありません
                cons: (head, tail) => {
                  return tail;
                }
              });
            },
            /* #@range_begin(list_toArray) */
            toArray: (alist) => {
              var toArrayHelper = (alist,accumulator) => {
                return list.match(alist, {
                  empty: (_) => {
                    return accumulator;
                  },
                  cons: (head, tail) => {
                    return toArrayHelper(tail,
                                         accumulator.concat(head));
                  }
                });
              };
              return toArrayHelper(alist, []);
            }
            /* #@range_end(list_toArray) */
          };
          var stream = {
            match: (data, pattern) => {
              return data(pattern);
            },
            empty: (_) => {
              return (pattern) => {
                return pattern.empty();
              };
            },
            cons: (head,tailThunk) => {
              return (pattern) => {
                return pattern.cons(head,tailThunk);
              };
            },
            head: (astream) => {
              return match(astream,{
                empty: (_) => { return null; },
                cons: (value, tailThunk) => { return value; }
              });
            },
            tail: (astream) => {
              return match(astream,{
                empty: (_) => { return null; },
                cons: (head, tailThunk) => {
                  return tailThunk();  // ここで初めてサンクを評価する
                }
              });
            },
            /* #@range_begin(stream_take) */
            /* take:: (STREAM[T], NUM) => LIST[T] */
            take: (astream, n) => {
              return stream.match(astream,{
                empty: (_) => {              // ストリームが空のケース
                  return list.empty();
                },
                cons: (head,tailThunk) => {  // ストリームが空でないケース 
                  if(n === 0) {
                    return list.empty();
                  } else {
                    return list.cons(head,   // リストを生成する
                                     stream.take(tailThunk(),(n -1)));
                  }
                }
              });
            },
            /* #@range_end(stream_take) */
            /* #@range_begin(stream_filter) */
            /* filter :: (STREAM[T], FUN[T => BOOL]) => STREAM[T] */
            filter: (astream,predicate) => {
              return match(astream,{
                empty: (_) => {
                  return stream.empty();
                },
                cons: (head,tailThunk) => {
                  if(predicate(head)){ // 先頭の要素が条件に合致する場合、その要素を結果のリストの先頭に追加する
                    return stream.cons(head,(_) => {
                      return stream.filter(tailThunk(),predicate);
                    });
                  } else { // 先頭の要素が条件に合致しない場合、末尾要素に対してfilterを再帰的に呼び出す
                    return stream.filter(tailThunk(),predicate);
                  }
                }
              });
            }
            /* #@range_end(stream_filter) */
          };
          expect(
            stream.head(enumFrom(1))
          ).to.eql(
            1
          );
          expect(
            stream.head(stream.tail(enumFrom(1)))
          ).to.eql(
            2
          );
          /* #@range_begin(infinite_integer_test) */
          expect(
            list.toArray( // ストリームを配列に変換する
              stream.take(enumFrom(1),4) // 無限の整数列から4個の要素を取り出す 
            )
          ).to.eql(
            [1,2,3,4]
          );
          /* #@range_end(infinite_integer_test) */
          /* #@range_begin(stream_filter_test) */
          expect(
            /* 無限の整数列から最初の4つの要素を取り出し、それを配列に変換する */
            list.toArray(stream.take(enumFrom(1), 4))
          ).to.eql(
            [1,2,3,4]
          );
          /* #@range_end(stream_filter_test) */
          /* #@range_begin(infinite_even_integer) */
          var even = (n) => {
            return 0 === (n % 2);
          };
          var evenIntegers = stream.filter(enumFrom(1),even);
          expect(
            list.toArray(stream.take(evenIntegers, 4))
          ).to.eql(
            [ 2, 4, 6, 8 ]
          );
          /* #@range_end(infinite_even_integer) */
          next();
        });
      });
    }); // thunk
    describe('再帰的な関数適用', () => {
      var seq  = {
        match: (data, pattern) => {
          return data(pattern);
        },
        compose: (f,g) => {
          return (arg) => {
            return f(g(arg));
          };
        },
        flip: (fun) => {
          return  (f) => {
            return (g) => {
              return fun(g)(f);
            };
          };
        },
        empty: (_) => {
          return (pattern) => {
            return pattern.empty();
          };
        },
        cons: (value, list) => {
          return (pattern) => {
            return pattern.cons(value, list);
          };
        },
        head: (list) => {
          var self = this;
          return self.match(list, {
            empty: (_) => {
              return null;
            },
            cons: (head, tail) => {
              return head;
            }
          });
        },
        tail: (list) => {
          var self = this;
          return self.match(list, {
            empty: (_) => {
              return null;
            },
            cons: (head, tail) => {
              return tail;
            },
          });
        },
        isEmpty: (list) => {
          var self = this;
          return self.match(list, {
            empty: (_) => {
              return true;
            },
            cons: (head, tail) => {
              return false;
            }
          });
        },
        /* concat:: LIST[T] -> LIST[T] -> LIST[T] */
        concat: (xs) => {
          var self = this;
          return (ys) => {
            if(self.isEmpty(xs)){
              return ys;
            } else {
              return self.cons(self.head(xs),(self.concat(self.tail(xs))(ys)));
            }
          };
        },
        last: (xs) => {
          var self = this;
          return self.match(xs, {
            empty: (_) => {
              return null;
            },
            cons: (head, tail) => {
              return self.match(tail, {
                empty: (_) => {
                  return head;
                },
                cons: (head, _) => {
                  return self.last(tail);
                }
              });
            }
          });
        },
        /* concat:: LIST[LIST[T]] -> LIST[T]  */
        join: (list_of_list) => {
          var self = this;
          if(self.isEmpty(list_of_list)){
            return self.empty();
          } else {
            return self.concat(seq.head(list_of_list))(self.join(self.tail(list_of_list)));
          }
        },
        /* foldr:: LIST[T] -> T -> FUNC[T -> LIST] -> T */
        foldr: (list) => {
          var self = this;
          return (accumulator) => {
            return (glue) => {
              expect(glue).to.a('function');
              return self.match(list,{
                empty: (_) => {
                  return accumulator;
                },
                cons: (head, tail) => {
                  return glue(head)(self.foldr(tail)(accumulator)(glue));
                }
              });
            };
          };
        },
        /* map:: LIST[T] -> FUNC[T -> T] -> LIST[T] */
        map: (list, transform) => {
          var self = this;
          return self.match(list,{
            empty: (_) => {
              return self.empty();
            },
            cons: (x,xs) => {
              return self.cons(transform(x),self.map(xs,transform));
            }
          });
        },
        /* #@range_begin(list_reverse) */
        /* #@range_end(list_reverse) */
        /* #@range_begin(list_filter) */
        filter: (list) => {
          var self = this;
          return (predicate) => {
            expect(predicate).to.a('function');
            var filterAux = (list, accumulator) => {
              return self.match(list,{
                empty: (_) => {
                  return accumulator;
                },
                cons: (head,tail) => {
                  if(predicate(head) === true){
                    return self.concat(self.concat(accumulator)(self.cons(head, self.empty())))(filterAux(tail, accumulator));
                  } else  {
                    return filterAux(tail, accumulator);
                  }
                }
              });
            };
            return filterAux(list, self.empty());
          };
        },
        /* #@range_end(list_filter) */
        toArray: (list) => {
          var self = this;
          var toArrayHelper = (list,accumulator) => {
            return self.match(list, {
              empty: (_) => {
                return accumulator;  // 空のリストの場合は終了
              },
              cons: (head, tail) => {
                return toArrayHelper(tail, accumulator.concat(head));
              }
            });
          };
          return toArrayHelper(list, []);
        }
      };
      it('dividesTimesの例', (next) => {
        /* #@range_begin(dividesTimes) */
        var multiplyOf = (n,m) => {
          if(m % n === 0) {
            return true;
          } else {
            return false;
          }
        };
        expect(
          multiplyOf(3,6)
        ).to.eql(
          true
        );
        var dividesTimes = (n, m) => {
          var dividesTimesHelper = (n,m,accumulator) => {
            if(n > m) {
              return accumulator;
            } else {
              if(multiplyOf(n,m)) {
                return dividesTimesHelper(n,m - n,accumulator + 1);
              } else {
                return accumulator;
              }
            }
          };
          return dividesTimesHelper(n,m,0);
        };
        expect(
          dividesTimes(3,6)
        ).to.eql(
          2
        );
        expect(
          dividesTimes(3,7)
        ).to.eql(
          0
        );
        /* #@range_end(dividesTimes) */
        next();
      });
      it('list#lastをテストする', (next) => {
        /* #@range_begin(list_last_test) */
        /* list = [1,2,3,4] */
        var list = seq.cons(1,seq.cons(2,seq.cons(3,seq.cons(4,seq.empty()))));
        expect(
          seq.last(list)
        ).to.eql(
          4
        );
        /* #@range_end(list_last_test) */
        next();
      });
      it('list#mapをテストする', (next) => {
        /* #@range_begin(list_map_test) */
        /* list = [1,2,3,4] */
        var list = seq.cons(1,seq.cons(2,seq.cons(3,seq.cons(4,seq.empty))));
        expect(
          seq.toArray(seq.map(list,(item) => {
            return item * 2;
          }))
        ).to.eql(
          [2,4,6,8]
        );
        /* #@range_end(list_map_test) */
        next();
      });
      it('list#filterテストする', (next) => {
        /* #@range_begin(list_filter_test) */
        /* list = [1,2,3,4] */
        var list = seq.cons(1,seq.cons(2,seq.cons(3,seq.cons(4,seq.empty))));
        var even = (n) => {
          return (n % 2) === 0;
        };
        expect(
          seq.toArray(seq.filter(list)(even))
        ).to.eql(
          [2,4]
        );
        /* #@range_end(list_filter_test) */
        next();
      });
      it('list#reverseをテストする', (next) => {
        var reverse = (list,accumulator) => {
          return seq.match(list, {
            empty: (_) => {
              return accumulator;  // 空のリストの場合は終了
            },
            cons: (head, tail) => {
              return reverse(tail, seq.cons(head, accumulator));
            }
          });
        };
        /**************** テスト ****************/
        /* #@range_begin(list_reverse_test) */
        var list = seq.cons(1, seq.cons(2,seq.empty()));
        expect(
          seq.toArray(reverse(list, seq.empty()))
        ).to.eql(
          [2,1]
        );
        /* #@range_end(list_reverse_test) */
        next();
      });
    });
    describe('関数を合成する', () => {
      it('関数を連続して適用する', (next) => {
        /* #@range_begin(function_applied_sequentially) */
        var double = (n) => {
          return n * 2;
        };
        var negate = (n) => {
          return - n;
        };
        expect(
          negate(double(2))
        ).to.eql(
            -4
        );
        /* #@range_end(function_applied_sequentially) */
        /* #@range_begin(function_applied_twice) */
        var twice = (f,arg) => {
          return f(f(arg));
        };
        var succ = (x) => {
          return x + 1;
        };
        expect(
          twice(succ,2)
        ).to.eql(
          4
        );
        /* #@range_end(function_applied_twice) */
        /* #@range_begin(function_applied_ntimes) */
        var applyNTimes = (n, func) => {
          var applyNTimesHelper = (n, func) => {
            return (init) => {
              return (accumulator) => {
                if(n === 0) {
                  return accumulator;
                } else {
                  return applyNTimesHelper(n - 1,func)(init)(func(accumulator));
                };
              };
            };
          };
          return applyNTimesHelper(n,func)(0);
        };
        expect(
          applyNTimes(4,succ)(0)
        ).to.eql(
          4
        );
        /* #@range_end(function_applied_ntimes) */
        next();
      });
      describe('関数合成', () => {
        /* #@range_begin(compose_definition) */
        var compose = (f,g,arg) => {
          return f(g(arg));
        };
        /* #@range_end(compose_definition) */
        it('否定を合成する', (next) => {
          /* #@range_begin(compose_negation) */
          var negate = (n) => {
            return -1 *  n;
          };
          expect(
            compose(negate,negate, 2)
          ).to.eql(
            2
          );
          /* #@range_end(compose_negation) */
          next();
        });
        it('1個の引数の関数を合成する', (next) => {
          /* #@range_begin(compose_one_argument_functions) */
          var succ = (n) => {
            return n + 1;
          };
          var prev = (n) => {
            return n - 1;
          };
          expect(
            compose(prev,succ,5)
          ).to.eql(
            5
          );
          expect(
            compose(prev,succ,2)
          ).to.eql(
            2
          );
          /* #@range_end(compose_one_argument_functions) */
          next();
        });
      });
      it('再帰によるlast', (next) => {
        /* #@range_begin(list_last_recursive) */
        var last = (list) => {
          return seq.match(list, {
            empty: (_) => {
              return null;
            },
            cons: (head, tail) => {
              return seq.match(tail, {
                empty: (_) => {
                  return head;
                },
                cons: (head, _) => {
                  return last(tail);
                }
              });
            }
          });
        };
        var sequence = seq.cons(1,seq.cons(2,seq.cons(3,seq.cons(4,seq.empty()))));
        expect(
          last(sequence)
        ).to.eql(
          4
        );
        /* #@range_end(list_last_recursive) */
        next();
      });
      it('合成によるlast', (next) => {
        /* #@range_begin(list_last_compose) */
        var sequence = seq.cons(1,seq.cons(2,seq.cons(3,seq.cons(4,seq.empty()))));
        var last = (list) => {
          return compose(seq.head)(seq.reverse)(list);
        };
        /* #@range_end(list_last_compose) */
        next();
      });
    }); // 関数を合成する
  }); // 関数の適用
}); // 関数の基本
// ## 関数と参照透過性
describe('関数と参照透過性', () => {
  // ### 関数の純粋性
  it('関数の純粋性', (next) => {
    var succ = (n) => {
      return n + 1;
    };
    /* #@range_begin(succ_has_referential_transparency) */
    expect(
      succ(1)
    ).to.eql(
      succ(1)
    );
    /* #@range_end(succ_has_referential_transparency) */
    next();
  });
  describe('副作用が参照透過性を損なうこと', () => {
    it('ファイルを操作する', (next) => {
      /* #@range_begin(fileio_destroys_referential_transparency) */
      /* fsモジュールを変数fsにバインドする */
      var fs = require('fs');
      /* テストの実行前にあらかじめ "This is a test."
       という文字列をファイルに書きこんでおく。 */
      fs.writeFileSync('test/resources/file.txt', "This is a test.");

      /* 第1回目のファイルの読込 */
      var text = fs.readFileSync("test/resources/file.txt",'utf8');
      expect(
        fs.readFileSync("test/resources/file.txt", 'utf8')
      ).to.eql(
        "This is a test."
      );
      /* 途中でのファイルへの書込み */
      fs.writeFileSync('test/resources/file.txt',
                       "This is another test.");

      /* 第2回目のファイルの読込 */
      expect(
        fs.readFileSync("test/resources/file.txt", 'utf8')
      ).to.eql(/* 最初の readFileSync関数の結果と異なっている */
        "This is another test."
      );
      /* #@range_end(fileio_destroys_referential_transparency) */
      next();
    });
  });
  it('画面出力が参照透過性を損なうこと', (next) => {
    /* #@range_begin(log_destroys_referential_transparency) */
    expect(
      console.log("this is a test")
    ).to.eql(
      console.log("this is anoter test")
    );
    /* #@range_end(log_destroys_referential_transparency) */
    next();
  });
  // ### 副作用への対処
  describe('副作用への対処', () => {
    describe('ストリームによる入出力', () => {
      var stream = {
        match: (data, pattern) => {
          return data(pattern);
        },
        empty: (_) => {
          return (pattern) => {
            return pattern.empty();
          };
        },
        cons: (headThunk,tailThunk) => {
          return (pattern) => {
            return pattern.cons(headThunk,tailThunk);
          };
        },
        head: (astream) => {
          return stream.match(astream,{
            empty: (_) => { return null; },
            cons: (headThunk, tailThunk) => { return headThunk(); }
          });
        },
        tail: (astream) => {
          return stream.match(astream,{
            empty: (_) => { return null; },
            cons: (head, tailThunk) => {
              return tailThunk(); // ここで初めてサンクを評価する
            }
          });
        },
        foldr: (astream) => {
          return (accumulator) => {
            return (callback) => {
              return stream.match(astream,{
                empty: (_) => {
                  return accumulator;
                },
                cons: (headThunk, tailThunk) => {
                  return callback(headThunk())(stream.foldr(tailThunk())(accumulator)(callback));
                }
              });
            };
          };
        } 
      };
      var Req =  {
        match: (data, pattern) => {
          return data(pattern);
        },
        readFile: (path) => {
          return (pattern) => {
            return pattern.readFile(path);
          };
        },
        writeFile: (path, content) => {
          return (pattern) => {
            return pattern.writeFile(path, content);
          };
        },
        writeConsole: (content) => {
          return (pattern) => {
            return pattern.writeConsole(content);
          };
        }
      };
      var Res = {
        match: (data, pattern) => {
          return data(pattern);
        },
        done: (_) => {
          return (pattern) => {
            return pattern.done(_);
          };
        },
        success: (content) => {
          return content;
          // return (pattern) => {
          //   return pattern.successRead(content);
          // };
        }
      };
      var io = {
        executeRequest: (req) => {
          var fs = require('fs');
          return stream.match(req, {
            readFile: (path) => {
              return Res.success(fs.readFileSync(path, 'utf8'));
            },
            writeConsole: (content) => {
              console.log(content);
              return Res.success(undefined);
            }
          });
        },
        // executeMain:: FUN[STREAM[Res] => STREAM[Req]] => IO()
        executeMain: (main) => {
          return stream.foldr(main)(stream.empty())((response) => {
            return (accumulator) => {
              return stream.cons((_) => {
                return response;
              }, (_) => {
                return accumulator;
              });
            }; 
          }); 
        }
      };
      var cat  = (path) => {
        return (responses) => {
          return stream.cons((_) => { return Req.readFile(path); }, (_) => {
            return stream.cons((_) => {Req.writeConsole("test");}, (_) => {
              // return cat(path)(stream.tail(responses));
              return cat(path)(stream.tail(stream.tail(responses)));
            });
          });
        };
      };
      // expect(
      //   io.executeMain(cat("/var/log/syslog"))
      // ).to.eql(
      //   1
      // );
    });
    it('kestrelコンビネーター', (next) => {
      /* #@range_begin(kestrel_combinator) */
      var kestrel = (x) => {
        return (y) => {
          return x;
        };
      };
      /* #@range_end(kestrel_combinator) */
      /* #@range_begin(kestrel_combinator_test) */
      expect(
        kestrel(1)(2)
      ).to.eql(
        1
      );
      /*
       expect(
         kestrel(1)(infiniteLoop())
       ).to.eql(
         1
       );
       */
      /* #@range_end(kestrel_combinator_test) */
      /*
      setTimeout(function(){ // happens 0.5 seconds later:
        expect(
       kestrel(1)(infiniteLoop())
        ).to.eql(
       1
        );
        next(); // this tells mocha to run the next test
      },500);
      */
      next();
    });
  });
  describe('tapコンビネーターによる副作用の分離', () => {
    /* #@range_begin(tap_combinator) */
    var tap = (target,sideEffect) => {
      sideEffect(target); // 副作用を実行する
      return target;
    };
    /* #@range_end(tap_combinator) */
    it('tapコンビネーターによる console.logのテスト', (next) => {
      var succ = (n) => {
        return n + 1;
      };
      /* #@range_begin(tap_combinator_test_in_console) */
      /* 画面出力という副作用を実行する関数 */
      var consoleSideEffect = (any) => {
        console.log(any);
      };
      expect(
        tap(succ(1), consoleSideEffect)
      ).to.eql(
        tap(succ(1), consoleSideEffect)
      );
      /* #@range_end(tap_combinator_test_in_console) */
      var updateSideEffect = (n) => {
        n = n + 1;
        return n;
      };
      expect(
        tap(succ(2), updateSideEffect)
      ).to.eql(
        tap(succ(2), updateSideEffect)
      );
      next();
    });
    it('tapコンビネーターによるオブジェクトの操作', (next) => {
      /* #@range_begin(tap_combinator_test_in_object) */
      var updateSideEffect = (obj) => {
        obj.name = "C3PO";
        return obj;
      };
      var r2d2 = {name: "R2D2"};
      expect(
        tap(r2d2, updateSideEffect).name
      ).to.eql(
        tap(r2d2, updateSideEffect).name
      );
      expect(
        r2d2.name
      ).to.eql(
        "C3PO"
      );
      /* #@range_end(tap_combinator_test_in_object) */
      next();
    });
    it('tapコンビネーターによるファイル入出力のテストは失敗する', (next) => {
      var fs = require('fs'); // fsモジュールを変数fsにバインドする
      /* #@range_begin(tap_combinator_test_in_fileio) */
      /* あらかじめ文字列をファイルに書きこんでおく */
      fs.writeFileSync('test/resources/file.txt', "This is a test.");

      /* ファイルからの読込という副作用を実行する */
      var IOSideEffect = (_) => {
        var content = fs.readFileSync("test/resources/file.txt",
                                      'utf8');
        fs.writeFileSync('test/resources/file.txt',
                         "This is another test.");
        return content;
      };

      expect(
        tap(fs.readFileSync("test/resources/file.txt", 'utf8'),
            IOSideEffect)
      ).not.to.eql( // 同じ引数で適用しているのに両者は等しくない
        tap(fs.readFileSync("test/resources/file.txt", 'utf8'),
            IOSideEffect)
      );
      /* #@range_end(tap_combinator_test_in_fileio) */
      next();
    });
  });
});
